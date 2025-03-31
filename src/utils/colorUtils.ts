// Utility functions for colors

// Generate a random color for station icons
export const getRandomColor = (): string => {
	const colors = [
		"bg-blue-800",
		"bg-indigo-800",
		"bg-cyan-800",
		"bg-emerald-800",
		"bg-teal-800",
		"bg-green-800",
		"bg-purple-800",
		"bg-violet-800",
		"bg-fuchsia-800",
		"bg-pink-800",
		"bg-rose-800",
		"bg-red-800",
	];
	return colors[Math.floor(Math.random() * colors.length)];
};

// Get a specific color based on the first letter of a string
export const getColorByLetter = (text: string): string => {
	if (!text || text.length === 0) return "bg-gray-800";

	const letter = text.charAt(0).toLowerCase();
	const colorMap: Record<string, string> = {
		a: "bg-red-800",
		b: "bg-blue-800",
		c: "bg-green-800",
		d: "bg-yellow-800",
		e: "bg-purple-800",
		f: "bg-pink-800",
		g: "bg-indigo-800",
		h: "bg-cyan-800",
		i: "bg-teal-800",
		j: "bg-emerald-800",
		k: "bg-lime-800",
		l: "bg-amber-800",
		m: "bg-orange-800",
		n: "bg-rose-800",
		o: "bg-fuchsia-800",
		p: "bg-violet-800",
		q: "bg-sky-800",
		r: "bg-blue-800",
		s: "bg-green-800",
		t: "bg-red-800",
		u: "bg-purple-800",
		v: "bg-pink-800",
		w: "bg-indigo-800",
		x: "bg-yellow-800",
		y: "bg-cyan-800",
		z: "bg-teal-800",
	};

	return colorMap[letter] || "bg-gray-800";
};
