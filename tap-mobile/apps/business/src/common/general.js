export const STATUS = {
	WAITING: 'WAITING',
	ACCEPTED: 'ACCEPTED',
	REJECTED: 'REJECTED',
	CANCELED: 'CANCELED'
};

export const PERIOD = {
	CLOSE_APPOINTMENT: 'CLOSE_APPOINTMENT',
	CLOSE_APPOINTMENT_BY_PROVIDER: 'CLOSE_APPOINTMENT_BY_PROVIDER',
	CLOSE_EMPLOYEE_BREAK: 'CLOSE_EMPLOYEE_BREAK',
	CLOSE_PROVIDER_BREAK: 'CLOSE_PROVIDER_BREAK',
};

export const PERIOD_NAME = {
	CLOSE_APPOINTMENT: 'Appintment',
	CLOSE_APPOINTMENT_BY_PROVIDER: 'Appintment',
	CLOSE_EMPLOYEE_BREAK: 'Break',
	CLOSE_PROVIDER_BREAK: 'Break',
};

export const isWaitingAppointment = (item) => {
	return item?.name === PERIOD.CLOSE_APPOINTMENT && item?.data.status === STATUS.WAITING;
};

export const getFrendlyName = (item) => {
	if (item?.name === PERIOD.CLOSE_APPOINTMENT)
		if (item.userId)
			return 'Appointment';
		else
			return 'Appointment - manually entered';
	else if (item?.name === PERIOD.CLOSE_EMPLOYEE_BREAK || item?.name === PERIOD.CLOSE_PROVIDER_BREAK)
		return 'Break';
	else
		return 'Reserved period';
};