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

export const calculateTopDate = (startDate, offset = 0, coef = 1) => {
	return calculateTopTime(startDate.split('T')[1], offset, coef);
};
export const calculateTopTime = (startTime, offset = 0, coef = 1) => {
	return (getTimeMOD(startTime) - offset) * coef;
};

export const getUserDisplayName = (user) => {
	return user.username || ((user.firstName || '') + (user.lastName || ''));
};