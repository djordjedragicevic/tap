package com.tap.appointments;

public record TimeDot(int timeInDay, byte type){
	public static final byte FREE_OPEN = 1;
	public static final byte FREE_CLOSE = 2;

	@Override
	public String toString() {
		return "TimeDot{" +
			   "timeInDay=" + timeInDay +
			   ", type=" + type +
			   '}';
	}
}
