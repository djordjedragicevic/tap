package com.tap.appointments;

import com.tap.company.CompanyDAO;
import com.tap.db.dto.CompanyWorkDayDTO;
import com.tap.db.dto.EmployeeWorkDayDTO;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RequestScoped
public class AppointmentController {

	@Inject
	private CompanyDAO companyDAO;
	@Inject
	private AppointmentsDAO appointmentsDAO;

//	public AppointmentsResp getAppointments(long companyId, LocalDateTime dTFrom, LocalDateTime dTTo, int duration) {
//
//		LocalDate dFrom = LocalDate.from(dTFrom);
//		LocalDateTime startOfDay = dFrom.atStartOfDay();
//		int day = dTFrom.getDayOfWeek().getValue();
//
//		CompanyWorkDayDTO c = companyDAO.getCompanyWorkInfoAtDay(companyId, day);
//		List<AppointmentDTO> apps = appointmentsDAO.getAppointments(companyId, dTFrom, dTTo);
//		List<EmployeeWorkDayDTO> eWD = companyDAO.getEmployeesWorkInfoAtDay(companyId, day);
//		List<AppointmentsResp.EmployeePeriod> periods = new ArrayList<>();
//
//		System.out.println(apps.size());
//		//Arrange appointments by user
//		for (EmployeeWorkDayDTO e : eWD) {
//
//			List<AppointmentDTO> userApps = apps.stream().filter(a -> a.employeeId() == e.getUserId()).toList();
//
//			//Create BUSY TimePeriods
//			List<TimePeriod> timePeriods = new ArrayList<>(userApps.stream().map(a -> new TimePeriod(a.startTime(), a.endTime(), TimePeriod.BUSY, TimePeriod.BUSY_APPOINTMENT)).toList());
//
//			if (e.getBreakEnd().isAfter(e.getBreakStart()))
//				timePeriods.add(new TimePeriod(LocalDateTime.of(dFrom, e.getBreakStart()), LocalDateTime.of(dFrom, e.getBreakEnd()), TimePeriod.BUSY, TimePeriod.BUSY_BREAK));
//			else if (c.getBreakStart() != null && c.getBreakEnd() != null && c.getBreakEnd().isAfter(c.getBreakStart()))
//				timePeriods.add(new TimePeriod(LocalDateTime.of(dFrom, c.getBreakStart()), LocalDateTime.of(dFrom, c.getBreakEnd()), TimePeriod.BUSY, TimePeriod.BUSY_BREAK));
//
//			timePeriods.sort(Comparator.comparing(TimePeriod::getStart));
//
//			//Create TimeDots from TimePeriods
//			List<TimeDot> timeDots = new ArrayList<>();
//			timeDots.add(new TimeDot(c.getStart().get(ChronoField.MINUTE_OF_DAY), TimeDot.FREE_OPEN));
//			timePeriods.forEach(tP -> {
//				timeDots.add(new TimeDot(tP.getStart().get(ChronoField.MINUTE_OF_DAY), TimeDot.FREE_CLOSE));
//				timeDots.add(new TimeDot(tP.getEnd().get(ChronoField.MINUTE_OF_DAY), TimeDot.FREE_OPEN));
//			});
//			timeDots.add(new TimeDot(c.getEnd().get(ChronoField.MINUTE_OF_DAY), TimeDot.FREE_CLOSE));
//
//			int tmpFPStart = -1;
//			int closedDotCounter = 0;
//
//			//Analyze TimeDots and create FREE TimePeriods
//			for (TimeDot tD : timeDots) {
//				if (tD.type() == TimeDot.FREE_OPEN) {
//					if (closedDotCounter > 0)
//						closedDotCounter--;
//					if (closedDotCounter == 0)
//						tmpFPStart = tD.timeInDay();
//				} else if (tD.type() == TimeDot.FREE_CLOSE) {
//					if (closedDotCounter == 0 && tmpFPStart < tD.timeInDay()) {
//						if (duration > 0) {
//							int freeMinutes = tD.timeInDay() - tmpFPStart;
//							int freeApps = freeMinutes / duration;
//							for (int i = 0; i < freeApps; i++) {
//								timePeriods.add(
//										new TimePeriod(
//												startOfDay.plus(tmpFPStart + ((long) duration * i), ChronoUnit.MINUTES),
//												startOfDay.plus(tmpFPStart + ((long) duration * i) + duration, ChronoUnit.MINUTES),
//												TimePeriod.FREE,
//												TimePeriod.FREE_APPOINTMENT
//										));
//							}
//							if (freeMinutes % duration > 0) {
//								int restOfFree = freeMinutes - (freeApps * duration);
//								timePeriods.add(new TimePeriod(
//										startOfDay.plus(tmpFPStart + ((long) duration * freeApps), ChronoUnit.MINUTES),
//										startOfDay.plus(tmpFPStart + ((long) duration * freeApps) + restOfFree, ChronoUnit.MINUTES),
//										TimePeriod.FREE,
//										TimePeriod.FREE_PERIOD
//								));
//							}
//
//						} else {
//							timePeriods.add(new TimePeriod(
//									startOfDay.plus(tmpFPStart, ChronoUnit.MINUTES),
//									startOfDay.plus(tD.timeInDay(), ChronoUnit.MINUTES),
//									TimePeriod.FREE,
//									TimePeriod.FREE_PERIOD));
//						}
//					}
//					closedDotCounter++;
//				}
//			}
//			timePeriods.sort(Comparator.comparing(TimePeriod::getStart));
//
//			periods.add(new AppointmentsResp.EmployeePeriod(e, timePeriods));
//		}
//
//		return new AppointmentsResp(c, periods);
//	}


}
