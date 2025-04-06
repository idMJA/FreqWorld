"use client";

import { useState, useEffect, useCallback } from "react";
import type { Channel } from "../utils/api";
import { getColorByLetter } from "../utils/colorUtils";
import { detectLocationFromText } from "../utils/country";
import Image from "next/image";

// Diperluas dari interface Channel untuk menambahkan properti yang dibutuhkan
// untuk menampilkan bendera dan warna
interface EnhancedChannel extends Channel {
	countryCode?: string;
	color?: string;
}

// Diperluas dari interface Channel untuk menambahkan properti yang dibutuhkan
// untuk menampilkan bendera dan warna
interface RecentStation {
	id: string;
	title: string;
	subtitle: string;
	place?: string; // Add place field to store city/place name separately
	country?: string; // Add country field to store country name separately
	color: string;
	countryCode?: string;
	playedAt: Date;
}

interface RecentlyPlayedProps {
	className?: string;
	onSelectStation?: (station: {
		id: string;
		title: string;
		placeTitle?: string;
		country?: string;
	}) => void;
}

// Define a type for the function added to the window object
interface WindowWithAddRecentlyPlayed extends Window {
	addRecentlyPlayedStation?: (station: Channel | EnhancedChannel) => void;
}

// Format the time difference between now and when the station was played
const getTimeSince = (date: Date): string => {
	const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

	let interval = seconds / 31536000;
	if (interval > 1) return `${Math.floor(interval)} years ago`;

	interval = seconds / 2592000;
	if (interval > 1) return `${Math.floor(interval)} months ago`;

	interval = seconds / 86400;
	if (interval > 1) return `${Math.floor(interval)} days ago`;

	interval = seconds / 3600;
	if (interval > 1) return `${Math.floor(interval)} hours ago`;

	interval = seconds / 60;
	if (interval > 1) return `${Math.floor(interval)} minutes ago`;

	return `${Math.floor(seconds)} seconds ago`;
};

