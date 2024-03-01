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
	const parsedDate = DateTime.fromFormat(rawDate, "ddMMyyyy").toFormat("yyyy-MM-dd");
	return parsedDate;
};
