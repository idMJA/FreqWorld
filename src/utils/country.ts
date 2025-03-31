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
	FR: "France",
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
	MK: "Republic of North Macedonia",
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
	GB: "United Kingdom of Great Britain and Northern Ireland",
	UM: "United States Minor Outlying Islands",
	US: "United States of America",
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

export function searchCountrybyCode(code: string): string {
	return countryList[code] as string;
}

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

	// If still not found, try fuzzy matching for common variations
	if (!result) {
		if (
			nameLower.includes("united states") ||
			nameLower === "usa" ||
			nameLower === "us" ||
			nameLower === "america"
		)
			return "US";
		if (
			nameLower.includes("united kingdom") ||
			nameLower === "uk" ||
			nameLower === "britain" ||
			nameLower === "great britain" ||
			nameLower === "england"
		)
			return "GB";
		if (
			nameLower.includes("japan") ||
			nameLower === "jpn" ||
			nameLower === "tokyo"
		)
			return "JP";
		if (
			nameLower.includes("indonesia") ||
			nameLower === "idn" ||
			nameLower === "jakarta" ||
			nameLower === "bali"
		)
			return "ID";
		if (
			nameLower.includes("malaysia") ||
			nameLower === "mys" ||
			nameLower === "kuala lumpur"
		)
			return "MY";
		if (nameLower.includes("singapore") || nameLower === "sgp") return "SG";
		if (
			(nameLower.includes("korea") && !nameLower.includes("north")) ||
			nameLower === "seoul" ||
			nameLower === "south korea"
		)
			return "KR";
		if (
			nameLower.includes("russia") ||
			nameLower === "russian federation" ||
			nameLower === "moscow"
		)
			return "RU";
		if (
			nameLower.includes("italy") ||
			nameLower === "italia" ||
			nameLower === "rome" ||
			nameLower === "milano" ||
			nameLower === "milan"
		)
			return "IT";
		if (
			nameLower.includes("czech") ||
			nameLower === "czechia" ||
			nameLower === "prague"
		)
			return "CZ";
		if (nameLower.includes("bahamas")) return "BS";
		if (nameLower.includes("sint maarten")) return "SX";
		if (
			nameLower.includes("australia") ||
			nameLower === "sydney" ||
			nameLower === "melbourne"
		)
			return "AU";
		if (
			nameLower.includes("canada") ||
			nameLower === "toronto" ||
			nameLower === "montreal" ||
			nameLower === "vancouver"
		)
			return "CA";
		if (nameLower.includes("france") || nameLower === "paris") return "FR";
		if (
			nameLower.includes("germany") ||
			nameLower === "berlin" ||
			nameLower === "munchen" ||
			nameLower === "munich"
		)
			return "DE";
		if (
			nameLower.includes("spain") ||
			nameLower === "madrid" ||
			nameLower === "barcelona"
		)
			return "ES";
		if (
			nameLower.includes("brazil") ||
			nameLower === "brasil" ||
			nameLower === "rio" ||
			nameLower === "sao paulo"
		)
			return "BR";
		if (
			nameLower.includes("netherlands") ||
			nameLower === "holland" ||
			nameLower === "amsterdam" ||
			nameLower === "dutch"
		)
			return "NL";
		if (nameLower.includes("new zealand") || nameLower === "auckland")
			return "NZ";
		if (
			nameLower.includes("china") ||
			nameLower === "beijing" ||
			nameLower === "shanghai"
		)
			return "CN";
		if (
			nameLower.includes("india") ||
			nameLower === "mumbai" ||
			nameLower === "delhi"
		)
			return "IN";
		if (
			nameLower.includes("israel") ||
			nameLower === "tel aviv" ||
			nameLower === "jerusalem"
		)
			return "IL";
		if (nameLower.includes("chile") || nameLower === "santiago") return "CL";
		if (nameLower.includes("thailand") || nameLower === "bangkok") return "TH";
		if (
			nameLower.includes("south africa") ||
			nameLower === "johannesburg" ||
			nameLower === "cape town"
		)
			return "ZA";
		if (nameLower.includes("egypt") || nameLower === "cairo") return "EG";
		if (nameLower.includes("ireland") || nameLower === "dublin") return "IE";
		if (nameLower.includes("hong kong")) return "HK";
	}

	return result || "";
}

