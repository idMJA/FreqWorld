"use client";

import { useState } from "react";
import Link from "next/link";
import Search from "./Search";

const Header = () => {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

	return (
		<>
			<header className="sticky top-0 z-50 bg-black border-b border-gray-800 backdrop-blur-md">
				<div className="container mx-auto px-4 py-3 md:py-4">
					<div className="flex items-center justify-between">
						{/* Logo */}
						<Link href="/" className="flex items-center space-x-2">
							<div className="relative w-8 h-8 md:w-10 md:h-10">
								<div className="absolute inset-0 bg-white rounded-full animate-pulse" />
								<div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
									<div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full" />
								</div>
							</div>
							<span className="text-xl md:text-2xl font-bold text-white">
								FreqWorld
							</span>
						</Link>

						{/* Search button */}
						<div className="flex items-center">
							<button
								type="button"
								className="p-2 rounded-full hover:bg-gray-900 transition-colors"
								aria-label="Search"
								onClick={toggleSearch}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="text-white"
									aria-hidden="true"
								>
									<circle cx="11" cy="11" r="8" />
									<line x1="21" y1="21" x2="16.65" y2="16.65" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Search component */}
			<Search isOpen={isSearchOpen} onClose={toggleSearch} />
		</>
	);
};

export default Header;
