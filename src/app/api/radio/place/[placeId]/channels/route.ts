import { NextResponse } from "next/server";

export async function GET(
	request: Request,
	context: { params: Promise<{ placeId: string }> },
) {
	const { placeId } = await context.params;

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
			return NextResponse.json(
				{ error: "Empty response from API" },
				{ status: 500 },
			);
		}
		let data: unknown;
		try {
			data = JSON.parse(responseText);
		} catch {
			return NextResponse.json(
				{ error: "Invalid JSON response from API" },
				{ status: 500 },
			);
		}

		return NextResponse.json(data);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch place channels" },
			{ status: 500 },
		);
	}
}
