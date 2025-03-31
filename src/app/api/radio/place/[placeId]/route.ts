import { NextResponse } from "next/server";

export async function GET(
	request: Request,
) {
	const { params } = await request.json();
	const { placeId } = params;

	if (!placeId) {
		return NextResponse.json(
			{ error: "Place ID is required" },
			{ status: 400 },
		);
	}

	try {
		// According to the spec, the endpoint is /ara/content/page/{placeId}
		const response = await fetch(
			`https://radio.garden/api/ara/content/page/${placeId}`,
		);

		if (!response.ok) {
			throw new Error(
				`Radio Garden API responded with status: ${response.status}`,
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error(
			`Error proxying place details request for place ${placeId}:`,
			error,
		);
		return NextResponse.json(
			{ error: "Failed to fetch place details" },
			{ status: 500 },
		);
	}
}
