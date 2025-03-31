import { NextResponse } from "next/server";

export async function GET(
	request: Request,
) {
	const { params } = await request.json();
	const { channelId } = params;

	if (!channelId) {
		return NextResponse.json(
			{ error: "Channel ID is required" },
			{ status: 400 },
		);
	}

	try {
		// According to the spec, the endpoint is /ara/content/channel/{channelId}
		const response = await fetch(
			`https://radio.garden/api/ara/content/channel/${channelId}`,
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
			`Error proxying channel details request for channel ${channelId}:`,
			error,
		);
		return NextResponse.json(
			{ error: "Failed to fetch channel details" },
			{ status: 500 },
		);
	}
}
