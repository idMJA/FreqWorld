import { NextResponse } from "next/server";

export async function GET() {
	try {
		// According to the spec, the endpoint is /geo
		const response = await fetch("https://radio.garden/api/geo");

		if (!response.ok) {
			throw new Error(
				`Radio Garden API responded with status: ${response.status}`,
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error proxying geolocation request:", error);
		return NextResponse.json(
			{ error: "Failed to fetch geolocation" },
			{ status: 500 },
		);
	}
}
