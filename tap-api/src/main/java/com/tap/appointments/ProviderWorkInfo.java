package com.tap.appointments;

import com.tap.common.*;
import com.tap.rest.dto.EmployeeDto;
import com.tap.rest.dtor.AppointmentDtoSimple;
import com.tap.rest.entity.CustomPeriod;
import com.tap.rest.entity.PeriodType;
import com.tap.rest.entity.Provider;
import com.tap.rest.entity.WorkInfo;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

public class ProviderWorkInfo {
	public static class Employee {
		public Integer employeeId;
		public String name;
		public String imagePath;
		public List<TimePeriod> workPeriods;
		public List<TimePeriod> breakPeriods;
		public List<TimePeriod> timeline;
		public List<TimePeriod> freePeriods;
		public Integer freeTimeSum;

		public Employee() {
			workPeriods = new ArrayList<>();
			breakPeriods = new ArrayList<>();
			timeline = new ArrayList<>();
		}

		public Employee(EmployeeDto eDto) {
			this();
			this.employeeId = eDto.getId();
			this.name = eDto.getName();
			this.imagePath = eDto.getImagePath();
		}

		public Employee(com.tap.rest.entity.Employee eEnt) {
			this();
			this.employeeId = eEnt.getId();
			this.name = eEnt.getName();
			this.imagePath = eEnt.getImagePath();
		}
	}

	private final Integer providerId;
	private String providerName;
	private String providerType;
	private String providerAddress;
	private String providerCity;
	private Boolean isWorking;
	private List<TimePeriod> workPeriods;
	private List<TimePeriod> breakPeriods;
	private LocalDate atDay;
	private List<Employee> employees;
	private int freeTimeCount = 1;

	public ProviderWorkInfo(Integer providerId, LocalDate date) {
		this.providerId = providerId;
		this.isWorking = false;
		this.atDay = date;
		this.employees = new ArrayList<>();
		this.breakPeriods = new ArrayList<>();
		this.workPeriods = new ArrayList<>();
	}

	public ProviderWorkInfo(Integer providerId, LocalDate date, List<?> emps, List<AppointmentDtoSimple> apps, List<CustomPeriod> bps, List<WorkInfo> wps) {
		this.providerId = providerId;
		this.isWorking = false;
		this.atDay = date;
		this.employees = new ArrayList<>();
		this.breakPeriods = new ArrayList<>();
		this.workPeriods = new ArrayList<>();
		this.setEmployees(new ArrayList<>());
		this.setWorkPeriods(new ArrayList<>());
		this.fillData(emps, apps, bps, wps);
	}


	public void fillData(List<?> emps, List<AppointmentDtoSimple> apps, List<CustomPeriod> cps, List<WorkInfo> wis) {
		this.fillEmps(emps); //Must go first
		this.fillWorkInfoPeriods(wis);
		this.fillApps(apps);
		this.fillCustomPeriods(cps);
		this.sortPeriods();
	}

