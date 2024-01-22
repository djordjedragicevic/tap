package com.tap.common;

import java.util.Map;

public interface Statics {
	public static final String AT_PROVIDER_IMG = "PROVIDER_IMG";
	public static final String AT_EMPLOYEE_IMG = "EMPLOYEE_IMG";
	public static final String AT_USER_IMG = "USER_IMG";

	public static final String OPEN_PROVIDER_WORK = "OPEN_PROVIDER_WORK";
	public static final String OPEN_EMPLOYEE_WORK = "OPEN_EMPLOYEE_WORK";
//	public static final String OPEN_PROVIDER_WORK = "OPEN_PROVIDER_WORK";
//	public static final String OPEN_PROVIDER_WORK = "OPEN_PROVIDER_WORK";
//	public static final String OPEN_PROVIDER_WORK = "OPEN_PROVIDER_WORK";

	public static final String PT_CLOSE_LOCK_TIME = "CLOSE_LOCK_TIME";
	public static final String PT_CLOSE_OTHER = "CLOSE_OTHER";


	String A_STATUS_WAITING = "WAITING";
	String A_STATUS_ACCEPTED = "ACCEPTED";
	String A_STATUS_REJECTED = "REJECTED";
	String A_STATUS_CANCELED = "CANCELED";
	String A_STATUS_DROPPED = "DROPPED";

	String PT_APP_BY_USER = "APP_BY_USER";
	String PT_APP_BY_PROVIDER = "APP_BY_PROVIDER";
	String PT_WI_PROVIDER_WORK = "WI_PROVIDER_WORK";
	String PT_WI_EMPLOYEE_WORK = "WI_EMPLOYEE_WORK";
	String PT_WI_PROVIDER_BREAK = "WI_PROVIDER_BREAK";
	String PT_WI_EMPLOYEE_BREAK = "WI_EMPLOYEE_BREAK";
	String PT_C_LOCK_TIME = "CP_LOCK_TIME";
	String PT_C_DAY_OFF = "CP_DAY_OFF";
	String PTV_FREE_TIME = "V_FREE_TIME";
	Map<String, String> PT_SHORT = Map.of(
			Statics.PT_APP_BY_USER, "A_BU",
			Statics.PT_APP_BY_PROVIDER, "A_BP",
			Statics.PT_WI_EMPLOYEE_BREAK, "W_EB",
			Statics.PT_WI_EMPLOYEE_WORK, "W_EW",
			Statics.PT_WI_PROVIDER_BREAK, "W_PB",
			Statics.PT_WI_PROVIDER_WORK, "W_PW",
			Statics.PT_C_DAY_OFF, "C_DO",
			Statics.PT_C_LOCK_TIME, "C_LT",
			Statics.PTV_FREE_TIME, "V_FT"
	);


}
