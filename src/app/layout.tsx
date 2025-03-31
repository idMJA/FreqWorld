import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "FreqWorld - Listen to the World",
	description:
		"A modern radio experience with live streams from around the globe",
	keywords: [
		"radio",
		"music",
		"live stream",
		"global",
		"stations",
		"freq",
		"freqworld",
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-black text-white`}
			>
				{children}
			</body>
		</html>
	);
}
