package com.tap.security;

import com.tap.rest.common.CUtilRepository;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ResourceInfo;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthFilter implements ContainerRequestFilter {


	@Context
	ResourceInfo resourceInfo;

	@Inject
	CUtilRepository CUtilRepository;

	@Override
	public void filter(ContainerRequestContext requestContext) throws IOException {

		Secured secAnno = resourceInfo.getResourceMethod().isAnnotationPresent(Secured.class) ?
				resourceInfo.getResourceMethod().getAnnotation(Secured.class)
				:
				resourceInfo.getResourceClass().getAnnotation(Secured.class);

		//Resource is not public, do validation
		if (!(isPublic(resourceInfo, secAnno))) {

			String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

			try {
				//Authenticate
				Token t = new Token(authorizationHeader);

				if (!t.isValid() || !isValidOnDb(t)) {
					requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
					return;
				}

				//Authorize
				if (!authorize(t.getAud(), secAnno)){
					requestContext.abortWith(Response.status(Response.Status.FORBIDDEN).build());
					return;
				}

				requestContext.setSecurityContext(new TAPSecurityContext(t.getSub()));

			} catch (Exception e) {
				requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
			}
		}
	}

	private boolean authorize(List<String> userRoles, Secured secured) {
		if (userRoles != null && !userRoles.isEmpty() && secured != null) {
			Role[] roles = secured.value();
			if(roles.length == 0)
				return true;
			for (String userRole : userRoles) {
				if (userRole.equals(Role.SUPER_ADMIN.getName()))
					return true;

				for (Role role : roles) {
					if (userRole.equals(role.getName()))
						return true;
				}
			}
		}

		return false;
	}

	private boolean isPublic(ResourceInfo resInfo, Secured secAnno) {
		return secAnno == null && (resInfo.getResourceMethod().isAnnotationPresent(Public.class) || resInfo.getResourceClass().isAnnotationPresent(Public.class));
	}

	private boolean isValidOnDb(Token t) {
		Optional<com.tap.db.entity.Token> tokenRec = CUtilRepository.getEntity(com.tap.db.entity.Token.class, t.getRid());
		return tokenRec.isPresent() &&
			   tokenRec.get().getTokenstatus().getName().equals(Token.VALID) &&
			   tokenRec.get().getJti() != null &&
			   tokenRec.get().getJti().equals(t.getJti());
	}
}