	public void generateFreePeriods(boolean addToTimeline) {

		for (Employee e : this.getEmployees()) {

			e.freePeriods = new ArrayList<>();
			List<TimeDot> timeDots = new ArrayList<>();

			e.workPeriods.forEach(tP -> {
				timeDots.add(new TimeDot(tP.getStart(), true, true));
				timeDots.add(new TimeDot(tP.getEnd(), false, true));
			});


			e.timeline.forEach(eTP -> {
				timeDots.add(new TimeDot(eTP.getStart(), true, false));
				timeDots.add(new TimeDot(eTP.getEnd(), false, false));
			});
			timeDots.sort(Comparator.comparing(TimeDot::getTime));

			//Calculate free periods
			int lockCounter = 0;
			LocalTime startOfFree = null;
			LocalTime endOfFree = null;

			System.out.println("-------------------");
			for (TimeDot dot : timeDots) {
				System.out.println("TIME DOT - " + dot.getTime() + " " + (dot.isStart() ? " START " : " END ") + (dot.isOpen() ? " OPEN " : " CLOSE "));
				if (dot.isOpen()) {
					if (dot.isStart()) {
						if (lockCounter > 0)
							lockCounter -= 1;
						if (lockCounter == 0) {
							startOfFree = dot.getTime();
						}
					} else {
						if (lockCounter == 0)
							endOfFree = dot.getTime();
						lockCounter += 1;
					}
				} else {
					if (dot.isStart()) {
						if (lockCounter == 0 && startOfFree != null)
							endOfFree = dot.getTime();
						lockCounter += 1;
					} else {
						lockCounter -= 1;
						if (lockCounter == 0)
							startOfFree = dot.getTime();
					}
				}

				if (startOfFree != null && endOfFree != null) {
					System.out.println("FREE TIME " + startOfFree + " " + endOfFree);
					e.freePeriods.add(new TimePeriodData(
							startOfFree,
							endOfFree,
							TimePeriodData.OPEN,
							TimePeriodData.FREE_TIME,
							Statics.PT_SHORT.get(Statics.PTV_FREE_TIME) + "#" + this.freeTimeCount++
					));
					startOfFree = null;
					endOfFree = null;
				}
			}

			e.freePeriods.sort(Comparator.comparing(TimePeriod::getStart));

			if (addToTimeline) {
				e.timeline.addAll(e.freePeriods);
				e.timeline.sort(Comparator.comparing(TimePeriod::getStart));
			}

			//Calculate free time sum
			long freeSum = e.freePeriods.stream().mapToLong(fP -> Duration.between(fP.getStart(), fP.getEnd()).toMinutes()).sum();
			e.freeTimeSum = (int) freeSum;
		}
	}

	private void fillEmps(List<?> emps) {

		emps.forEach(e -> {
					ProviderWorkInfo.Employee emp;
					if (e instanceof com.tap.rest.entity.Employee empEntity) {
						emp = new ProviderWorkInfo.Employee(empEntity);
					} else if (e instanceof EmployeeDto empDto) {
						emp = new ProviderWorkInfo.Employee(empDto);
					} else {
						throw new TAPException(ErrID.TAP_0);
					}

					this.getEmployees().add(emp);
				}
		);
	}

	private void fillApps(List<AppointmentDtoSimple> apps) {
		TimePeriod tmpTP;
		for (AppointmentDtoSimple a : apps) {
			tmpTP = Utils.adjustPeriodToOnaDate(this.getAtDay(), a.start(), a.end());
			this.getEmployeeById(a.eId())
					.timeline
					.add(new TimePeriodData(
							tmpTP.getStart(),
							tmpTP.getEnd(),
							TimePeriodData.CLOSE,
							a.typeName(),
							a.id(),
							a
					));
		}
	}

	private void fillCustomPeriods(List<CustomPeriod> cps) {
		TimePeriod tmpTP;
		TimePeriodData tmpTPD;
		boolean isProviderLevel;
		Map<String, Object> tmpData;
		for (CustomPeriod bP : cps) {
			isProviderLevel = bP.getEmployee() == null;
			tmpTP = bP.getRepeattype() != null ?
					Utils.adjustRepeatablePeriodToOnaDate(this.getAtDay(), bP.getStart(), bP.getEnd(), bP.getRepeattype().getName())
					:
					Utils.adjustPeriodToOnaDate(this.getAtDay(), bP.getStart(), bP.getEnd());

			tmpData = new HashMap<>();
			tmpData.put("id", bP.getId());
			tmpData.put("comment", bP.getComment());
			tmpData.put("periodType", bP.getPeriodtype().getName());

			tmpTPD = new TimePeriodData(
					tmpTP.getStart(),
					tmpTP.getEnd(),
					TimePeriodData.CLOSE,
					bP.getPeriodtype().getName(),
					bP.getId(),
					tmpData
			);
			if (isProviderLevel)
				for (ProviderWorkInfo.Employee e : this.getEmployees())
					e.timeline.add(tmpTPD);
			else
				this.getEmployeeById(bP.getEmployee().getId()).timeline.add(tmpTPD);
		}
	}

