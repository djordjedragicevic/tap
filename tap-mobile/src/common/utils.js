import { HOUR_HEIGHT } from "./general";

export const emptyFn = function () { };

const getTimeMOD = (timeString) => {
	const t = timeString.split(":");
	return (parseInt(t[0]) * HOUR_HEIGHT) + parseInt(t[1]);
};

export const calculateHeightFromDate = (startDate, endDate, coef = 1) => {
	const startTime = startDate.split('T')[1];
	const endTime = endDate.split('T')[1];
	return (getTimeMOD(endTime) * coef - getTimeMOD(startTime) * coef)
};

export const calculateTopFromDate = (startDate, offset = 0, coef = 1, fromDate) => {
	const dateOffset = fromDate ? ((new Date(startDate).getDay() - fromDate.getDay()) * 24 * HOUR_HEIGHT * coef) : 0;
	return (getTimeMOD(startDate.split('T')[1]) * coef + offset) + dateOffset
};

export const getUserDisplayName = (user) => {
	return user.username || ((user.firstName || '') + (user.lastName || ''));
};

export const formatTime = (date, loc) => {
	return date.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const measureDuration = (fn) => {
	const start = new Date().getTime();
	fn();
}


export const DateUtils = {
	dateToString: (date) => {
		return date?.toISOString().split('T')[0];
	},
	dateToTimeString: (d) => {
		return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
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
	}
}