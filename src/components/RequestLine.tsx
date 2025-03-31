"use client";

import { useState } from "react";

interface RequestLineProps {
	className?: string;
}

const RequestLine = ({ className = "" }: RequestLineProps) => {
	const [formData, setFormData] = useState({
		songTitle: "",
		artist: "",
		name: "",
		email: "",
		message: "",
	});

	const [formStatus, setFormStatus] = useState<
		"idle" | "submitting" | "success" | "error"
	>("idle");

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setFormStatus("submitting");

		// Simulate API call
		setTimeout(() => {
			// In a real application, this would be a call to an API
			console.log("Request submitted:", formData);
			setFormStatus("success");
			setFormData({
				songTitle: "",
				artist: "",
				name: "",
				email: "",
				message: "",
			});

			// Reset to idle after 3 seconds
			setTimeout(() => {
				setFormStatus("idle");
			}, 3000);
		}, 1000);
	};

	return (
		<div className={`card ${className}`}>
			<h3 className="text-xl font-bold mb-4">Request Line</h3>

			{formStatus === "success" ? (
				<div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-md mb-4">
					<p className="text-center">
						Your request has been submitted! Our DJs will review it soon.
					</p>
				</div>
			) : formStatus === "error" ? (
				<div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-md mb-4">
					<p className="text-center">
						Sorry, there was an error submitting your request. Please try again.
					</p>
				</div>
			) : null}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label
							htmlFor="songTitle"
							className="block text-sm font-medium mb-1"
						>
							Song Title <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="songTitle"
							name="songTitle"
							value={formData.songTitle}
							onChange={handleChange}
							className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
							required
							disabled={formStatus === "submitting"}
						/>
					</div>

					<div>
						<label htmlFor="artist" className="block text-sm font-medium mb-1">
							Artist <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="artist"
							name="artist"
							value={formData.artist}
							onChange={handleChange}
							className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
							required
							disabled={formStatus === "submitting"}
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label htmlFor="name" className="block text-sm font-medium mb-1">
							Your Name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
							required
							disabled={formStatus === "submitting"}
						/>
					</div>

					<div>
						<label htmlFor="email" className="block text-sm font-medium mb-1">
							Email <span className="text-red-500">*</span>
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
							required
							disabled={formStatus === "submitting"}
						/>
					</div>
				</div>

				<div>
					<label htmlFor="message" className="block text-sm font-medium mb-1">
						Message (Optional)
					</label>
					<textarea
						id="message"
						name="message"
						value={formData.message}
						onChange={handleChange}
						rows={3}
						className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
						disabled={formStatus === "submitting"}
					/>
				</div>

				<div className="flex justify-end">
					<button
						type="submit"
						className="btn btn-primary"
						disabled={formStatus === "submitting"}
					>
						{formStatus === "submitting" ? (
							<>
								<svg
									className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								Submitting...
							</>
						) : (
							"Submit Request"
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

export default RequestLine;
