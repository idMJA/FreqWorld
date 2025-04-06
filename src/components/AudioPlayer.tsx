"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getChannelStreamUrl, getChannelDetails } from "../utils/api";
import type { Channel } from "../utils/api";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import { getColorByLetter } from "../utils/colorUtils";
import { detectLocationFromText } from "../utils/country";
import { setCookie, getCookie } from "../utils/cookieUtils";

interface AudioPlayerProps {
	channelId?: string;
	channelTitle?: string;
	autoPlay?: boolean;
	streamUrl?: string;
	onChannelLoad?: (channel: Channel) => void;
	initialChannel?: Channel | null;
	className?: string;
}

// Define a type for the window object with the addRecentlyPlayedStation function
interface WindowWithAddRecentlyPlayed extends Window {
	addRecentlyPlayedStation?: (
		station: Channel & { countryCode?: string; color?: string },
	) => void;
}

const AudioPlayer = ({
	channelId,
	channelTitle = "Select a station",
	autoPlay = false,
	streamUrl: directStreamUrl,
	// onChannelLoad,
	// initialChannel = null,
	// className = ''
}: AudioPlayerProps) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(80); // Default volume, will be overridden by cookie if available
	const [isMuted, setIsMuted] = useState(false); // State for mute functionality
	// const [currentTime, setCurrentTime] = useState(0);
	const [streamUrl, setStreamUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [randomFinderMode, setRandomFinderMode] = useState(false);
	const [randomFinderTimer, setRandomFinderTimer] =
		useState<NodeJS.Timeout | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const visualizerRef = useRef<HTMLDivElement | null>(null);
	const audioMotionRef = useRef<AudioMotionAnalyzer | null>(null);

	// Load volume from cookie on component mount
	useEffect(() => {
		const savedVolume = getCookie("radio_volume");
		if (savedVolume !== null) {
			const volumeValue = Number.parseInt(savedVolume, 10);
			setVolume(volumeValue);

			// Also set the volume on the audio element if it exists
			if (audioRef.current) {
				audioRef.current.volume = volumeValue / 100;
			}
		}
	}, []);

	// Use our centralized function to get country information
	const getStationLocation = useCallback((station: Channel) => {
		// Extract location and country information from the station
		let countryCode = "";
		let locationName = "";

		// Check subtitle first (most likely to contain accurate location info)
		if (station.subtitle) {
			const subtitleLocation = detectLocationFromText(station.subtitle);
			if (subtitleLocation.countryCode) {
				countryCode = subtitleLocation.countryCode;
				locationName = subtitleLocation.locationName || station.subtitle;
			}
		}

		// If not found in subtitle, check title
		if (!countryCode && station.title) {
			const titleLocation = detectLocationFromText(station.title);
			if (titleLocation.countryCode) {
				countryCode = titleLocation.countryCode;
				locationName = titleLocation.locationName || locationName;
			}
		}

		// Use place and country information if available
		if (!countryCode && station.country?.title) {
			const countryLocation = detectLocationFromText(station.country.title);
			if (countryLocation.countryCode) {
				countryCode = countryLocation.countryCode;
				locationName = station.place?.title || countryLocation.locationName;
			}
		}

		return { countryCode, locationName };
	}, []);

	// Function to add to recently played stations
	const addToRecentlyPlayed = useCallback(
		(stationTitle: string, stationId: string, locationInfo = "") => {
			console.log(
				"Adding to recently played:",
				stationTitle,
				stationId,
				locationInfo,
			);

			// Get window object with our custom functions
			const windowWithAddRecent = window as WindowWithAddRecentlyPlayed;
			if (typeof windowWithAddRecent.addRecentlyPlayedStation !== "function") {
				console.error("addRecentlyPlayedStation function not available");
				return;
			}

			// Parse place and country from location info
			let place = "";
			let country = "";

			if (locationInfo) {
				if (locationInfo.includes(",")) {
					const parts = locationInfo.split(",").map((part) => part.trim());
					place = parts[0];
					country = parts[parts.length - 1];
				} else {
					place = locationInfo;
					country = locationInfo;
				}
			}

			// Create station object
			const station: Channel = {
				id: stationId,
				title: stationTitle,
				subtitle: locationInfo,
			};

			// Get country code for the station
			const { countryCode, locationName } = getStationLocation(station);

			// Add country code and resolved location name
			const enhancedStation: Channel & {
				countryCode?: string;
				color?: string;
			} = {
				...station,
				countryCode,
				subtitle: locationName || locationInfo,
				color: getColorByLetter(stationTitle),
			};

			// Also add place and country data to the station metadata
			if (place) {
				if (!enhancedStation.place) {
					enhancedStation.place = {
						id: `place-${Date.now()}`,
						title: place,
					};
				}
			}

			if (country) {
				if (!enhancedStation.country) {
					enhancedStation.country = {
						id: `country-${Date.now()}`,
						title: country,
					};
				}
			}

			// Call global function to add to recently played
			windowWithAddRecent.addRecentlyPlayedStation(enhancedStation);
		},
		[getStationLocation],
	);

	// Jika stasiun dipilih dari pencarian dan memiliki streamUrl langsung
	useEffect(() => {
		if (directStreamUrl && channelId && !loading) {
			// Jika streamUrl datang langsung dari pencarian, kita perlu:
			// 1. Konversi URL agar menggunakan API proxy kita
			// 2. Tambahkan ke recently played

			console.log("Handling direct stream URL from search:", directStreamUrl);

			// Pastikan URL menggunakan proxy kita
			let proxyUrl = directStreamUrl;
			if (!proxyUrl.startsWith("/api/radio/stream/")) {
				proxyUrl = `/api/radio/stream/${encodeURIComponent(directStreamUrl)}`;
			}

			setStreamUrl(proxyUrl);

			// Extract location info from title if it contains parentheses
			let stationTitleForRecent = channelTitle;
			let locationInfo = "";

			if (channelTitle.includes("(") && channelTitle.includes(")")) {
				const start = channelTitle.indexOf("(");
				const end = channelTitle.indexOf(")");
				locationInfo = channelTitle.substring(start + 1, end).trim();
				stationTitleForRecent = channelTitle.substring(0, start).trim();

				// Clean up duplicated location information (like "Osaka, Japan, Osaka, Japan")
				if (locationInfo.includes(",")) {
					const parts = locationInfo.split(",").map((part) => part.trim());
					const uniqueParts = [...new Set(parts)]; // Remove duplicates
					locationInfo = uniqueParts.join(", ");
				}
			}

			// Tambahkan ke recently played dengan lokasi yang lebih akurat
			addToRecentlyPlayed(stationTitleForRecent, channelId, locationInfo);

			// Mainkan jika autoPlay di-set
			if (autoPlay) {
				setTimeout(() => {
					if (audioRef.current) {
						audioRef.current.load();
						audioRef.current.play().catch((err) => {
							console.error("Error playing audio:", err);
							setIsPlaying(false);
							setError(
								"Failed to play audio. Autoplay may be blocked by your browser.",
							);
						});
					}
				}, 100);
			}
		}
	}, [
		directStreamUrl,
		channelId,
		channelTitle,
		autoPlay,
		loading,
		addToRecentlyPlayed,
	]);

	// Get stream URL when channelId changes and directStreamUrl is not provided
	useEffect(() => {
		if (!channelId) {
			if (audioRef.current) {
				audioRef.current.src = "";
				audioRef.current.removeAttribute("src");
				setIsPlaying(false);
			}
			if (!directStreamUrl) {
				setStreamUrl(null);
			}
			return;
		}

		// Skip if directly handling streamUrl from search results
		if (directStreamUrl) {
			return;
		}

		const fetchStreamUrl = async () => {
			setLoading(true);
			setError(null);
			try {
				// Get stream URL
				const response = await getChannelStreamUrl(channelId);

				if (!response) {
					throw new Error(
						"Radio station is currently not accessible. Please try again later or select another station.",
					);
				}

				setStreamUrl(response);

				// Get channel details to add to recently played
				const channelDetails = await getChannelDetails(channelId);

				// Add to recently played list if the function exists
				if (channelDetails) {
					// Extract place and country info
					const place = channelDetails.place?.title || "";
					const country = channelDetails.country?.title || "";
					let locationInfo = "";

					if (place && country && place !== country) {
						locationInfo = `${place}, ${country}`;
					} else if (place) {
						locationInfo = place;
					} else if (country) {
						locationInfo = country;
					}

					// Now add to Recently Played with all the information we have
					addToRecentlyPlayed(channelDetails.title, channelId, locationInfo);
				}

				// Need a small timeout to ensure React rerenders with new source
				setTimeout(() => {
					if (audioRef.current) {
						audioRef.current.load();
						if (autoPlay) {
							try {
								audioRef.current
									.play()
									.then(() => {
										setIsPlaying(true);
										setError(null);
									})
									.catch((playError) => {
										console.error("Error playing audio:", playError);
										setIsPlaying(false);
										setError(
											"Failed to play audio. Autoplay may be blocked by your browser.",
										);
									});
							} catch (playError) {
								console.error("Error playing audio:", playError);
								setIsPlaying(false);
								setError(
									"Failed to play audio. Autoplay may be blocked by your browser.",
								);
							}
						}
					}
				}, 100);
			} catch (err) {
				console.error("Error fetching stream URL:", err);
				setError(
					err instanceof Error
						? err.message
						: "Failed to get stream URL. Please try again later.",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchStreamUrl();
	}, [channelId, autoPlay, directStreamUrl, addToRecentlyPlayed]);

	// Update isPlaying state when audio starts playing
	useEffect(() => {
		// Store the audio element reference to use in cleanup
		const audioElement = audioRef.current;

		const handlePlay = () => {
			if (audioRef.current) {
				setIsPlaying(true);
				setError(null);

				// When audio actually starts playing, this is a good time to add to recently played
				if (channelId && channelTitle) {
					let stationTitleForRecent = channelTitle;
					let locationInfo = "";

					if (channelTitle.includes("(") && channelTitle.includes(")")) {
						const start = channelTitle.indexOf("(");
						const end = channelTitle.indexOf(")");
						locationInfo = channelTitle.substring(start + 1, end).trim();
						stationTitleForRecent = channelTitle.substring(0, start).trim();
					}

					// Add to recently played again to make sure it's recorded when actually played
					// Only record it if we actually have sound playing (after 1 second of playback)
					setTimeout(() => {
						if (audioRef.current && !audioRef.current.paused) {
							addToRecentlyPlayed(
								stationTitleForRecent,
								channelId,
								locationInfo,
							);
						}
					}, 1000);
				}

				// Create visualizer if it doesn't exist
				if (!audioMotionRef.current && visualizerRef.current) {
					// ... existing code ...
				}
			}
		};

		const handlePause = () => {
			setIsPlaying(false);
		};

		if (audioElement) {
			audioElement.addEventListener("play", handlePlay);
			audioElement.addEventListener("pause", handlePause);
		}

		return () => {
			if (audioElement) {
				audioElement.removeEventListener("play", handlePlay);
				audioElement.removeEventListener("pause", handlePause);
			}
		};
	}, [channelId, channelTitle, addToRecentlyPlayed]);

	// Initialize AudioMotion Analyzer
	useEffect(() => {
		if (visualizerRef.current && audioRef.current) {
			// Create audio context and analyzer
			try {
				// Create AudioMotion analyzer
				const audioMotion = new AudioMotionAnalyzer(visualizerRef.current, {
					source: audioRef.current,
					height: 100,
					width: visualizerRef.current.clientWidth,
					showScaleX: false,
					showPeaks: true,
					showBgColor: true,
					bgAlpha: 1,
					gradient: "rainbow",
					mode: 3,
					lumiBars: true,
					radial: false,
					reflexRatio: 0.4,
					reflexAlpha: 0.25,
					showFPS: false,
					loRes: false,
					maxFreq: 16000,
					minFreq: 20,
					smoothing: 0.7,
					lineWidth: 2,
					fillAlpha: 0.8,
					barSpace: 0.1,
					alphaBars: true,
				});

				audioMotionRef.current = audioMotion;

				// Handle window resize
				const handleResize = () => {
					if (audioMotionRef.current && visualizerRef.current) {
						audioMotionRef.current.setCanvasSize(
							visualizerRef.current.clientWidth,
							100,
						);
					}
				};

				window.addEventListener("resize", handleResize);

				return () => {
					// Clean up event listener and analyzer on unmount
					window.removeEventListener("resize", handleResize);
					if (audioMotionRef.current) {
						audioMotionRef.current.disconnectInput();
						audioMotionRef.current = null;
					}
				};
			} catch (err) {
				console.error("Error initializing AudioMotion Analyzer:", err);
				setError("Could not initialize audio visualizer.");
			}
		}
	}, []);

	// Update analyzer when source changes
	useEffect(() => {
		if (audioMotionRef.current && audioRef.current) {
			try {
				// Reconnect input when audio source changes
				audioMotionRef.current.connectInput(audioRef.current);
			} catch (err) {
				console.error("Error connecting input to AudioMotion Analyzer:", err);
			}
		}
	}, []);

	// Handle play/pause
	const togglePlayPause = () => {
		if (!audioRef.current || !streamUrl) return;

		if (isPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current.play().catch((err) => {
				console.error("Error playing audio:", err);

				// Check if error is related to the stream URL not being accessible (404)
				const errorMessage = err.toString();
				if (
					errorMessage.includes("404") ||
					streamUrl?.includes("/api/radio/stream/")
				) {
					setError(
						"Radio station is currently not accessible. Please try again later or select another station.",
					);
				} else {
					setError("Failed to play audio. The stream may be unavailable.");
				}
			});
		}
		setIsPlaying(!isPlaying);
	};

	// Handle volume change
	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVolume = Number.parseInt(e.target.value, 10);
		setVolume(newVolume);

		// Save to cookie
		setCookie("radio_volume", newVolume.toString());

		if (audioRef.current) {
			audioRef.current.volume = newVolume / 100;

			// If user changes volume and it's not zero, unmute if currently muted
			if (newVolume > 0 && isMuted) {
				setIsMuted(false);
				audioRef.current.muted = false;
			}

			// If volume is set to zero, mute automatically
			if (newVolume === 0 && !isMuted) {
				setIsMuted(true);
				audioRef.current.muted = true;
			}
		}
	};

	// Update current time
	useEffect(
		() => {
			// Store the current value of audioRef to use in cleanup function
			const audio = audioRef.current;

			// Setup event handlers
			const handleTimeUpdate = () => {
				// Your existing code for time update handling
			};

			if (audio) {
				audio.addEventListener("timeupdate", handleTimeUpdate);
			}

			return () => {
				if (audio) {
					audio.removeEventListener("timeupdate", handleTimeUpdate);
				}
			};
		},
		[
			/* your dependencies */
		],
	);

	// Handle audio errors
	useEffect(
		() => {
			// Store the current value of audioRef to use in cleanup function
			const audio = audioRef.current;

			// Rest of the effect code
			const handleError = () => {
				setError(
					"Error playing station. Please try again or select a different station.",
				);
				setIsPlaying(false);
			};

			if (audio) {
				audio.addEventListener("error", handleError);
			}

			return () => {
				if (audio) {
					audio.removeEventListener("error", handleError);
				}
			};
		},
		[
			/* your dependencies */
		],
	);

	// Toggle randomFinder mode
	const toggleRandomFinderMode = () => {
		setRandomFinderMode((prev) => !prev);
	};

	// Toggle mute function
	const toggleMute = () => {
		setIsMuted((prev) => {
			const newMutedState = !prev;

			if (audioRef.current) {
				audioRef.current.muted = newMutedState;
			}

			return newMutedState;
		});
	};

	// RandomFinder mode functionality
	useEffect(() => {
		if (!randomFinderMode) {
			// Clear the timer if randomFinder mode is turned off
			if (randomFinderTimer) {
				clearInterval(randomFinderTimer);
				setRandomFinderTimer(null);
			}
			return;
		}

		// Start the randomFinder timer
		const timer = setInterval(async () => {
			try {
				// Fetch random station list
				const response = await fetch("/api/radio/places");
				if (!response.ok) throw new Error("Failed to fetch places");

				const data = await response.json();

				if (
					data?.data?.list &&
					Array.isArray(data.data.list) &&
					data.data.list.length > 0
				) {
					// Select a random place
					const randomPlace =
						data.data.list[Math.floor(Math.random() * data.data.list.length)];

					// Get channels for the place
					const channelsResponse = await fetch(
						`/api/radio/place/${randomPlace.id}/channels`,
					);
					if (!channelsResponse.ok) throw new Error("Failed to fetch channels");

					const channelsData = await channelsResponse.json();

					if (
						channelsData?.data?.content?.[0]?.items &&
						Array.isArray(channelsData.data.content[0].items) &&
						channelsData.data.content[0].items.length > 0
					) {
						// Pick a random channel
						const items = channelsData.data.content[0].items;
						const randomChannel =
							items[Math.floor(Math.random() * items.length)];

						if (randomChannel?.page?.url) {
							// Extract the channel ID from the URL
							const urlParts = randomChannel.page.url.split("/");
							const randomChannelId = urlParts[urlParts.length - 1];

							// Construct the channel title with place and country
							let channelTitle = randomChannel.page.title || "Unknown Station";
							const placeTitle = randomPlace.title;
							const country = randomPlace.country;

							if (placeTitle && country) {
								channelTitle = `${channelTitle} (${placeTitle}, ${country})`;
							}

							// Play the random channel
							if (randomChannelId && channelId !== randomChannelId) {
								const streamUrl = await getChannelStreamUrl(randomChannelId);
								if (streamUrl) {
									setStreamUrl(streamUrl);
									// Update channel ID and title in local storage
									localStorage.setItem(
										"selectedStation",
										JSON.stringify({
											id: randomChannelId,
											title: channelTitle,
											streamUrl: streamUrl,
											placeTitle: placeTitle,
											country: country,
										}),
									);

									// Get channel details and add to recently played
									const channelDetails =
										await getChannelDetails(randomChannelId);
									if (channelDetails) {
										addToRecentlyPlayed(
											channelDetails.title,
											randomChannelId,
											`${placeTitle}, ${country}`,
										);
									}

									// Force reload audio element
									if (audioRef.current) {
										audioRef.current.load();
										audioRef.current.play().catch((err) => {
											console.error("Error playing random audio:", err);
										});
									}
								}
							}
						}
					}
				}
			} catch (err) {
				console.error("Error in random finder mode:", err);
			}
		}, 5000); // Change station every 5 seconds

		setRandomFinderTimer(timer);

		return () => {
			clearInterval(timer);
		};
	}, [randomFinderMode, channelId, addToRecentlyPlayed, randomFinderTimer]);

	// Fix the specific useEffect with the warning on line 351
	useEffect(() => {
		// Store the current value of audioRef.current in a variable within the effect
		const audioElement = audioRef.current;

		if (loading || !channelId || !streamUrl) return;

		if (audioElement) {
			audioElement.src = streamUrl;
			audioElement.load();

			// Play if autoPlay is set
			if (autoPlay) {
				audioElement.play().catch((err) => {
					console.error("Error playing audio:", err);
					setIsPlaying(false);
					setError(
						"Failed to play audio. Autoplay may be blocked by your browser.",
					);
				});
			}
		}

		// Use the captured audioElement in cleanup
		return () => {
			if (audioElement) {
				audioElement.pause();
				audioElement.src = "";
			}
		};
	}, [loading, channelId, streamUrl, autoPlay]);

	// Add canplay event listener to clear errors when audio is ready to play
	useEffect(() => {
		const audioElement = audioRef.current;
		if (audioElement) {
			const handleCanPlay = () => {
				setError(null);
			};

			audioElement.addEventListener("canplay", handleCanPlay);

			return () => {
				audioElement.removeEventListener("canplay", handleCanPlay);
			};
		}
	}, []);

	return (
		<div className="audio-player w-full card border border-gray-800 bg-black">
			{/* Hidden audio element */}
			<audio ref={audioRef} preload="metadata" crossOrigin="anonymous">
				<source src={streamUrl || undefined} type="audio/mpeg" />
				<source src={streamUrl || undefined} type="audio/mp3" />
				<source src={streamUrl || undefined} type="application/ogg" />
				<track kind="captions" />
			</audio>

			<div className="p-4 flex flex-col space-y-4">
				{/* Station info */}
				<div className="flex justify-between items-center">
					<div>
						<h4 className="font-medium text-lg text-white">{channelTitle}</h4>
						<p className="text-sm text-gray-400">
							{loading ? "Loading..." : isPlaying ? "Live Now" : "Not Playing"}
						</p>
						{error && <p className="text-sm text-red-500">{error}</p>}
					</div>
					<div className="flex items-center space-x-3">
						{isPlaying && (
							<span className="px-3 py-1 bg-red-600 text-white text-xs rounded-full font-medium">
								LIVE
							</span>
						)}
					</div>
				</div>

				{/* AudioMotion Visualizer */}
				<div
					ref={visualizerRef}
					className="visualizer h-24 bg-black border border-gray-800 rounded-lg overflow-hidden"
				/>

				{/* Controls */}
				<div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
					<div className="flex items-center space-x-4">
						{/* Play/Pause button */}
						<button
							type="button"
							onClick={togglePlayPause}
							className="p-3 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
							disabled={!streamUrl || loading}
							aria-label={isPlaying ? "Pause" : "Play"}
						>
							{loading ? (
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
									aria-hidden="true"
									className="animate-spin"
								>
									<path d="M12 22c5.523 0 10-4.477 10-10h-3.5c0 3.59-2.91 6.5-6.5 6.5S5.5 15.59 5.5 12 8.41 5.5 12 5.5V2c-5.523 0-10 4.477-10 10s4.477 10 10 10z" />
								</svg>
							) : isPlaying ? (
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
									aria-hidden="true"
								>
									<rect x="6" y="4" width="4" height="16" />
									<rect x="14" y="4" width="4" height="16" />
								</svg>
							) : (
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
									aria-hidden="true"
								>
									<polygon points="5 3 19 12 5 21 5 3" />
								</svg>
							)}
						</button>

						{/* Random Finder button */}
						<button
							type="button"
							onClick={toggleRandomFinderMode}
							className={`p-3 rounded-full transition-colors ${
								randomFinderMode
									? "bg-blue-600 text-white hover:bg-blue-700"
									: "bg-gray-800 text-white hover:bg-gray-700"
							}`}
							aria-label={
								randomFinderMode ? "Stop Random Finder" : "Start Random Finder"
							}
							title={
								randomFinderMode
									? "Stop finding random stations"
									: "Find random stations around the world"
							}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<polyline points="16 3 21 3 21 8" />
								<line x1="4" y1="20" x2="21" y2="3" />
								<polyline points="21 16 21 21 16 21" />
								<line x1="15" y1="15" x2="21" y2="21" />
								<line x1="4" y1="4" x2="9" y2="9" />
							</svg>
						</button>
					</div>

					{/* Volume controls */}
					<div className="flex items-center space-x-2 w-full sm:w-auto">
						{/* Mute button */}
						<button
							type="button"
							onClick={toggleMute}
							className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 flex-shrink-0"
							aria-label={isMuted ? "Unmute" : "Mute"}
						>
							{isMuted ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
									<line x1="23" y1="9" x2="17" y2="15" />
									<line x1="17" y1="9" x2="23" y2="15" />
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
									<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
									<path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
								</svg>
							)}
						</button>

						{/* Volume slider */}
						<input
							type="range"
							min="0"
							max="100"
							value={volume}
							onChange={handleVolumeChange}
							className="w-full sm:w-32 md:w-40 lg:w-48 h-2 rounded-full accent-white"
							disabled={isMuted}
						/>
					</div>
				</div>

				{/* Random Finder mode info */}
				{randomFinderMode && (
					<div className="p-2 bg-blue-900/30 rounded-md border border-blue-800 mt-2">
						<p className="text-sm text-center text-blue-300">
							Random Finder Active - Discovering stations from around the world
							every 5 seconds
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default AudioPlayer;
