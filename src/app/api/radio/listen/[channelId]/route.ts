import { NextResponse } from "next/server";

interface SearchHit {
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

interface SearchResponse {
	hits: {
		hits: SearchHit[];
	};
}

interface ChannelData {
	data: {
		title: string;
	};
}

export async function GET(
	request: Request,
	context: { params: Promise<{ channelId: string }> }
) {
	try {
		const { channelId } = await context.params;

		if (!channelId) {
			return NextResponse.json(
				{ error: "Channel ID is required" },
				{ status: 400 },
			);
		}

		console.log(`Fetching stream URL for channel ${channelId}...`);

		// Try to get direct stream URL from search results first
		const searchResponse = await fetch(
			`https://radio.garden/api/search?q=${encodeURIComponent(channelId)}`,
		);

		if (searchResponse.ok) {
			const searchResponseText = await searchResponse.text();
			let searchData: SearchResponse;
			try {
				searchData = JSON.parse(searchResponseText) as SearchResponse;
			} catch (parseError) {
				console.error(`Failed to parse JSON response for channel search ${channelId}:`, parseError);
				console.error(`Response text: ${searchResponseText}`);
				return NextResponse.json(
					{ error: "Invalid JSON response from search API" },
					{ status: 500 },
				);
			}

			// Find a matching station with the channel ID in the URL
			const matchingStation = searchData.hits.hits.find(
				(hit: SearchHit) =>
					hit._source.type === "channel" &&
					hit._source.url?.includes(channelId),
			);

			// If we found a match with a direct stream URL, return it immediately
			if (matchingStation?._source.stream) {
				console.log(
					`Found direct stream URL for ${channelId}: ${matchingStation._source.stream}`,
				);
				// Use our proxy to avoid CORS issues
				const proxyUrl = `/api/radio/stream/${encodeURIComponent(matchingStation._source.stream)}`;
				return NextResponse.json({ streamUrl: proxyUrl });
			}
		}

		// Fallback method: try to get channel details first
		const channelResponse = await fetch(
			`https://radio.garden/api/ara/content/channel/${channelId}`,
		);

		if (!channelResponse.ok) {
			throw new Error(
				`Channel API responded with status: ${channelResponse.status}`,
			);
		}

		const channelResponseText = await channelResponse.text();
		let channelData: ChannelData;
		try {
			channelData = JSON.parse(channelResponseText) as ChannelData;
		} catch (parseError) {
			console.error(`Failed to parse JSON response for channel details ${channelId}:`, parseError);
			console.error(`Response text: ${channelResponseText}`);
			return NextResponse.json(
				{ error: "Invalid JSON response from channel API" },
				{ status: 500 },
			);
		}

		// Search for the channel by title
		const stationTitle = channelData.data.title;
		console.log(`Searching for stream URL by title: ${stationTitle}`);

		const titleSearchResponse = await fetch(
			`https://radio.garden/api/search?q=${encodeURIComponent(stationTitle)}`,
		);

		if (titleSearchResponse.ok) {
			const titleSearchResponseText = await titleSearchResponse.text();
			let titleSearchData: SearchResponse;
			try {
				titleSearchData = JSON.parse(titleSearchResponseText) as SearchResponse;
			} catch (parseError) {
				console.error(`Failed to parse JSON response for title search ${stationTitle}:`, parseError);
				console.error(`Response text: ${titleSearchResponseText}`);
				return NextResponse.json(
					{ error: "Invalid JSON response from title search API" },
					{ status: 500 },
				);
			}

			// Find the exact channel match with stream URL
			const exactMatch = titleSearchData.hits.hits.find(
				(hit: SearchHit) =>
					hit._source.type === "channel" &&
					hit._source.url?.includes(channelId) &&
					hit._source.stream,
			);

			if (exactMatch?._source.stream) {
				console.log(
					`Found stream URL from title search for ${channelId}: ${exactMatch._source.stream}`,
				);
				// Use our proxy to avoid CORS issues
				const proxyUrl = `/api/radio/stream/${encodeURIComponent(exactMatch._source.stream)}`;
				return NextResponse.json({ streamUrl: proxyUrl });
			}
		}

		// Last resort: use the direct MP3 URL through our proxy
		console.log(`Using fallback direct mp3 URL for ${channelId}`);
		const proxyUrl = `/api/radio/stream/${channelId}`;

		return NextResponse.json({
			streamUrl: proxyUrl,
		});
	} catch (error) {
		console.error("Error getting stream URL:", error);
		return NextResponse.json(
			{
				error: "Failed to get stream URL",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
