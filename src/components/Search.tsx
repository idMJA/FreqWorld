"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { searchRadio } from "../utils/api";
import { getColorByLetter } from "../utils/colorUtils";
import { detectLocationFromText } from "../utils/country";
import Image from "next/image";

// Use the same interfaces as StationFinder for consistency
interface RadioStation {
	id: string;
	title: string;
	subtitle: string;
	countryCode?: string;
	color?: string;
	streamUrl?: string;
}

interface SearchProps {
	isOpen: boolean;
	onClose: () => void;
}

// Interface for the addRecentlyPlayedStation function on window
interface WindowWithAddRecentlyPlayed extends Window {
	addRecentlyPlayedStation?: (station: {
		id: string;
		title: string;
		subtitle?: string;
		place?: string;
		country?: string;
		countryCode?: string;
		color?: string;
	}) => void;
}

const Search = ({ isOpen, onClose }: SearchProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<RadioStation[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchVisible, setSearchVisible] = useState(false);

	const searchModalRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const pathname = usePathname();

	// Handle component mount/unmount animations
	useEffect(() => {
		if (isOpen) {
			// Add a slight delay for the animation to show properly
			setTimeout(() => {
				setSearchVisible(true);
				setTimeout(() => {
					searchInputRef.current?.focus();
				}, 300);
			}, 50);
		} else {
			setSearchVisible(false);
			// Reset state when fully closed
			setTimeout(() => {
				setSearchResults([]);
				setSearchQuery("");
				setError(null);
			}, 300); // Match this with the CSS transition time
		}
	}, [isOpen]);

	// Close search modal when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchModalRef.current &&
				!searchModalRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	// Using the exact handleSearch function from StationFinder
	const handleSearch = async () => {
		if (!searchQuery.trim()) {
			setSearchResults([]);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const results = await searchRadio(searchQuery);

			// Process search results to get consistent format
			// According to the spec.json, we need to filter for "channel" type
			const stations = results
				.filter((result) => result._source.type === "channel")
				.map((result) => {
					// Extract the channel ID from the URL
					// The format is typically /listen/station-name/channelId
					const urlParts = result._source.url.split("/");
					const id = urlParts[urlParts.length - 1];
					const subtitle = result._source.subtitle;

					// Use our centralized location detection
					const titleLocationInfo = detectLocationFromText(
						result._source.title,
					);
					const subtitleLocationInfo = detectLocationFromText(subtitle);

					// Prefer subtitle location over title location
					let countryCode = "";
					let displaySubtitle = subtitle;

					if (subtitleLocationInfo.countryCode) {
						countryCode = subtitleLocationInfo.countryCode;
						// Keep original subtitle as it likely contains more information
					} else if (titleLocationInfo.countryCode) {
						countryCode = titleLocationInfo.countryCode;
						// If subtitle is empty or "Found via search", use the location name we found
						if (!subtitle || subtitle === "Found via search") {
							displaySubtitle = titleLocationInfo.locationName;
						}
					}

					const color = getColorByLetter(result._source.title);

					return {
						id: id,
						title: result._source.title,
						subtitle: displaySubtitle,
						countryCode: countryCode,
						color: color,
						streamUrl: result._source.stream,
					};
				});

			setSearchResults(stations);
		} catch (err) {
			console.error("Error searching stations:", err);
			setError("Failed to search stations. Please try again.");
			setSearchResults([]);
		} finally {
			setLoading(false);
		}
	};

	// Using handleSubmit from StationFinder with added real-time search
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		void handleSearch();
	};

	// Handle input change for real-time search (addition to StationFinder)
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);

		// Debounce search to avoid too many requests
		const timeoutId = setTimeout(() => {
			void handleSearch();
		}, 300); // 300ms delay

		return () => clearTimeout(timeoutId);
	};

	// Using the same handleStationSelect logic from StationFinder with localStorage
	const handleStationSelect = (station: RadioStation) => {
		// If subtitle contains comma, split and process it properly
		let placeTitle = undefined;
		let country = undefined;

		if (station.subtitle && station.subtitle !== "Found via search") {
			const parts = station.subtitle.split(",").map((part) => part.trim());

			if (parts.length > 1) {
				// If multiple parts, first part is usually the place, last part is country
				placeTitle = parts[0];
				country = parts[parts.length - 1];
			} else if (parts.length === 1) {
				// If only one part, use it for both (better than nothing)
				placeTitle = parts[0];
				country = parts[0];
			}
		}

		// Fallback to countryCode if no location found in subtitle
		if (!placeTitle && station.countryCode) {
			placeTitle = station.countryCode;
		}

		if (!country && station.countryCode) {
			country = station.countryCode;
		}

		// Store all data including place and country
		const stationData = {
			id: station.id,
			title: station.title,
			streamUrl: station.streamUrl,
			placeTitle: placeTitle,
			country: country,
		};

		// Log for debugging
		console.log("Selected station data:", stationData);

		// 1. Directly add to Recently Played if the function exists
		const windowWithAddRecent = window as WindowWithAddRecentlyPlayed;
		if (typeof windowWithAddRecent.addRecentlyPlayedStation === "function") {
			windowWithAddRecent.addRecentlyPlayedStation({
				id: station.id,
				title: station.title,
				subtitle: station.subtitle,
				place: placeTitle,
				country: country,
				countryCode: station.countryCode,
				color: station.color,
			});
		}

		// 2. Store in localStorage and trigger page reload for main component to pick it up
		localStorage.setItem("selectedStation", JSON.stringify(stationData));

		// Redirect to home page if not already there
		if (pathname !== "/") {
			window.location.href = "/";
		} else {
			// Reload the page to trigger the station selection in the main component
			window.location.reload();
		}

		// Close search modal
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div
			className={`fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
				searchVisible ? "opacity-100" : "opacity-0"
			}`}
		>
			<div
				ref={searchModalRef}
				className={`w-full max-w-6xl mx-auto rounded-lg shadow-2xl border border-gray-800 overflow-hidden transition-transform duration-300 ease-in-out ${
					searchVisible ? "scale-100 translate-y-0" : "scale-95 -translate-y-10"
				}`}
			>
				{/* Header with close button */}
				<div className="bg-black p-4 border-b border-gray-800 flex justify-between items-center">
					<h2 className="text-xl font-bold text-white">
						Search Radio Stations
					</h2>
					<button
						type="button"
						className="p-2 rounded-full hover:bg-gray-800 transition-colors"
						onClick={onClose}
						aria-label="Close search"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-white"
							aria-hidden="true"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>

				{/* Two-column layout */}
				<div className="flex flex-col md:flex-row md:gap-4 bg-black">
					{/* Left Column - Search Results */}
					<div className="w-full md:w-3/5 border-b md:border-b-0 md:border-r border-gray-800">
						<div className="p-4 border-b border-gray-800">
							<form onSubmit={handleSubmit} className="flex space-x-2">
								<input
									ref={searchInputRef}
									type="text"
									value={searchQuery}
									onChange={handleInputChange}
									placeholder="Search by station name or location..."
									className="flex-grow px-4 py-3 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
								/>
								<button
									type="submit"
									className="btn btn-primary bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md font-medium"
									disabled={loading || !searchQuery.trim()}
								>
									{loading ? (
										<span className="flex items-center">
											<svg
												className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												/>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												/>
											</svg>
											Searching...
										</span>
									) : (
										"Search"
									)}
								</button>
							</form>
						</div>

						<div className="p-4">
							{error && (
								<div className="bg-red-900/30 text-red-400 p-3 rounded-md mb-4 border border-red-900">
									<p>{error}</p>
								</div>
							)}

							<div className="space-y-2 max-h-[calc(100vh-350px)] md:max-h-[calc(100vh-250px)] overflow-y-auto">
								{searchResults.length > 0 ? (
									searchResults.map((result) => (
										<button
											key={result.id}
											className="w-full text-left p-3 rounded-md hover:bg-gray-900 transition-colors flex items-center space-x-3 cursor-pointer"
											onClick={() => handleStationSelect(result)}
											type="button"
										>
											{result.countryCode ? (
												<div className="w-12 h-12 flex-shrink-0 rounded-md flex items-center justify-center">
													<Image
														src={`https://flagsapi.com/${result.countryCode}/flat/64.png`}
														alt={`Flag of ${result.subtitle || "country"}`}
														className="w-10 h-10 object-cover rounded-sm"
														width={40}
														height={40}
														onError={(e) => {
															// Fallback to letter icon if flag fails to load
															const target = e.target as HTMLImageElement;
															target.style.display = "none";
															const parent = target.parentElement;
															if (parent) {
																parent.classList.add(
																	result.color || "bg-gray-800",
																);
																// Create and append text element
																const span = document.createElement("span");
																span.className = "text-lg font-bold text-white";
																span.textContent = result.title
																	.charAt(0)
																	.toUpperCase();
																parent.appendChild(span);
															}
														}}
													/>
												</div>
											) : (
												<div
													className={`w-12 h-12 ${result.color || "bg-gray-800"} text-white rounded-md flex-shrink-0 flex items-center justify-center`}
												>
													<span className="text-lg font-bold">
														{result.title.charAt(0).toUpperCase()}
													</span>
												</div>
											)}
											<div>
												<h4 className="font-medium text-white">
													{result.title}
												</h4>
												<p className="text-sm text-gray-400">
													{result.subtitle}
												</p>
											</div>
										</button>
									))
								) : searchQuery && !loading ? (
									<p className="text-center text-gray-400 py-6">
										No stations found. Try a different search term.
									</p>
								) : !searchQuery ? (
									<div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="64"
											height="64"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="mb-6 text-gray-600"
											aria-hidden="true"
										>
											<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
											<path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
											<circle cx="12" cy="12" r="2" />
											<path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
											<path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
										</svg>
										<p className="text-lg">
											Search for your favorite station from around the world
										</p>
										<p className="mt-2 text-gray-500">
											Type in a station name, genre, or location to get started
										</p>
									</div>
								) : loading ? (
									<div className="flex justify-center py-8">
										<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white" />
									</div>
								) : null}
							</div>
						</div>
					</div>

					{/* Right Column - Suggestions */}
					<div className="w-full md:w-2/5 p-4 md:p-6">
						<h3 className="text-lg font-bold text-white mb-4">
							Discover Stations
						</h3>

						<div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
							<h4 className="text-md font-medium text-gray-300 mb-2">
								Pro Tip
							</h4>
							<p className="text-sm text-gray-400">
								Start typing to see results instantly. Search by country, genre,
								or station name to find the perfect radio station for your mood.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Search;
