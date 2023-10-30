package com.tap.common;

import org.eclipse.microprofile.config.ConfigProvider;

import java.io.*;

public class FSImage {
	private FSImage() {
	}

	private static final String USER_IMG_PREFIX = "profile_uid";

	public static String createUserProfileImage(InputStream is, String extension, int userId) throws IOException {

		String assetRoot = ConfigProvider.getConfig().getValue("tap.assets.root", String.class);
		String u = ConfigProvider.getConfig().getValue("tap.assets.user", String.class);

		String imgName = USER_IMG_PREFIX + userId + "." + extension;

		File f = new File(assetRoot + u, imgName);
		writeFile(is, f);

		return u + "/" + imgName;
	}

	public static String getUserProfileImgPath() {
		String p = ConfigProvider.getConfig().getValue("tap.assets.root", String.class);
		String u = ConfigProvider.getConfig().getValue("tap.assets.user", String.class);
		return p + u;
	}

	private static void writeFile(InputStream is, File f) throws IOException {
		try (FileOutputStream fos = new FileOutputStream(f)) {
			int tmpByte;
			byte[] bytes = new byte[1024];
			while ((tmpByte = is.read(bytes)) != -1)
				fos.write(bytes, 0, tmpByte);

			fos.flush();
		}
	}

}