// Central location mappings - consolidating the duplicated mappings from components
const popularCities: { [key: string]: string } = {
	Tokyo: "JP",
	Osaka: "JP",
	Rome: "IT",
	Milan: "IT",
	Verona: "IT",
	"New York": "US",
	"Los Angeles": "US",
	Chicago: "US",
	London: "GB",
	Manchester: "GB",
	Paris: "FR",
	Berlin: "DE",
	Jakarta: "ID",
	"Kuala Lumpur": "MY",
	Singapore: "SG",
	Bangkok: "TH",
	"Hong Kong": "HK",
	Sydney: "AU",
	Melbourne: "AU",
	Seoul: "KR",
	Beijing: "CN",
	Moscow: "RU",
	Toronto: "CA",
	Montreal: "CA",
	Vancouver: "CA",
	Amsterdam: "NL",
	Madrid: "ES",
	Barcelona: "ES",
	Bali: "ID",
};

const commonCountries = [
	{ name: "Japan", code: "JP" },
	{ name: "Italy", code: "IT" },
	{ name: "Italia", code: "IT" },
	{ name: "United States", code: "US" },
	{ name: "USA", code: "US" },
	{ name: "UK", code: "GB" },
	{ name: "England", code: "GB" },
	{ name: "Indonesia", code: "ID" },
	{ name: "Malaysia", code: "MY" },
	{ name: "Singapore", code: "SG" },
	{ name: "Australia", code: "AU" },
	{ name: "Canada", code: "CA" },
	{ name: "France", code: "FR" },
	{ name: "Germany", code: "DE" },
	{ name: "Brazil", code: "BR" },
	{ name: "Netherlands", code: "NL" },
	{ name: "Spain", code: "ES" },
	{ name: "India", code: "IN" },
	{ name: "China", code: "CN" },
	{ name: "Russia", code: "RU" },
	{ name: "Israel", code: "IL" },
	{ name: "Chile", code: "CL" },
	{ name: "Korea", code: "KR" },
	{ name: "The Bahamas", code: "BS" },
	{ name: "Czech Republic", code: "CZ" },
];

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
 * Checks if a text contains any of the common cities
 * @param text Text to check for city names
 * @returns Object with city name and country code if found
 */
function checkForCommonCities(
	text: string,
): { name: string; code: string } | null {
	if (!text) return null;

	const textLower = text.toLowerCase();

	for (const [city, code] of Object.entries(popularCities)) {
		if (textLower.includes(city.toLowerCase())) {
			return { name: city, code };
		}
	}

	return null;
}

/**
 * Checks if a text contains any of the common countries
 * @param text Text to check for country names
 * @returns Object with country name and code if found
 */
function checkForCommonCountries(
	text: string,
): { name: string; code: string } | null {
	if (!text) return null;

	const textLower = text.toLowerCase();

	for (const country of commonCountries) {
		if (textLower.includes(country.name.toLowerCase())) {
			return country;
		}
	}

	return null;
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
	const result = getCountryFromText(text);
	if (result.countryCode) {
		return result;
	}

	// If nothing found, return empty values
	return { countryCode: "", locationName: "" };
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
	const countryToCheck = text;

	if (text.includes(",")) {
		const lastPart = getLastPartAfterComma(text);
		const countryCode = searchCountrybyName(lastPart);
		if (countryCode) {
			return { countryCode, locationName: lastPart };
		}
		// If not found, continue with other methods below
	}

	// Step 2: Try direct match with country name
	const directMatchCode = searchCountrybyName(countryToCheck);
	if (directMatchCode) {
		return { countryCode: directMatchCode, locationName: countryToCheck };
	}

	// Step 3: Check for common cities
	const cityMatch = checkForCommonCities(text);
	if (cityMatch) {
		return { countryCode: cityMatch.code, locationName: cityMatch.name };
	}

	// Step 4: Check for common countries
	const countryMatch = checkForCommonCountries(text);
	if (countryMatch) {
		return { countryCode: countryMatch.code, locationName: countryMatch.name };
	}

	// Step 5: Split text into words and check each word
	const words = splitTextIntoWords(text);
	for (const word of words) {
		const wordCountryCode = searchCountrybyName(word);
		if (wordCountryCode) {
			return { countryCode: wordCountryCode, locationName: word };
		}
	}

	// Step 6: Try to match city names in the words
	for (const word of words) {
		for (const [city, code] of Object.entries(popularCities)) {
			if (
				city.toLowerCase().includes(word.toLowerCase()) ||
				word.toLowerCase().includes(city.toLowerCase())
			) {
				return { countryCode: code, locationName: city };
			}
		}
	}

	// Return empty if no match found
	return { countryCode: "", locationName: "" };
}

export function convertCountrytoIndex(country: string): number {
	return Object.keys(countryList).indexOf(country);
}

export function convertIndextoCountry(index: number): string {
	return Object.keys(countryList)[index];
}
