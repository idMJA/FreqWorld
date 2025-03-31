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
		// According to the spec, the endpoint is /ara/content/page/{placeId}/channels
		const response = await fetch(
			`https://radio.garden/api/ara/content/page/${placeId}/channels`,
		);

		if (!response.ok) {
			throw new Error(
				`Radio Garden API responded with status: ${response.status}`,
			);
		}

		const responseText = await response.text();
		if (!responseText) {
			return NextResponse.json({ error: "Empty response from API" }, { status: 500 });
		}
		let data: unknown;
		try {
			data = JSON.parse(responseText);
		} catch (parseError) {
			console.error(`Failed to parse JSON response for place ${placeId}:`, parseError);
			console.error(`Response text: ${responseText}`);
			return NextResponse.json(
				{ error: "Invalid JSON response from API" },
				{ status: 500 },
			);
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error(
			`Error proxying channels request for place ${placeId}:`,
			error,
		);
		return NextResponse.json(
			{ error: "Failed to fetch place channels" },
			{ status: 500 },
		);
	}
}
