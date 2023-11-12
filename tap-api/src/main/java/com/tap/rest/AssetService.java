package com.tap.rest;

import com.tap.common.FSAsset;
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

		return FSAsset.readFile(location).build();

	}
}
