package com.tap;

import com.tap.common.FSImage;
import com.tap.security.Secured;
import jakarta.annotation.PostConstruct;
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@ApplicationPath("/api/v1")
@Secured
public class TAPApplication extends Application {
	@PostConstruct
	public static void initialize() throws IOException {

		String userImgPath = FSImage.getUserProfileImgPath();
		File f = new File(userImgPath);
		if (!f.exists())
			Files.createDirectories(Paths.get(FSImage.getUserProfileImgPath()));
	}
}