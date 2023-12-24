import I18nT from "../i18n/i18n";


export const emptyFn = function () { };

export const getUserDisplayName = (user) => {
	return user.username || ((user.firstName || '') + ' ' + (user.lastName || ''));
};

export const DateUtils = {
	hoursDiff: (start, end) => {
		if (end < start)
			return (24 - start) + end;
		else
			return end - start;

	},
	timesDiff: (from, to) => {
		const diff = DateUtils.getMinutesOfDay(to) - DateUtils.getMinutesOfDay(from);
		return DateUtils.minToHMin(diff);
	},
	getMinutesOfDay: (timeString) => {
		const t = timeString.split(":");
		return (parseInt(t[0]) * 60) + parseInt(t[1]);
	},
	timeDuration: (startTime, endTime) => {
		return (DateUtils.getMinutesOfDay(endTime) - DateUtils.getMinutesOfDay(startTime))
	},

	getDayHours: (from = 0, to = 23) => {
		let tmp = from;
		const resp = [];

		while (tmp !== to) {
			resp.push((tmp < 10 ? '0' : '') + tmp + ":00")
			if (tmp < 23)
				tmp += 1;
			else
				tmp = 0;
		}
		resp.push((to < 10 ? '0' : '') + to + ":00");

		return resp;
	},
	dateToString: (date = new Date()) => {
		return `${date.getFullYear()}-${(date.getMonth() + 1).toLocaleString(undefined, { minimumIntegerDigits: 2 })}-${date.getDate().toLocaleString(undefined, { minimumIntegerDigits: 2 })}T${date.getHours().toLocaleString(undefined, { minimumIntegerDigits: 2 })}:${date.getMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2 })}:${date.getSeconds().toLocaleString(undefined, { minimumIntegerDigits: 2 })}`;
	},
	roundTo30Min: (date = new Date()) => {
		const dateOff = new Date(date.getTime() + (1000 * 60 * 5));
		const min = dateOff.getMinutes();
		let newDate;

		if (min > 1 && min < 15) {
			dateOff.setMinutes(15);
			dateOff.setMilliseconds(0);
			return dateOff;
		}
		else if (min > 15 && min < 30) {
			dateOff.setMinutes(30);
			dateOff.setMilliseconds(0);
			return dateOff;
		}
		else if (min > 30 && min < 45) {
			dateOff.setMinutes(45);
			dateOff.setMilliseconds(0);
			return dateOff;
		}
		else if (min > 45) {
			newDate = new Date(dateOff.getTime() + (1000 * 60 * 60));
			newDate.setMinutes(0);
			newDate.setMilliseconds(0);
			return newDate;
		}
		return date;

	},
	convertToParam: (date) => {
		return {
			y: date.getFullYear(),
			m: date.getMonth() + 1,
			d: date.getDate(),
			h: date.getHours(),
			min: date.getMinutes()
		};
	},
	isTimeBefore: (time1, time2) => {
		const t1 = time1.split(':');
		const t2 = time2.split(':');
		const h1 = parseInt(t1[0]);
		const h2 = parseInt(t2[0]);
		const m1 = parseInt(t1[1]);
		const m2 = parseInt(t2[1]);

		return h1 < h2 || (h1 === h2 && m1 < m2)
	},
	formatToHourMin(time) {
		const splited = time.split(':');
		console.log(splited)
		return (parseInt(splited[0]) > 0 ? (splited[0] + I18nT.t('h') + ':') : '') + splited[1] + I18nT.t('min');
	},
	minToHMin(minutes) {
		return Math.floor(minutes / 60) + ':' + (minutes % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
	},
	WEEK_DAY: ["Monday", "Tuesday", "Wednsday", "Thursday", "Friday", "Saturday", "Sunday"],
};

export const CurrencyUtils = {
	convert: (v) => {
		return (v ?? ' - ') + ' KM';
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