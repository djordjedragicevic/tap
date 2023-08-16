package com.tap.common;

import java.time.LocalTime;

public class TimeDotClose extends TimeDot {
	public TimeDotClose(LocalTime time) {
		super(time, TimeDot.CLOSE);
	}
}
