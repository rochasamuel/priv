import { DateTime } from "luxon";

export const getChatRelativeDate = (ISODate: string) => {
	const date = DateTime.fromISO(ISODate);
	const diff = Math.abs(date.diffNow("days").toObject().days ?? 0);

	if (diff > 2) {
		return date.toFormat("dd/MM/yyyy");
	}

	return date.toRelative({ locale: "pt-br" });
};

export const getChatMessageRelativeTime = (ISODate: string) => {
	const date = DateTime.fromISO(ISODate);
	const diffDays = Math.abs(date.diffNow("days").toObject().days ?? 0);
	const diffSeconds = Math.abs(date.diffNow("seconds").toObject().seconds ?? 0);

	if (diffDays > 2) {
		return date.toFormat("dd/MM/yyyy HH:mm");
	}

	if (diffSeconds <= 60) {
		return "Agora";
	}

	return date.toRelative({ locale: "pt-br" });
};

export const formatRawStringDate = (rawDate: string) => {
	const parsedDate = DateTime.fromFormat(rawDate, "ddMMyyyy").toFormat("yyyy-MM-dd");
	return parsedDate;
};
