package com.tap.rest.user;

import com.tap.common.FSAsset;
import com.tap.security.Public;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("asset")
public class AssetRepository {
	@GET
	@Path("download")
	@Public
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response getImage(@QueryParam("lct") String location) {

		return FSAsset.readFile(location).build();

	}
}