	private void fillWorkInfoPeriods(List<WorkInfo> wis) {
		boolean isProviderLevel;
		String pTName;

		Optional<WorkInfo> providerWI = wis.stream().filter(wI -> wI.getEmployee() == null).findFirst();
		if (providerWI.isEmpty()) {
			this.isWorking = false;
			return;
		} else {
			this.isWorking = true;
		}

		Provider p = providerWI.get().getProvider();
		this.setProviderName(p.getName());
		this.setProviderAddress(p.getAddress().getAddress1());
		this.setProviderCity(p.getAddress().getCity().getName());
		this.setProviderType(p.getProvidertype().getName());

		for (WorkInfo wI : wis) {
			isProviderLevel = wI.getEmployee() == null;
			pTName = wI.getPeriodtype().getName();

			//Breaks
			if (pTName.equals(Statics.PT_WI_PROVIDER_BREAK) || pTName.equals(Statics.PT_WI_EMPLOYEE_BREAK)) {
				if (isProviderLevel) {
					for (ProviderWorkInfo.Employee e : this.getEmployees()) {
						e.timeline.add(new TimePeriodData(
								wI.getStartTime(),
								wI.getEndTime(),
								TimePeriodData.CLOSE,
								pTName,
								Integer.toUnsignedLong(wI.getId())
						));
					}

					this.getBreakPeriods().add(new TimePeriod(wI.getStartTime(), wI.getEndTime()));

				} else {
					this.getEmployeeById(wI.getEmployee().getId())
							.timeline
							.add(new TimePeriodData(
									wI.getStartTime(),
									wI.getEndTime(),
									TimePeriodData.CLOSE,
									pTName,
									Integer.toUnsignedLong(wI.getId())
							));
				}
			}
			//Working time
			else {
				if (isProviderLevel) {
					this.getWorkPeriods().add(new TimePeriod(wI.getStartTime(), wI.getEndTime()));
				} else {
					this.getEmployeeById(wI.getEmployee().getId())
							.workPeriods
							.add(new TimePeriod(wI.getStartTime(), wI.getEndTime()));
				}
			}

		}
	}

	private void sortPeriods() {
		this.getWorkPeriods().sort(Comparator.comparing(TimePeriod::getStart));
		this.getEmployees().forEach(e -> e.timeline.sort(Comparator.comparing(TimePeriod::getStart)));
	}


	public Employee getEmployeeById(Integer id) {
		for (Employee e : this.getEmployees())
			if (e.employeeId.equals(id))
				return e;
		return null;
	}

	public Integer getProviderId() {
		return providerId;
	}

	public String getProviderName() {
		return providerName;
	}

	public ProviderWorkInfo setProviderName(String providerName) {
		this.providerName = providerName;
		return this;
	}

	public String getProviderType() {
		return providerType;
	}

	public ProviderWorkInfo setProviderType(String providerType) {
		this.providerType = providerType;
		return this;
	}

	public String getProviderAddress() {
		return providerAddress;
	}

	public ProviderWorkInfo setProviderAddress(String providerAddress) {
		this.providerAddress = providerAddress;
		return this;
	}

	public String getProviderCity() {
		return providerCity;
	}

	public ProviderWorkInfo setProviderCity(String providerCity) {
		this.providerCity = providerCity;
		return this;
	}

	public Boolean getWorking() {
		return isWorking;
	}

	public ProviderWorkInfo setWorking(Boolean working) {
		isWorking = working;
		return this;
	}

	public List<TimePeriod> getWorkPeriods() {
		return workPeriods;
	}

	public ProviderWorkInfo setWorkPeriods(List<TimePeriod> workPeriods) {
		this.workPeriods = workPeriods;
		return this;
	}

	public List<TimePeriod> getBreakPeriods() {
		return breakPeriods;
	}

	public ProviderWorkInfo setBreakPeriods(List<TimePeriod> breakPeriods) {
		this.breakPeriods = breakPeriods;
		return this;
	}

	public LocalDate getAtDay() {
		return atDay;
	}

	public ProviderWorkInfo setAtDay(LocalDate atDay) {
		this.atDay = atDay;
		return this;
	}

	public List<Employee> getEmployees() {
		return employees;
	}

	public ProviderWorkInfo setEmployees(List<Employee> employees) {
		this.employees = employees;
		return this;
	}
}
