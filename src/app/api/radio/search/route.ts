import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q");

	if (!query) {
		return NextResponse.json(
			{ error: "Search query is required" },
			{ status: 400 },
		);
	}

	try {
		// According to the spec, the endpoint is /search?q={query}
		const response = await fetch(
			`https://radio.garden/api/search?q=${encodeURIComponent(query)}`,
		);

		if (!response.ok) {
			throw new Error(
				`Radio Garden API responded with status: ${response.status}`,
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error(`Error proxying search request for query "${query}":`, error);
		return NextResponse.json(
			{ error: "Failed to search radio stations" },
			{ status: 500 },
		);
	}
}
