package com.tap.appointments;

import com.tap.common.TimeDot;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class Timeline {
	private final List<TimeDot> timeDots = new ArrayList<>();

	public Timeline addDot(TimeDot timeDot) {
		this.timeDots.add(timeDot);
		return this;
	}

	public void sort() {
		this.timeDots.sort(Comparator.comparing(TimeDot::getTime));
	}

}
