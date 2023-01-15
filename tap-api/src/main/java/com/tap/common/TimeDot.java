package com.tap.common;

public record TimeDot(int timeInDay, byte type){
	public static final byte FREE_OPEN = 1;
	public static final byte FREE_CLOSE = 2;
}
