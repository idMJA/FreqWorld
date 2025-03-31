// Cookie utility functions for the Radio app

/**
 * Set a cookie with the given name, value, and expiration days
 */
export function setCookie(name: string, value: string, days = 365): void {
	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
	const expires = `expires=${date.toUTCString()}`;
	document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
}

/**
 * Get a cookie value by name
 * Returns null if the cookie doesn't exist
 */
export function getCookie(name: string): string | null {
	const nameEQ = `${name}=`;
	const ca = document.cookie.split(";");

	for (let i = 0; i < ca.length; i++) {
		const c = ca[i].trim();
		if (c.indexOf(nameEQ) === 0) {
			return c.substring(nameEQ.length, c.length);
		}
	}

	return null;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string): void {
	setCookie(name, "", -1);
}
