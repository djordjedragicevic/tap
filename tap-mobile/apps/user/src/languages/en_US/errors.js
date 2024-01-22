export const errors = {
	APPO_1: {
		title: 'Book appointment error',
		message: 'Requested time for appointment is not free anymore'
	},
	APPO_2: {
		title: 'Change appointment status error',
		message: 'It is not possible to change appointment status'
	},
	APPO_3: {
		title: 'Change appointment status error',
		message: 'Time to changing status has expired. The minimum time to change an status is {:min} minutes before the start of the appointment'
	},
	PROV_1: {
		title: 'Load provider error',
		message: 'It is not possible to load provider information'
	},
	U_CACC_1: {
		title: 'Create account error',
		message: 'Error appears while try to create account'
	},
	U_CACC_2: {
		title: 'Create account error',
		message: 'Email "{:email}" is already in use. Enter another email or use an existing account'
	},
	U_CACC_3: {
		title: 'Create account error',
		message: 'Username "{:username}" already exists. Must be unique'
	},
	U_EACC_1: {
		title: 'Edit account error',
		message: 'Error appears while try to create account'
	},
	U_VACC_1: {
		title: 'Verification error',
		message: 'Verification code is expired. Please press "Resend" to get new one'
	},
	U_VACC_2: {
		title: 'Verification error',
		message: 'Wrong verification code.'
	},
	U_UVFY_1: {
		title: 'Unverified account',
		message: 'Your account in not verified'
	}
}