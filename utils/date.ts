import { DateTime } from "luxon";

export const getChatRelativeTime = (ISODate: string) => {
	const date = DateTime.fromISO(ISODate);
	const diff = Math.abs(date.diffNow("days").toObject().days ?? 0);

	if (diff > 2) {
		return date.toFormat("dd/MM/yyyy");
	}

	return date.toRelative({ locale: "pt-br" });
};

export const formatRawStringDate = (rawDate: string) => {
	const day = rawDate.slice(0, 2);
	const month = rawDate.slice(2, 4);
	const year = rawDate.slice(4);

	// Format the date as "DD/MM/YYYY"
	const formattedDate = `${year}-${month}-${day}`;

	return formattedDate;
};
