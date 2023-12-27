package com.tap.common;


import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.rest.entity.CustomPeriod;
import com.tap.security.Role;
import com.tap.security.Security;
import jakarta.ws.rs.core.SecurityContext;
import org.eclipse.microprofile.config.ConfigProvider;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;

public class Validate {
	public static void checkIsEmpOwnerOfPeriod(CustomPeriod cP, SecurityContext sC) {
		if (cP.getEmployee().getId() != Security.getEmployeeId(sC))
			throw new TAPException(ErrID.TAP_1);
	}

	public static void checkIsEmpOwnerOfPeriod(int eId, SecurityContext sC) {
		if (eId != Security.getEmployeeId(sC))
			throw new TAPException(ErrID.TAP_1);
	}

	public static void checkProvEmpAccess(CustomPeriod cP, SecurityContext sC) {
		boolean isOwner = sC.isUserInRole(Role.PROVIDER_OWNER.getName());

		if (isOwner && cP.getProvider().getId() != Security.getProviderId(sC))
			throw new TAPException(ErrID.TAP_1);
		if (!isOwner && cP.getEmployee().getId() != Security.getEmployeeId(sC))
			throw new TAPException(ErrID.TAP_1);
	}

	public static void checkProvEmpAccess(int eId, SecurityContext sC) {
		boolean isOwner = sC.isUserInRole(Role.PROVIDER_OWNER.getName());

		if (isOwner && eId != Security.getProviderId(sC))
			throw new TAPException(ErrID.TAP_1);
		if (!isOwner && eId != Security.getEmployeeId(sC))
			throw new TAPException(ErrID.TAP_1);
	}

	public static void validateTimePeriod(LocalDateTime start, LocalDateTime end) {
		int dur = ConfigProvider.getConfig().getValue("tap.business.minimum.timeperiod.duration", Integer.class);
		if (ChronoUnit.MINUTES.between(start, end) < dur)
			throw new TAPException(ErrID.B_TP, null, Map.of("duration", String.valueOf(dur)));
	}

}
