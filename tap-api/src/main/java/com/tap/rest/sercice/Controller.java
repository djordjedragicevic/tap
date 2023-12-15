package com.tap.rest.sercice;

import com.tap.rest.entity.Employee;
import com.tap.rest.entity.Token;
import com.tap.rest.entity.TokenStatus;
import com.tap.rest.entity.User;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.rest.repository.UserRepository;
import com.tap.security.Credentials;
import com.tap.security.Role;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@ApplicationScoped
public class Controller {
	private UserRepository userRepository;

	public Controller() {

	}

	@Inject
	public Controller(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public String login(Credentials credentials, String bearer, List<com.tap.security.Role> compatibleRoles) throws TAPException {
		//Invalid credentials
		if (!credentials.isValid())
			throw new TAPException(ErrID.SIGN_IN_1);

		//Get user by credentials
		Optional<User> user = userRepository.getUserByCredentials(credentials.getUsername(), credentials.getPassword());
		if (user.isEmpty())
			throw new TAPException(ErrID.SIGN_IN_1);

		//User exist but is not verified
		User u = user.get();
		if (u.getVerified() != 1)
			throw new TAPException(ErrID.U_UVFY_1);

		int userId = u.getId();
		List<String> roles = userRepository.getRoleNames(userId);

		//Check does user has valid role
		boolean roleCompatible = false;
		for (com.tap.security.Role r : compatibleRoles) {
			if (roles.contains(r.getName())) {
				roleCompatible = true;
				break;
			}
		}
		if (!roleCompatible)
			throw new TAPException(ErrID.SIGN_IN_1);

		//Check does user already has token in db, and replace it if so
		//TODO What to do if token exist but status is e.g WAITING_VALIDATION
		com.tap.rest.entity.Token tokenRec;
		try {
			long rid = new com.tap.security.Token(bearer).validate().getRid();
			Optional<com.tap.rest.entity.Token> currToken = userRepository.getEntity(com.tap.rest.entity.Token.class, rid);
			tokenRec = currToken.orElse(null);
		} catch (Exception e) {
			tokenRec = null;
		}

		//If there is no token in DB, create new record
		if (tokenRec == null) {
			Token t = new Token();
			TokenStatus tS = userRepository.getSingleEntityBy(TokenStatus.class, Map.of("name", "VALID"));
			t.setUser(u);
			t.setTokenstatus(tS);
			userRepository.getEntityManager().persist(t);
			userRepository.getEntityManager().flush();
			tokenRec = t;
		}

		//Generate new token, and save in DB
		try {
			com.tap.security.Token newToken;
			//Business app
			if (compatibleRoles.contains(Role.PROVIDER_OWNER) || compatibleRoles.contains(Role.EMPLOYEE)) {
				Employee e = userRepository.getSingleEntityBy(Employee.class, Map.of("user.id", userId));
				newToken = new com.tap.security.Token(userId, roles, tokenRec.getId(), e.getProvider().getId(), e.getId());
			}
			//User app
			else {
				newToken = new com.tap.security.Token(userId, roles, tokenRec.getId());
			}

			String token = newToken.generate();
			tokenRec.setJti(newToken.getJti());
			tokenRec.setToken(token);
			return token;

		} catch (Exception e) {
			throw new TAPException(ErrID.SIGN_IN_1);
		}
	}

	public void logout(com.tap.security.Token t) {
		Optional<Token> token = userRepository.getSingleEntityBy(Token.class, "jti", t.getJti());
		token.ifPresent(value -> userRepository.getEntityManager().remove(value));
	}


}
