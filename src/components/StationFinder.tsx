"use client";

import { useState } from "react";
import { searchRadio } from "../utils/api";
import { getColorByLetter } from "../utils/colorUtils";
import { detectLocationFromText } from "../utils/country";
import Image from "next/image";

interface RadioStation {
	id: string;
	title: string;
	subtitle: string;
	countryCode?: string;
	color?: string;
	streamUrl?: string;
}

interface StationFinderProps {
	onSelectStation?: (channel: {
		id: string;
		title: string;
		streamUrl?: string;
		placeTitle?: string;
		country?: string;
	}) => void;
	className?: string;
}

const StationFinder = ({
	onSelectStation,
	className = "",
}: StationFinderProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<RadioStation[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSearch = async () => {
		if (!searchQuery.trim()) return;

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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		void handleSearch();
	};

	const handleStationSelect = (station: RadioStation) => {
		if (onSelectStation) {
			// If subtitle contains comma, check for duplicated parts
			let cleanSubtitle = station.subtitle;
			if (station.subtitle?.includes(",")) {
				const parts = station.subtitle.split(",").map((part) => part.trim());
				const uniqueParts = [...new Set(parts)]; // Remove duplicates
				cleanSubtitle = uniqueParts.join(", ");
			}

			onSelectStation({
				id: station.id,
				title: station.title,
				streamUrl: station.streamUrl,
				placeTitle:
					cleanSubtitle !== "Found via search" ? cleanSubtitle : undefined,
				country: station.countryCode ? cleanSubtitle : undefined,
			});
		}
	};

	return (
		<div className={`card border-gray-800 bg-black ${className}`}>
			<h3 className="text-xl font-bold mb-4 text-white">Find a Station</h3>

			<form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search by station name or location..."
					className="flex-grow px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
				/>
				<button
					type="submit"
					className="btn btn-primary bg-white text-black hover:bg-gray-200"
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

			{error && (
				<div className="bg-red-900/30 text-red-400 p-3 rounded-md mb-4 border border-red-900">
					<p>{error}</p>
				</div>
			)}

			<div className="space-y-2 max-h-80 overflow-y-auto">
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
												parent.classList.add(result.color || "bg-gray-800");
												// Create and append text element
												const span = document.createElement("span");
												span.className = "text-lg font-bold text-white";
												span.textContent = result.title.charAt(0).toUpperCase();
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
								<h4 className="font-medium text-white">{result.title}</h4>
								<p className="text-sm text-gray-400">{result.subtitle}</p>
							</div>
						</button>
					))
				) : searchQuery && !loading ? (
					<p className="text-center text-gray-400 py-6">
						No stations found. Try a different search term.
					</p>
				) : null}
			</div>

			{!searchQuery && !searchResults.length && (
				<div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="48"
						height="48"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="mb-4 text-gray-600"
						aria-hidden="true"
					>
						<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
						<path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
						<circle cx="12" cy="12" r="2" />
						<path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
						<path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
					</svg>
					<p>Search for your favorite station from around the world</p>
				</div>
			)}
		</div>
	);
};

export default StationFinder;
