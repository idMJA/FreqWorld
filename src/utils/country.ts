/**
 * Country utility functions
 * This module provides utilities for working with country codes and names,
 * including detection of country information from text.
 */

// Country code to country name mapping
const countryList: { [key: string]: string | string[] } = {
	AF: "Afghanistan",
	AL: "Albania",
	DZ: "Algeria",
	AS: "American Samoa",
	AD: "Andorra",
	AO: "Angola",
	AI: "Anguilla",
	AQ: "Antarctica",
	AG: "Antigua and Barbuda",
	AR: "Argentina",
	AM: "Armenia",
	AW: "Aruba",
	AU: "Australia",
	AT: "Austria",
	AZ: "Azerbaijan",
	BS: "Bahamas (the)",
	BH: "Bahrain",
	BD: "Bangladesh",
	BB: "Barbados",
	BY: "Belarus",
	BE: "Belgium",
	BZ: "Belize",
	BJ: "Benin",
	BM: "Bermuda",
	BT: "Bhutan",
	BO: "Bolivia",
	BQ: "Bonaire, Sint Eustatius and Saba",
	BA: "Bosnia and Herzegovina",
	BW: "Botswana",
	BV: "Bouvet Island",
	BR: "Brazil",
	IO: "British Indian Ocean Territory",
	BN: "Brunei Darussalam",
	BG: "Bulgaria",
	BF: "Burkina Faso",
	BI: "Burundi",
	CV: "Cabo Verde",
	KH: "Cambodia",
	CM: "Cameroon",
	CA: "Canada",
	KY: "Cayman Islands",
	CF: "Central African Republic",
	TD: "Chad",
	CL: "Chile",
	CN: "China",
	CX: "Christmas Island",
	CC: "Cocos Islands",
	CO: "Colombia",
	KM: "Comoros",
	CD: "Congo",
	CG: "Congo",
	CK: "Cook Islands",
	CR: "Costa Rica",
	HR: "Croatia",
	CU: "Cuba",
	CW: "Curaçao",
	CY: "Cyprus",
	CZ: "Czechia",
	CI: "Côte d'Ivoire",
	DK: "Denmark",
	DJ: "Djibouti",
	DM: "Dominica",
	DO: "Dominican Republic",
	EC: "Ecuador",
	EG: "Egypt",
	SV: "El Salvador",
	GQ: "Equatorial Guinea",
	ER: "Eritrea",
	EE: "Estonia",
	SZ: "Eswatini",
	ET: "Ethiopia",
	FK: "Falkland Islands",
	FO: "Faroe Islands",
	FJ: "Fiji",
	FI: "Finland",
	FR: ["France", "Guadeloupe"],
	GF: "French Guiana",
	PF: "French Polynesia",
	TF: "French Southern Territories",
	GA: "Gabon",
	GM: "Gambia",
	GE: "Georgia",
	DE: "Germany",
	GH: "Ghana",
	GI: "Gibraltar",
	GR: "Greece",
	GL: "Greenland",
	GD: "Grenada",
	GP: "Guadeloupe",
	GU: "Guam",
	GT: "Guatemala",
	GG: "Guernsey",
	GN: "Guinea",
	GW: "Guinea-Bissau",
	GY: "Guyana",
	HT: "Haiti",
	HM: "Heard Island and McDonald Islands",
	VA: "Holy See",
	HN: "Honduras",
	HK: "Hong Kong",
	HU: "Hungary",
	IS: "Iceland",
	IN: "India",
	ID: "Indonesia",
	IR: "Iran",
	IQ: "Iraq",
	IE: "Ireland",
	IM: "Isle of Man",
	IL: "Israel",
	IT: "Italy",
	JM: "Jamaica",
	JP: "Japan",
	JE: "Jersey",
	JO: "Jordan",
	KZ: "Kazakhstan",
	KE: "Kenya",
	KI: "Kiribati",
	KP: "Korea",
	KR: "South Korea",
	KW: "Kuwait",
	KG: "Kyrgyzstan",
	LA: "Lao People's Democratic Republic",
	LV: "Latvia",
	LB: "Lebanon",
	LS: "Lesotho",
	LR: "Liberia",
	LY: "Libya",
	LI: "Liechtenstein",
	LT: "Lithuania",
	LU: "Luxembourg",
	MO: "Macao",
	MG: "Madagascar",
	MW: "Malawi",
	MY: "Malaysia",
	MV: "Maldives",
	ML: "Mali",
	MT: "Malta",
	MH: "Marshall Islands",
	MQ: "Martinique",
	MR: "Mauritania",
	MU: "Mauritius",
	YT: "Mayotte",
	MX: "Mexico",
	FM: "Micronesia",
	MD: "Moldova",
	MC: "Monaco",
	MN: "Mongolia",
	ME: "Montenegro",
	MS: "Montserrat",
	MA: "Morocco",
	MZ: "Mozambique",
	MM: "Myanmar",
	NA: "Namibia",
	NR: "Nauru",
	NP: "Nepal",
	NL: "Netherlands",
	NC: "New Caledonia",
	NZ: "New Zealand",
	NI: "Nicaragua",
	NE: "Niger",
	NG: "Nigeria",
	NU: "Niue",
	NF: "Norfolk Island",
	MP: "Northern Mariana Islands",
	NO: "Norway",
	OM: "Oman",
	PK: "Pakistan",
	PW: "Palau",
	PS: "Palestine",
	PA: "Panama",
	PG: "Papua New Guinea",
	PY: "Paraguay",
	PE: "Peru",
	PH: "Philippines",
	PN: "Pitcairn",
	PL: "Poland",
	PT: ["Portugal", "Madeira"],
	PR: "Puerto Rico",
	QA: "Qatar",
	MK: "North Macedonia",
	RO: "Romania",
	RU: "Russia",
	RW: "Rwanda",
	RE: "Réunion",
	BL: "Saint Barthélemy",
	SH: "Saint Helena, Ascension and Tristan da Cunha",
	KN: "Saint Kitts and Nevis",
	LC: "Saint Lucia",
	MF: "Saint Martin",
	PM: "Saint Pierre and Miquelon",
	VC: "Saint Vincent and the Grenadines",
	WS: "Samoa",
	SM: "San Marino",
	ST: "Sao Tome and Principe",
	SA: "Saudi Arabia",
	SN: "Senegal",
	RS: "Serbia",
	SC: "Seychelles",
	SL: "Sierra Leone",
	SG: "Singapore",
	SX: "Sint Maarten",
	SK: "Slovakia",
	SI: "Slovenia",
	SB: "Solomon Islands",
	SO: "Somalia",
	ZA: "South Africa",
	GS: "South Georgia and the South Sandwich Islands",
	SS: "South Sudan",
	ES: "Spain",
	LK: "Sri Lanka",
	SD: "Sudan",
	SR: "Suriname",
	SJ: "Svalbard and Jan Mayen",
	SE: "Sweden",
	CH: "Switzerland",
	SY: "Syrian Arab Republic",
	TW: "Taiwan",
	TJ: "Tajikistan",
	TZ: "Tanzania",
	TH: "Thailand",
	TL: "Timor-Leste",
	TG: "Togo",
	TK: "Tokelau",
	TO: "Tonga",
	TT: "Trinidad and Tobago",
	TN: "Tunisia",
	TR: ["Turkey", "Türkiye"],
	TM: "Turkmenistan",
	TC: "Turks and Caicos Islands",
	TV: "Tuvalu",
	UG: "Uganda",
	UA: "Ukraine",
	AE: "United Arab Emirates",
	GB: "United Kingdom",
	US: ["United States", "United States Minor Outlying Islands"],
	UY: "Uruguay",
	UZ: "Uzbekistan",
	VU: "Vanuatu",
	VE: "Venezuela",
	VN: "Viet Nam",
	VG: ["Virgin Islands", "British Virgin Islands"],
	VI: ["Virgin Islands", "U.S. Virgin Islands"],
	WF: "Wallis and Futuna",
	EH: "Western Sahara",
	YE: "Yemen",
	ZM: "Zambia",
	ZW: "Zimbabwe",
	AX: "Åland Islands",
};

