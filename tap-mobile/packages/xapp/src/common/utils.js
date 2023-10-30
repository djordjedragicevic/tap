import { Http } from "./Http";

export const emptyFn = function () { };

const getMinutesOfDay = (timeString) => {
	const t = timeString.split(":");
	return (parseInt(t[0]) * 60) + parseInt(t[1]);
};

export const calculateHeightFromDate = (startDate, endDate, coef = 1) => {
	const startTime = startDate.split('T')[1];
	const endTime = endDate.split('T')[1];
	return (getMinutesOfDay(endTime) * coef - getMinutesOfDay(startTime) * coef)
};

export const calculateTopFromDate = (startDate, offset = 0, coef = 1, fromDate, HOUR_HEIGHT = 60) => {
	const dateOffset = fromDate ? ((new Date(startDate).getDay() - fromDate.getDay()) * 24 * HOUR_HEIGHT * coef) : 0;
	return (getMinutesOfDay(startDate.split('T')[1]) * coef + offset) + dateOffset
};

export const getUserDisplayName = (user) => {
	return user.username || ((user.firstName || '') + ' ' + (user.lastName || ''));
};

export const formatTime = (date, loc) => {
	return date.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const measureDuration = (fn) => {
	fn();
}


export const DateUtils = {
	dateToString: (date) => {
		return date?.toISOString().split('T')[0];
	},
	dateToTimeString: (d, hour12 = true) => {
		return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12 });
	},
	stringToTimeString: (s) => {
		return DateUtils.dateToTimeString(new Date(s))
	},
	formatStringToDateTime: (dT, locale) => {
		const d = new Date(dT);
		return d.toLocaleDateString(locale, { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
	},
	getDayHours: (from, to) => {
		if (from == null)
			from = 0;

		if (to == null)
			to = from + 23;

		const resp = [];
		const hourCount = to - from;
		let idx = from;

		if (hourCount > 0) {
			for (let i = 0; i <= hourCount; i++) {
				if (idx > 24)
					idx = 0;
				resp.push((idx < 10 ? '0' : '') + idx + ":00")

				idx++
			}

		}
		return resp;
	},
	WEEK_DAY: ["Monday", "Tuesday", "Wednsday", "Thursday", "Friday", "Saturday", "Sunday"]
};

export const CurrencyUtils = {
	convert: (v) => {
		return v + ' KM';
	}
}

export const findFirstUpperLetter = (text) => {
	for (let i = 0, s = text.length; i < s; i++)
		if (text[i] === text[i].toUpperCase())
			return text[i];
}

export const getInitials = (fN, lN, uN, email) => {
	let initials = '';
	if (fN) {
		initials = fN.trim()[0];
		if (lN)
			initials += lN.trim()[0];
	}
	else if (uN) {
		uN = uN.trim();
		initials = uN[0];

		const secondLetter = findFirstUpperLetter(uN.substring(1));
		if (secondLetter) {
			initials += secondLetter;
		}
		else {
			let secondIdx = uN.indexOf(/[0-9]/, 1);
			if (secondIdx > -1)
				initials += uN[secondIdx];
			else if (uN.indexOf(' ') > -1)
				initials += uN[uN.indexOf(' ') + 1].toUpperCase();
		}
	}
	else if (email)
		initials = email[0];

	return initials.toUpperCase();
}