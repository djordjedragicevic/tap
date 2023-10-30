package com.tap;

import com.tap.common.FSAsset;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.security.Secured;
import jakarta.annotation.PostConstruct;
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@ApplicationPath("/api/v1")
@Secured
public class TAPApplication extends Application {
	@PostConstruct
	public static void initialize() {
		try {
			Files.createDirectories(Paths.get(FSAsset.getAssetRoot() + FSAsset.USER_IMG_ROOT));
			Files.createDirectories(Paths.get(FSAsset.getAssetRoot() + FSAsset.PROVIDER_IMG_MAIN));
		} catch (IOException e) {
			throw new TAPException(ErrID.TAP_0);
		}

	}
}