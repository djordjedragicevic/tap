package com.tap.common;

import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.ConfigProvider;

import java.io.*;

public class FSAsset {
	private FSAsset() {
	}

	public static final String USER_IMG_ROOT = "/images/user";
	public static final String PROVIDER_IMG_ROOT = "/images/provider";
	public static final String PROVIDER_IMG_MAIN = "/images/provider/main";
	private static final String USER_IMG_PREFIX = "profile_uid";


	public static String createUserProfileImage(InputStream is, String extension, int userId) throws IOException {

		String assetRoot = getAssetRoot();
		String imgName = USER_IMG_PREFIX + userId + "_" + System.currentTimeMillis() + "." + extension;

		File f = new File(assetRoot + USER_IMG_ROOT, imgName);
		writeFile(is, f);

		return USER_IMG_ROOT + "/" + imgName;
	}

	public static Response.ResponseBuilder readFile(String location){
		String assetRoot = ConfigProvider.getConfig().getValue("tap.assets.root", String.class);
		File f = new File(assetRoot + location);

		Response.ResponseBuilder response = Response.ok(f);

		response.header("Content-Disposition", "attachment; filename=\"" + f.getName() + "\"");
		response.header("Content-Type", "image/jpeg");
		response.header("Content-Length", String.valueOf(f.length()));

		return response;
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

	public static String getAssetRoot() {
		return ConfigProvider.getConfig().getValue("tap.assets.root", String.class);
	}

}
