package com.tap.rest.user;

import com.tap.common.Util;
import com.tap.db.entity.User;
import com.tap.db.entity.UserVerification;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.ConfigProvider;

import java.time.LocalDateTime;
import java.util.Optional;

@RequestScoped
public class UserVerificationRepository {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	@Transactional
	public Optional<UserVerification> resendNewCode(Integer uId) {

		UserVerification verification = em
				.createQuery("SELECT v FROM UserVerification v WHERE v.user.id = :uId", UserVerification.class)
				.setParameter("uId", uId)
				.getSingleResult();

		if (verification.getUser().getVerified() == 0) {


			int codeLength = ConfigProvider.getConfig().getValue("tap.verification.code.length", Integer.class);
			String code = Util.generateVerificationCode(codeLength);

			long vCDuration = ConfigProvider.getConfig().getValue("tap.verification.code.duration", Long.class);
			LocalDateTime vCTime = LocalDateTime.now(Util.zone());
			LocalDateTime vCExpireTime = vCTime.plusMinutes(vCDuration);

			verification.setCode(code);
			verification.setCreateTime(vCTime);
			verification.setExpireTime(vCExpireTime);
			verification.setCodeVersion((byte) (verification.getCodeVersion() + 1));
			em.persist(verification);

			return Optional.of(verification);
		}

		return Optional.empty();
	}

	@Transactional
	public void verify(int uId, String code) {

		UserVerification verification = em
				.createQuery("SELECT v FROM UserVerification v WHERE v.user.id = :uId", UserVerification.class)
				.setParameter("uId", uId)
				.getSingleResult();

		User u = verification.getUser();

		if (u.getVerified() != 1) {
			LocalDateTime now = Util.zonedNow();
			LocalDateTime codeExpire = verification.getExpireTime();

			if (now.isAfter(codeExpire))
				throw new TAPException(ErrID.U_VACC_1);

			if (!code.isEmpty() && verification.getCode().equals(code)) {
				u.setVerified((byte) 1);
				u.setActive((byte) 1);
				verification.setValidateTime(Util.zonedNow());
				em.flush();
			} else
				throw new TAPException(ErrID.U_VACC_2);
		}
	}
}
