package com.tap.exception;

public enum ErrID {
	TAP_0, //General error
	TAP_1, //Access denied
	APPO_1, //Book appointment
	APPO_2, //Change status
	APPO_3, //Change status, times up
	PROV_1,

	//Create/Edit account
	U_CACC_1,
	U_CACC_2,
	U_CACC_3,
	U_CACC_4,
	U_EACC_1,
	U_VACC_1,
	U_VACC_2,
	U_UVFY_1,

	//Login
	SIGN_IN_1,

	//Invalid data
	INV_EMAIL_1,

	U_APP_ST_1, //Change appointment status
	UCP_1, //Change password


	//Accept appointment
	B_APP_ST_1,
	B_APP_ST_2,
	B_APP_1,//Create custom appoint
	B_APP_2, //Create custom time period
	B_TP //Invalid time period

}