/**
 * Get country name from country code
 * @param code The country code to look up
 * @returns The country name or empty string if not found
 */
export function searchCountrybyCode(code: string): string {
	const country = countryList[code];
	if (!country) return "";
	return Array.isArray(country) ? country[0] : country;
}

/**
 * Get country code from country name
 * @param name The country name to look up
 * @returns The country code or empty string if not found
 */
export function searchCountrybyName(name: string): string {
	if (!name) return "";

	// First try exact match
	const exactMatch = Object.keys(countryList).find((key) => {
		const country = countryList[key];
		if (Array.isArray(country)) {
			return country.includes(name);
		}
		return country === name;
	});

	if (exactMatch) return exactMatch;

	// Try case-insensitive match
	const nameLower = name.toLowerCase().trim();
	const result = Object.keys(countryList).find((key) => {
		const country = countryList[key];
		if (Array.isArray(country)) {
			return country.some((c) => c.toLowerCase() === nameLower);
		}
		return country.toLowerCase() === nameLower;
	});

	if (result) return result;

	return "";
}

/**
 * Extracts location information from text in parentheses
 * @param text Text that may contain location in parentheses
 * @returns Extracted location or empty string
 */
export function extractLocationFromParentheses(text: string): string {
	if (!text) return "";

	// Check if text has location information in parentheses
	if (text.includes("(") && text.includes(")")) {
		const start = text.indexOf("(");
		const end = text.indexOf(")");
		if (start < end) {
			return text.substring(start + 1, end).trim();
		}
	}

	return "";
}

