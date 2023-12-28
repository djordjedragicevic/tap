package com.tap.common;

import java.util.Arrays;
import java.util.List;

public class JoinId {
	private final String original;
	private final List<Integer> services;
	private final long epochSeconds;
	private final int providerId;

	public JoinId(String original) {
		this.original = original;
		String[] split1 = original.split("S");
		this.epochSeconds = Long.parseLong(split1[0]);

		String[] split2 = split1[1].split("P");
		this.providerId = Integer.parseInt(split2[1]);

		String[] split3 = split2[0].split("_");
		this.services = Arrays.stream(split3).mapToInt(Integer::parseInt).boxed().toList();

	}

	public String getOriginal() {
		return original;
	}

	public List<Integer> getServices() {
		return services;
	}

	public long getEpochSeconds() {
		return epochSeconds;
	}

	public int getProviderId() {
		return providerId;
	}
}
