import { NextResponse } from "next/server";

export async function GET() {
	try {
		// According to the spec, the endpoint is /ara/content/places
		const response = await fetch("https://radio.garden/api/ara/content/places");

		if (!response.ok) {
			throw new Error(
				`Radio Garden API responded with status: ${response.status}`,
			);
		}

		const data = await response.json();

		// Log the structure to help with debugging
		console.log("Places API response structure:", Object.keys(data));

		// Return the data as-is to ensure we preserve the original structure
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error proxying places request:", error);
		return NextResponse.json(
			{ error: "Failed to fetch places" },
			{ status: 500 },
		);
	}
}