/**
 * Get last part of a comma-separated string (typically the country name)
 * @param text Comma-separated text
 * @returns Last part of the comma-separated string
 */
export function getLastPartAfterComma(text: string): string {
	if (!text || !text.includes(",")) return text || "";

	const parts = text.split(",");
	return parts[parts.length - 1].trim();
}

/**
 * Splits text into words that can be checked individually for country names
 * @param text Text to split into words
 * @returns Array of words that could potentially be country/city names
 */
function splitTextIntoWords(text: string): string[] {
	if (!text) return [];

	return text
		.replace(/[()[\]{}]/g, " ") // Remove brackets
		.split(/[\s,.-]+/) // Split by spaces, commas, periods, hyphens
		.filter((word) => word.length > 2); // Skip short words
}

/**
 * Get country code from text using multiple strategies
 * @param text Text to analyze for country information
 * @returns Object with country code and location name
 */
export function getCountryFromText(text: string): {
	countryCode: string;
	locationName: string;
} {
	if (!text) return { countryCode: "", locationName: "" };

	// Step 1: If text contains comma, try the last part (typically country name)
	if (text.includes(",")) {
		const lastPart = getLastPartAfterComma(text);
		const countryCode = searchCountrybyName(lastPart);
		if (countryCode) {
			return { countryCode, locationName: lastPart };
		}
	}

	// Step 2: Try direct match with country or location name
	const directMatchCode = searchCountrybyName(text);
	if (directMatchCode) {
		return { countryCode: directMatchCode, locationName: text };
	}

	// Step 3: Split text into words and check each word
	const words = splitTextIntoWords(text);
	for (const word of words) {
		const wordCountryCode = searchCountrybyName(word);
		if (wordCountryCode) {
			return { countryCode: wordCountryCode, locationName: word };
		}
	}

	// Return empty if no match found
	return { countryCode: "", locationName: "" };
}

/**
 * Comprehensive country/location detection from text
 * @param text Text to analyze for country/location information
 * @returns Object with country code and location name if found
 */
export function detectLocationFromText(text: string): {
	countryCode: string;
	locationName: string;
} {
	if (!text) return { countryCode: "", locationName: "" };

	// First check for location in parentheses (common format)
	const locationInParentheses = extractLocationFromParentheses(text);
	if (locationInParentheses) {
		const result = getCountryFromText(locationInParentheses);
		if (result.countryCode) {
			return {
				countryCode: result.countryCode,
				locationName: locationInParentheses,
			};
		}
	}

	// Try to find country or city in the full text
	return getCountryFromText(text);
}
