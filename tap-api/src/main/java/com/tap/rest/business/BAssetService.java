package com.tap.rest.business;

import com.tap.common.FSAsset;
import com.tap.security.Public;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("business/asset")
public class BAssetService {
	@GET
	@Path("download")
	@Public
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response getImage(@QueryParam("lct") String location) {
		return FSAsset.readFile(location).build();
	}
}
