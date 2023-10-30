package com.tap.rest;

import com.tap.security.Public;
import com.tap.security.Secured;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.ConfigProvider;

import java.io.*;

@Path("asset")
public class AssetService {
	@GET
	@Path("download")
	@Public
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response getImage(@QueryParam("lct") String location) {
		System.out.println("USO JA" + " " + location);

		String assetRoot = ConfigProvider.getConfig().getValue("tap.assets.root", String.class);
		File f = new File(assetRoot + location);

		Response.ResponseBuilder response = Response.ok(f);


		System.out.println(f.getName() + " " + f.length());

		response.header("Content-Disposition", "attachment; filename=\"" + f.getName() + "\"");
		response.header("Content-Type", "image/jpeg");
		response.header("Content-Length", String.valueOf(f.length()));

		return response.build();

	}
}
