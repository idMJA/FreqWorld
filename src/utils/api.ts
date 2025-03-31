// Radio Garden API utilities

// API Functions
export async function getPlaces(): Promise<Place[]> {
	try {
		console.log("Fetching places from Radio Garden API...");
		const response = await fetch("/api/radio/places");

		if (!response.ok) {
			throw new Error("Failed to fetch places");
		}

		const data = await response.json();

		// Log structure to help with debugging
		console.log("Places API client response structure:", Object.keys(data));

		// The Radio Garden API response has the list in data.data.list
		if (data?.data?.list && Array.isArray(data.data.list)) {
			console.log(`Found ${data.data.list.length} places`);
			return data.data.list;
		}

		console.error("Unexpected places API response structure:", data);
		return [];
	} catch (error) {
		console.error("Error fetching places:", error);
		return [];
	}
}

export async function getPlaceDetails(
	placeId: string,
): Promise<PlaceDetails | null> {
	try {
		const response = await fetch(`/api/radio/place/${placeId}`);
		if (!response.ok)
			throw new Error(`Failed to fetch place details for ${placeId}`);

		const data = await response.json();
		// According to the spec, place details are in data.data
		return data.data;
	} catch (error) {
		console.error(`Error fetching place details for ${placeId}:`, error);
		return null;
	}
}

// Menambahkan tipe untuk struktur item channel
interface ChannelItem {
	page?: {
		url?: string;
		title?: string;
		website?: string;
		place?: {
			id: string;
			title: string;
		};
		country?: {
			id: string;
			title: string;
		};
		secure?: boolean;
	};
}

export async function getPlaceChannels(placeId: string): Promise<Channel[]> {
	try {
		const response = await fetch(`/api/radio/place/${placeId}/channels`);
		if (!response.ok)
			throw new Error(`Failed to fetch channels for place ${placeId}`);

		const data = await response.json();
		console.log(
			`Channels data structure for ${placeId}:`,
			data?.data?.content?.[0]?.itemsType,
		);

		// API structure: data.data.content[0].items[].page
		if (
			data?.data?.content?.[0]?.items &&
			Array.isArray(data.data.content[0].items)
		) {
			const channelItems = data.data.content[0].items as ChannelItem[];
			// Mengekstrak data 'page' dari setiap item channel
			return channelItems
				.map((item: ChannelItem) => {
					if (!item.page) return null;

					const channel: Channel = {
						id: item.page.url?.split("/").pop() || "",
						title: item.page.title || "",
						url: item.page.url || "",
						website: item.page.website || "",
						place: item.page.place,
						country: item.page.country,
						secure: item.page.secure || false,
					};

					return channel;
				})
				.filter((channel): channel is Channel => channel !== null);
		}

		console.warn(
			`Unexpected channel data structure for place ${placeId}:`,
			data,
		);
		return [];
	} catch (error) {
		console.error(`Error fetching channels for place ${placeId}:`, error);
		return [];
	}
}

export async function getChannelDetails(
	channelId: string,
): Promise<Channel | null> {
	try {
		const response = await fetch(`/api/radio/channel/${channelId}`);
		if (!response.ok)
			throw new Error(`Failed to fetch channel details for ${channelId}`);

		const data = await response.json();
		// According to the spec, channel details are in data.data
		return data.data;
	} catch (error) {
		console.error(`Error fetching channel details for ${channelId}:`, error);
		return null;
	}
}

export async function getChannelStreamUrl(
	channelId: string,
): Promise<string | null> {
	try {
		// This endpoint should return the redirect URL for the stream
		console.log(`Fetching stream URL for channel ${channelId}...`);
		const response = await fetch(`/api/radio/listen/${channelId}`);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.error(
				`Failed to get stream URL, server responded with status ${response.status}:`,
				errorData,
			);

			if (response.status === 404) {
				throw new Error(
					"Radio station is currently not accessible. Please try again later or select another station.",
				);
			}

			throw new Error(
				errorData.error || `Failed to get stream URL for ${channelId}`,
			);
		}

		const data = await response.json();

		if (!data.streamUrl) {
			console.error("No stream URL found in response:", data);
			return null;
		}

		console.log(`Stream URL found: ${data.streamUrl}`);
		return data.streamUrl;
	} catch (error) {
		console.error(`Error getting stream URL for ${channelId}:`, error);
		return null;
	}
}

export async function searchRadio(query: string): Promise<SearchResult[]> {
	try {
		const response = await fetch(
			`/api/radio/search?q=${encodeURIComponent(query)}`,
		);
		if (!response.ok) throw new Error(`Failed to search for ${query}`);

		const data = await response.json();
		// According to the spec, search results are in data.hits.hits
		return data.hits.hits || [];
	} catch (error) {
		console.error(`Error searching for ${query}:`, error);
		return [];
	}
}

export async function getGeoLocation() {
	try {
		const response = await fetch("/api/radio/geo");
		if (!response.ok) throw new Error("Failed to fetch geolocation");

		const data = await response.json();
		// According to the spec, geo data is directly in the response
		return data;
	} catch (error) {
		console.error("Error fetching geolocation:", error);
		return null;
	}
}

// Types for API responses based on the OpenAPI spec
export interface Place {
	id: string;
	geo: number[];
	url: string;
	size: number;
	boost: boolean;
	title: string;
	country: string;
}

export interface Channel {
	id?: string;
	title: string;
	url?: string;
	href?: string; // Some responses use href instead of url
	website?: string;
	secure?: boolean;
	place?: {
		id: string;
		title: string;
	};
	country?: {
		id: string;
		title: string;
	};
	subtitle?: string; // For search results and channel with place info
	map?: string; // For channel with place info
}

interface ContentItem {
	title: string;
	type: string;
	itemsType?: string;
	items?: unknown[];
	actionPage?: unknown;
	actionText?: string;
	rightAccessory?: string;
}

export interface PlaceDetails {
	title: string;
	subtitle?: string;
	url: string;
	map: string;
	count: number;
	utcOffset: number;
	content?: ContentItem[];
}

export interface SearchResult {
	_id: string;
	_score: number;
	_source: {
		code: string;
		subtitle: string;
		type: string;
		title: string;
		url: string;
		stream?: string;
	};
}
