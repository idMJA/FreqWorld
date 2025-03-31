"use client";

import { useState, useEffect } from "react";
import { getPlaces, getPlaceChannels } from "../utils/api";
import { getColorByLetter } from "../utils/colorUtils";
import { searchCountrybyName } from "../utils/country";
import Image from "next/image";

interface FeaturedStation {
	id: string;
	title: string;
	placeTitle?: string;
	country?: string;
	countryCode?: string;
	color?: string;
}

// Fungsi untuk mendapatkan kode negara dari nama negara
const getCountryCode = (countryName: string | undefined): string => {
	if (!countryName) return "";

	// Jika nama negara berisi koma, ambil bagian terakhir (biasanya nama negara)
	let country = countryName;
	if (countryName.includes(",")) {
		const parts = countryName.split(",");
		country = parts[parts.length - 1].trim();
	}

	// Cari kode negara dengan fungsi dari country.ts
	let countryCode = searchCountrybyName(country);

	// Jika tidak ditemukan, coba per kata
	if (!countryCode && country.includes(" ")) {
		const words = country.split(/\s+/);
		for (const word of words) {
			if (word.length > 2) {
				// Skip short words like 'of', 'the', etc.
				countryCode = searchCountrybyName(word);
				if (countryCode) break;
			}
		}
	}

	return countryCode || "";
};

interface FeaturedStationsProps {
	onSelectStation: (station: {
		id: string;
		title: string;
		placeTitle?: string;
		country?: string;
	}) => void;
	selectedStationId?: string;
	className?: string;
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

const FeaturedStations = ({
	onSelectStation,
	selectedStationId,
	className = "",
}: FeaturedStationsProps) => {
	const [loading, setLoading] = useState(true);
	const [stations, setStations] = useState<FeaturedStation[]>([]);

	useEffect(() => {
		async function loadFeaturedStations() {
			try {
				setLoading(true);
				// Get all places
				const places = await getPlaces();
				const collectedStations: FeaturedStation[] = [];

				if (places.length > 0) {
					// Select some random places with higher station counts
					const popularPlaces = places.filter((place) => place.size > 5);
					const placesToUse = popularPlaces.length > 0 ? popularPlaces : places;

					// Shuffle and take more random places to get 10 stations
					const shuffledPlaces = [...placesToUse]
						.sort(() => 0.5 - Math.random())
						.slice(0, 10);

					// For each place, get their stations
					for (const place of shuffledPlaces) {
						try {
							console.log(`Loading place: ${place.title}, ${place.country}`);
							const channels = await getPlaceChannels(place.id);

							console.log(
								`Channels for ${place.title}: received ${channels.length} channels`,
							);

							if (channels.length > 0) {
								// Just take one channel per place to get a good variety
								const randomChannel =
									channels[Math.floor(Math.random() * channels.length)];

								if (randomChannel?.id) {
									// Use color based on first letter for consistency
									const color = getColorByLetter(randomChannel.title);
									const countryCode = getCountryCode(place.country);

									collectedStations.push({
										id: randomChannel.id,
										title: randomChannel.title,
										placeTitle: place.title,
										country: place.country,
										countryCode: countryCode,
										color: color,
									});

									// Stop when we have 10 stations
									if (collectedStations.length >= 10) {
										break;
									}
								}
							}
						} catch (error) {
							console.error(
								`Error fetching channels for ${place.title}:`,
								error,
							);
						}
					}

					setStations(collectedStations);
				}
			} catch (error) {
				console.error("Error loading featured stations:", error);
			} finally {
				setLoading(false);
			}
		}

		loadFeaturedStations();
	}, []);

	const handleStationSelect = (station: FeaturedStation) => {
		// Clean up any duplicate location info
		const placeTitle = station.placeTitle;
		let country = station.country;

		// Check for duplication when both exist
		if (placeTitle && country && placeTitle === country) {
			country = undefined; // Avoid duplication if they're identical
		}

		// 1. Directly add to Recently Played if the function exists
		const windowWithAddRecent = window as WindowWithAddRecentlyPlayed;
		if (typeof windowWithAddRecent.addRecentlyPlayedStation === "function") {
			windowWithAddRecent.addRecentlyPlayedStation({
				id: station.id,
				title: station.title,
				subtitle:
					placeTitle && country
						? `${placeTitle}, ${country}`
						: placeTitle || country || "",
				place: placeTitle,
				country: country,
				countryCode: station.countryCode,
				color: station.color,
			});
		}

		// 2. Call the provided onSelectStation handler
		onSelectStation({
			id: station.id,
			title: station.title,
			placeTitle: placeTitle,
			country: country,
		});
	};

	return (
		<div
			className={`card p-6 bg-black border border-gray-800 overflow-hidden relative rounded-lg ${className}`}
		>
			<h2 className="text-xl font-bold text-white mb-4">Featured Stations</h2>

			{loading ? (
				<div className="flex flex-col items-center justify-center h-48">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="40"
						height="40"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="animate-spin text-white mb-3"
						aria-hidden="true"
					>
						<path d="M21 12a9 9 0 1 1-6.219-8.56" />
					</svg>
					<p className="text-center text-gray-400">
						Loading featured stations...
					</p>
				</div>
			) : stations.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-48">
					<p className="text-center text-gray-400">
						No stations found. Try refreshing the page.
					</p>
				</div>
			) : (
				<div className="fade-in space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{stations.map((station) => (
							<button
								key={station.id}
								onClick={() => handleStationSelect(station)}
								className={`flex items-center p-3 rounded-lg transition-colors ${
									selectedStationId === station.id
										? "bg-gray-800 border border-gray-600"
										: "bg-black hover:bg-gray-900 border border-gray-700"
								}`}
								type="button"
							>
								{station.countryCode ? (
									<div className="w-12 h-12 flex-shrink-0 rounded-md flex items-center justify-center mr-3">
										<Image
											src={`https://flagsapi.com/${station.countryCode}/flat/64.png`}
											alt={`Flag of ${station.country || "unknown"}`}
											className="w-10 h-10 object-cover rounded-sm"
											width={40}
											height={40}
											onError={(e) => {
												// Fallback to letter icon if flag fails to load
												const target = e.target as HTMLImageElement;
												target.style.display = "none";
												const parent = target.parentElement;
												if (parent) {
													parent.classList.add(station.color || "bg-gray-800");
													// Create and append text element
													const span = document.createElement("span");
													span.className = "text-lg font-bold text-white";
													span.textContent = station.title
														.charAt(0)
														.toUpperCase();
													parent.appendChild(span);
												}
											}}
										/>
									</div>
								) : (
									<div
										className={`w-12 h-12 ${station.color || "bg-gray-800"} text-white rounded-md flex-shrink-0 flex items-center justify-center mr-3`}
									>
										<span className="text-lg font-bold">
											{station.title.charAt(0).toUpperCase()}
										</span>
									</div>
								)}
								<div className="flex-grow min-w-0">
									<h4 className="font-medium truncate text-white">
										{station.title}
									</h4>
									<p className="text-sm text-gray-400 truncate">
										{station.placeTitle}, {station.country}
									</p>
								</div>
								{selectedStationId === station.id && (
									<div className="ml-auto">
										<div className="animate-pulse w-2 h-2 bg-white rounded-full" />
									</div>
								)}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default FeaturedStations;
