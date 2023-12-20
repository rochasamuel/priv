/**
 * Normalizes a string to be used as a name.
 * @param value The string to normalize.
 * @returns The normalized string.
 */
export function normalizeName(value: string) {
	return value
		.replace(/[^a-zA-Z ]/g, "")
		.trim()
		.toLowerCase();
}

/**
 * Returns an acronym for a given string.
 * @param value The string to get the acronym from.
 * @returns The acronym.
 */
export function getAcronym(value: string) {
	const words = normalizeName(value).split(" ");
	const first = words.at(0);
	const last = words.at(-1);

	if (!first || !last) {
		return "";
	}

	if (words.length === 1) {
		return first[0].toUpperCase();
	}

	const acronym = `${first[0]}${last[0]}`.toUpperCase();

	if (["CU"].includes(acronym)) {
		return first[0].toUpperCase();
	}

	return `${first[0]}${last[0]}`.toUpperCase();
}
