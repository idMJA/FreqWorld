"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import AudioPlayer from "../components/AudioPlayer";
import RecentlyPlayed from "../components/RecentlyPlayed";
import FeaturedStations from "../components/FeaturedStations";

export default function Home() {
	const [selectedStation, setSelectedStation] = useState<{
		id: string;
		title: string;
		streamUrl?: string;
	} | null>(null);

	// Check localStorage for selected station on component mount
	useEffect(() => {
		try {
			const savedStation = localStorage.getItem("selectedStation");
			if (savedStation) {
				const stationData = JSON.parse(savedStation);
				// Process the station data the same way as handleStationSelect
				handleStationSelect(stationData);
				// Clear localStorage to avoid reloading the same station on future visits
				localStorage.removeItem("selectedStation");
			}
		} catch (err) {
			console.error("Error loading station from localStorage:", err);
		}
	}, []);

	// Handle station selection from FeaturedStations component
	const handleFeaturedStationSelect = (station: {
		id: string;
		title: string;
		placeTitle?: string;
		country?: string;
	}) => {
		setSelectedStation({
			id: station.id,
			title: `${station.title} (${station.placeTitle}, ${station.country})`,
		});
	};

	// Handle station selection from other components
	const handleStationSelect = (station: {
		id: string;
		title: string;
		streamUrl?: string;
		placeTitle?: string;
		country?: string;
	}) => {
		// Format title with location information if available
		let formattedTitle = station.title;

		// If we have place and country info, add it to the title
		if (station.placeTitle && station.country) {
			// Check if place and country are the same to avoid duplication
			if (station.placeTitle === station.country) {
				formattedTitle = `${station.title} (${station.placeTitle})`;
			} else {
				formattedTitle = `${station.title} (${station.placeTitle}, ${station.country})`;
			}
		}
		// If we only have one of them, use that
		else if (station.placeTitle) {
			formattedTitle = `${station.title} (${station.placeTitle})`;
		} else if (station.country) {
			formattedTitle = `${station.title} (${station.country})`;
		}

		setSelectedStation({
			id: station.id,
			title: formattedTitle,
			streamUrl: station.streamUrl,
		});
	};

	return (
		<div className="flex flex-col min-h-screen bg-black">
			<Header />

			<main className="flex-grow container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-center mb-8 text-white">
					Listen to Radio Stations Around the World
				</h1>

				{/* Audio Player - Now at the top level */}
				<div className="mb-6">
					<AudioPlayer
						channelId={selectedStation?.id}
						channelTitle={selectedStation?.title || "Select a station"}
						streamUrl={selectedStation?.streamUrl}
						autoPlay={!!selectedStation}
					/>
				</div>

				{/* Grid Layout untuk FeaturedStations dan RecentlyPlayed */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content - Left Column */}
					<div className="lg:col-span-2">
						{/* Featured Stations Component */}
						<FeaturedStations
							onSelectStation={handleFeaturedStationSelect}
							selectedStationId={selectedStation?.id}
						/>
					</div>

					{/* Sidebar - Right Column */}
					<div>
						{/* Recently Played */}
						<RecentlyPlayed onSelectStation={handleStationSelect} />
					</div>
				</div>
			</main>

			<footer className="border-t border-gray-800 py-6 mt-12">
				<div className="container mx-auto px-4 text-center text-sm text-gray-400">
					<p>© {new Date().getFullYear()} FreqWorld. All rights reserved.</p>
					<p className="mt-2">
						Powered by{" "}
						<a
							href="https://radio.garden"
							target="_blank"
							rel="noopener noreferrer"
							className="text-green-400 hover:text-white transition-colors"
						>
							Radio Garden
						</a>{" "}
						· Made by{" "}
						<a
							href="https://mjba.my"
							target="_blank"
							rel="noopener noreferrer"
							className="text-pink-400 hover:text-white transition-colors"
						>
							iaMJ / アーリャ
						</a>
					</p>
				</div>
			</footer>
		</div>
	);
}
