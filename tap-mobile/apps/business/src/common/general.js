export const STATUS = {
	WAITING: 'WAITING',
	ACCEPTED: 'ACCEPTED',
	REJECTED: 'REJECTED',
	CANCELED: 'CANCELED'
};

export const PERIOD = {
	APP_BY_USER: 'APP_BY_USER',
	APP_BY_PROVIDER: 'APP_BY_PROVIDER',
	WI_PROVIDER_WORK: 'WI_PROVIDER_WORK',
	WI_EMPLOYEE_WORK: 'WI_EMPLOYEE_WORK',
	WI_PROVIDER_BREAK: 'WI_PROVIDER_BREAK',
	WI_EMPLOYEE_BREAK: 'WI_EMPLOYEE_BREAK',
	C_LOCK_TIME: 'C_LOCK_TIME',
	C_DAY_OFF: 'C_DAY_OFF',
	V_FREE_TIME: 'V_FREE_TIME'

};

export const P_TYPE = {
	CUSTOM: 'C_',
	APP: 'A_',
	WORK: 'W_'
}

export const PERIOD_NAME = {
	CLOSE_APPOINTMENT: 'Appintment',
	CLOSE_APPOINTMENT_BY_PROVIDER: 'Appintment',
	CLOSE_EMPLOYEE_BREAK: 'Break',
	CLOSE_PROVIDER_BREAK: 'Break',
};

export const isWaitingAppointment = (item) => {
	return item?.name === PERIOD.APP_BY_USER && item?.data.status === STATUS.WAITING;
};

export const getFrendlyName = (item) => {
	if (item?.id.startsWith('APP_'))
		if (item.userId)
			return 'Appointment';
		else
			return 'Appointment - manually entered';
	else if (item?.name === PERIOD.WI_EMPLOYEE_BREAK || item?.name === PERIOD.WI_PROVIDER_BREAK)
		return 'Break';
	else
		return 'Reserved time';
};

export const isCustomPeriod = (item) => {
	return item?.id.startsWith(P_TYPE.CUSTOM);
}

export const ROLE = {
	PROVIDER_OWNER: 'PROVIDER_OWNER',
	EMPLOYER: 'EMPLOYEE'
}