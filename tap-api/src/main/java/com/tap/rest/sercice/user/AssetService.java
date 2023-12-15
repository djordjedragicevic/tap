package com.tap.rest.sercice.user;

import com.tap.common.FSAsset;
import com.tap.security.Public;
import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("asset")
@RequestScoped
public class AssetService {
	@GET
	@Path("download")
	@Public
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response getImage(@QueryParam("lct") String location) {
		return FSAsset.readFile(location).build();
	}
}
