export const emptyFn = function () { };

export const getTimeMOD = (timeString) => {
	const t = timeString.split(":");
	return (parseInt(t[0]) * 60) + parseInt(t[1]);
};

export const calculateHeightDate = (startDate, endDate, coef = 1) => {
	return calculateHeightTime(startDate.split('T')[1], endDate.split('T')[1], coef);
};

export const calculateHeightTime = (startTime, endTime, coef = 1) => {
	return (getTimeMOD(endTime) - getTimeMOD(startTime)) * coef;
};

export const calculateTopDate = (startDate, offset = 0, coef = 1, fromDate) => {
	const dateOffset = fromDate ? ((new Date(startDate).getDay() - fromDate.getDay()) * 24 * 60 * coef) : 0;
	return calculateTopTime(startDate.split('T')[1], offset, coef) + dateOffset;
};
export const calculateTopTime = (startTime, offset = 0, coef = 1) => {
	return (getTimeMOD(startTime) - offset) * coef;
};

export const getUserDisplayName = (user) => {
	return user.username || ((user.firstName || '') + (user.lastName || ''));
};

export const formatTime = (date, loc) => {
	return date.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit', hour12: false });
};