const RecentlyPlayed = ({
	className = "",
	onSelectStation,
}: RecentlyPlayedProps) => {
	const [recentStations, setRecentStations] = useState<RecentStation[]>([]);

	// Load recently played stations from localStorage when the component mounts
	useEffect(() => {
		try {
			const storedStations = localStorage.getItem("recentlyPlayedStations");
			if (storedStations) {
				const parsedStations = JSON.parse(storedStations);
				// Convert stored date strings back to Date objects and clean up any "Found via search" entries
				const stations = parsedStations.map(
					(station: RecentStation & { playedAt: string }) => {
						const updatedStation = {
							...station,
							playedAt: new Date(station.playedAt),
						};

						// Fix any "Found via search" entries that don't have country codes
						if (
							station.subtitle === "Found via search" ||
							!station.countryCode
						) {
							// Use the centralized location detection function
							const locationInfo = detectLocationFromText(station.title);
							if (locationInfo.countryCode) {
								updatedStation.countryCode = locationInfo.countryCode;

								// If subtitle was "Found via search", replace it with detected location
								if (station.subtitle === "Found via search") {
									updatedStation.subtitle = locationInfo.locationName;
								}
							}

							// If still no good location found but we have a country code
							if (
								updatedStation.subtitle === "Found via search" &&
								updatedStation.countryCode
							) {
								// Map country codes to names for better display
								switch (updatedStation.countryCode) {
									case "US":
										updatedStation.subtitle = "United States";
										break;
									case "GB":
										updatedStation.subtitle = "United Kingdom";
										break;
									case "JP":
										updatedStation.subtitle = "Japan";
										break;
									case "ID":
										updatedStation.subtitle = "Indonesia";
										break;
									case "AU":
										updatedStation.subtitle = "Australia";
										break;
									case "CA":
										updatedStation.subtitle = "Canada";
										break;
									case "FR":
										updatedStation.subtitle = "France";
										break;
									case "DE":
										updatedStation.subtitle = "Germany";
										break;
									case "IT":
										updatedStation.subtitle = "Italy";
										break;
									case "ES":
										updatedStation.subtitle = "Spain";
										break;
									case "BR":
										updatedStation.subtitle = "Brazil";
										break;
									case "RU":
										updatedStation.subtitle = "Russia";
										break;
									case "CN":
										updatedStation.subtitle = "China";
										break;
									case "IN":
										updatedStation.subtitle = "India";
										break;
									case "MX":
										updatedStation.subtitle = "Mexico";
										break;
									case "CL":
										updatedStation.subtitle = "Chile";
										break;
									case "YE":
										updatedStation.subtitle = "Yemen";
										break;
									// Add more common country mappings as needed
								}
							}
						}

						// Make sure we have a color assigned
						if (!updatedStation.color) {
							updatedStation.color = getColorByLetter(station.title);
						}

						return updatedStation;
					},
				);

				// Save updated stations back to localStorage if we fixed any entries
				const hasUpdates = stations.some(
					(station: RecentStation, index: number) =>
						station.countryCode !== parsedStations[index].countryCode ||
						station.subtitle !== parsedStations[index].subtitle ||
						!parsedStations[index].color, // Also update if we added missing colors
				);

				if (hasUpdates) {
					try {
						localStorage.setItem(
							"recentlyPlayedStations",
							JSON.stringify(stations),
						);
					} catch (error) {
						console.error(
							"Error saving updated recently played stations:",
							error,
						);
					}
				}

				setRecentStations(stations);
			}
		} catch (error) {
			console.error("Error loading recently played stations:", error);
		}
	}, []);

	// Function to add a station to recently played
	const addToRecentlyPlayed = useCallback(
		(station: Channel | EnhancedChannel) => {
			// Generate a unique station ID if not provided
			const stationId = station.id || `station-${Date.now()}`;
			const stationTitle = station.title || "Unknown Station";

			// Ambil informasi lokasi dari stasiun
			const stationPlace = station.place?.title || "";
			const stationCountry = station.country?.title || "";

			// Gabungkan jika keduanya ada dan berbeda
			let stationSubtitle = "Found via search";
			let place = "";
			let country = "";

			if (stationPlace && stationCountry && stationPlace !== stationCountry) {
				stationSubtitle = `${stationPlace}, ${stationCountry}`;
				place = stationPlace;
				country = stationCountry;
			} else if (stationPlace) {
				stationSubtitle = stationPlace;
				place = stationPlace;
				country = stationPlace;
			} else if (stationCountry) {
				stationSubtitle = stationCountry;
				place = stationCountry;
				country = stationCountry;
			} else if (station.subtitle && station.subtitle !== "Found via search") {
				stationSubtitle = station.subtitle;

				// Try to parse place and country from subtitle
				if (station.subtitle.includes(",")) {
					const parts = station.subtitle.split(",").map((part) => part.trim());
					place = parts[0];
					country = parts[parts.length - 1];
				} else {
					place = station.subtitle;
					country = station.subtitle;
				}
			}

			// Use our central location detection to get country information
			// Use type assertion for enhanced channel properties
			let countryCode = (station as EnhancedChannel).countryCode || "";
			let subtitle = stationSubtitle;

			if (!countryCode || subtitle === "Found via search") {
				// Try to detect location from title or subtitle
				const titleLocationInfo = detectLocationFromText(stationTitle);

				// Try from place or country first
				const placeInfo = stationPlace
					? detectLocationFromText(stationPlace)
					: null;
				const countryInfo = stationCountry
					? detectLocationFromText(stationCountry)
					: null;

				// Prioritas: countryInfo > placeInfo > titleLocationInfo
				if (countryInfo?.countryCode) {
					countryCode = countryInfo.countryCode;
					if (subtitle === "Found via search") {
						subtitle = stationCountry;
					}
				} else if (placeInfo?.countryCode) {
					countryCode = placeInfo.countryCode;
					if (subtitle === "Found via search") {
						subtitle = stationPlace;
					}
				} else if (titleLocationInfo.countryCode) {
					countryCode = titleLocationInfo.countryCode;
					// If subtitle is "Found via search", replace it with the detected location
					if (subtitle === "Found via search") {
						subtitle = titleLocationInfo.locationName || subtitle;
					}
				}

				// If still no location found but we have a country code, try to provide a better subtitle
				if (subtitle === "Found via search" && countryCode) {
					// Use common country names based on code
					switch (countryCode) {
						case "US":
							subtitle = "United States";
							break;
						case "GB":
							subtitle = "United Kingdom";
							break;
						case "JP":
							subtitle = "Japan";
							break;
						case "ID":
							subtitle = "Indonesia";
							break;
						case "AU":
							subtitle = "Australia";
							break;
						case "CA":
							subtitle = "Canada";
							break;
						case "FR":
							subtitle = "France";
							break;
						case "DE":
							subtitle = "Germany";
							break;
						case "IT":
							subtitle = "Italy";
							break;
						case "ES":
							subtitle = "Spain";
							break;
						case "BR":
							subtitle = "Brazil";
							break;
						case "RU":
							subtitle = "Russia";
							break;
						case "CN":
							subtitle = "China";
							break;
						case "IN":
							subtitle = "India";
							break;
						case "MX":
							subtitle = "Mexico";
							break;
						case "CL":
							subtitle = "Chile";
							break;
						case "YE":
							subtitle = "Yemen";
							break;
						// Add more common country mappings as needed
					}
				}
			}

			// Create new recent station entry
			const newStation: RecentStation = {
				id: stationId,
				title: stationTitle,
				subtitle: subtitle,
				place: place,
				country: country,
				countryCode: countryCode,
				color:
					(station as EnhancedChannel).color || getColorByLetter(stationTitle),
				playedAt: new Date(),
			};

			setRecentStations((prevStations) => {
				// Remove any existing entry with the same ID to avoid duplicates
				const filteredStations = prevStations.filter((s) => s.id !== stationId);

				// Add the new station at the beginning of the array
				const updatedStations = [newStation, ...filteredStations];

				// Limit to 5 stations
				const limitedStations = updatedStations.slice(0, 5);

				// Save to localStorage
				try {
					localStorage.setItem(
						"recentlyPlayedStations",
						JSON.stringify(limitedStations),
					);
				} catch (error) {
					console.error("Error saving recently played stations:", error);
				}

				return limitedStations;
			});
		},
		[],
	);

	// Expose addToRecentlyPlayed function to window object for external use
	useEffect(() => {
		// Add function to window object
		(window as WindowWithAddRecentlyPlayed).addRecentlyPlayedStation =
			addToRecentlyPlayed;

		// Clean up when component unmounts
		return () => {
			// Set to undefined instead of using delete for better performance
			(window as WindowWithAddRecentlyPlayed).addRecentlyPlayedStation =
				undefined;
		};
	}, [addToRecentlyPlayed]);

	const handleStationClick = useCallback(
		(station: RecentStation) => {
			if (onSelectStation) {
				// Use the stored place and country if available, otherwise parse from subtitle
				let placeTitle = station.place;
				let countryName = station.country;

				// Fallback to parsing subtitle if place/country not available
				if (!placeTitle && !countryName && station.subtitle) {
					if (station.subtitle.includes(",")) {
						const parts = station.subtitle
							.split(",")
							.map((part) => part.trim());
						placeTitle = parts[0];
						countryName = parts[parts.length - 1];
					} else {
						placeTitle = station.subtitle;
						countryName = station.subtitle;
					}
				}

				onSelectStation({
					id: station.id,
					title: station.title,
					placeTitle: placeTitle,
					country: countryName,
				});
			}
		},
		[onSelectStation],
	);

	if (recentStations.length === 0) {
		return null;
	}

	return (
		<div className={`card border-gray-800 bg-black ${className}`}>
			<h3 className="text-xl font-bold mb-4 text-white">Recently Played</h3>

			<div className="space-y-2">
				{recentStations.length > 0 ? (
					recentStations.map((station) => (
						<button
							key={`${station.id}-${station.playedAt.toISOString()}`}
							className="w-full text-left p-3 rounded-md hover:bg-gray-900 transition-colors flex items-center space-x-3 cursor-pointer"
							onClick={() => handleStationClick(station)}
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
									className={`w-12 h-12 ${station.color || "bg-gray-800"} text-white rounded-md flex-shrink-0 flex items-center justify-center`}
								>
									<span className="text-lg font-bold">
										{station.title.charAt(0).toUpperCase()}
									</span>
								</div>
							)}
							<div>
								<h4 className="font-medium text-white">{station.title}</h4>
								<p className="text-sm text-gray-400">
									{station.place &&
									station.country &&
									station.place !== station.country
										? `${station.place}, ${station.country}`
										: station.subtitle}
								</p>
							</div>
							<div className="ml-auto text-xs text-gray-400 whitespace-nowrap">
								{getTimeSince(station.playedAt)}
							</div>
						</button>
					))
				) : (
					<div className="py-8 text-center text-gray-400">
						<p>No recently played stations</p>
						<p className="text-sm mt-2">
							Stations you listen to will appear here
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default RecentlyPlayed;
