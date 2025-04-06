import { NextResponse } from "next/server";

export async function GET(
	request: Request,
	context: { params: Promise<{ path: string[] }> },
) {
	const { path } = await context.params;

	if (!path || path.length === 0) {
		return NextResponse.json(
			{ error: "No stream URL provided" },
			{ status: 400 },
		);
	}

	// Reconstruct the path with slashes
	const fullPath = path.join("/");
	// Decode the URL if it's encoded
	const decodedPath = decodeURIComponent(fullPath);

	try {
		// If it's already a complete URL, use it directly
		let streamUrl = decodedPath;

		// Otherwise, try to construct a Radio Garden URL
		if (!streamUrl.startsWith("http")) {
			if (streamUrl.startsWith("listen/")) {
				streamUrl = `https://radio.garden/api/ara/content/${streamUrl}`;
			} else {
				streamUrl = `https://radio.garden/api/ara/content/listen/${streamUrl}/channel.mp3`;
			}
		}

		console.log(`Proxying stream from: ${streamUrl}`);

		// Fetch the stream with necessary headers for audio streaming
		const response = await fetch(streamUrl, {
			headers: {
				Accept: "audio/mpeg, audio/mp3, audio/*, */*",
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
			},
		});

		if (!response.ok) {
			console.error(`Stream responded with status: ${response.status}`);
			return NextResponse.json(
				{
					error: `Stream responded with status: ${response.status}`,
					status: response.status,
				},
				{ status: response.status },
			);
		}

		// Get the stream response body as a readable stream
		const body = response.body;

		if (!body) {
			return NextResponse.json({ error: "No stream data" }, { status: 500 });
		}

		// Create a new response with the stream
		const streamResponse = new NextResponse(body);

		// Copy ALL relevant headers from the original response
		response.headers.forEach((value, key) => {
			streamResponse.headers.set(key, value);
		});

		// Ensure proper content type for audio
		const contentType = response.headers.get("content-type");
		if (!contentType || !contentType.includes("audio")) {
			streamResponse.headers.set("Content-Type", "audio/mpeg");
		}

		// Set CORS headers
		streamResponse.headers.set("Access-Control-Allow-Origin", "*");
		streamResponse.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
		streamResponse.headers.set(
			"Access-Control-Allow-Headers",
			"Content-Type, Range",
		);

		// Add range support for audio streaming
		streamResponse.headers.set("Accept-Ranges", "bytes");

		return streamResponse;
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to proxy stream" },
			{ status: 500 },
		);
	}
}
