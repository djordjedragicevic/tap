package com.tap.common;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.util.*;
import java.util.stream.Stream;

public class Mail {
	private static final Map<Languages, String> SUBJECT = Map.of(
			Languages.EN_US, "TAP - Verification mail",
			Languages.SR_SP, "TAP - Verifikacioni mail"
	);
	private static final Map<Languages, String> CONTENT = Map.of(
			Languages.EN_US, """
					<!DOCTYPE html>
					<html lang="en">
					<head>
					<meta charset="UTF-8">
					<style>
					 h1 {color:#1E90FF;}
					</style>
					</head>
					<body>
					<p>Your verification code is: </p>
					<h1>%s</h1>
					<p>
					Enter it in the TAP verify email screen to create your account.<br>
					If you are not trying to create a TAP account, you may ignore this email.
					</p>
					</body>
					</html>
					""",
			Languages.SR_SP, """
					<!DOCTYPE html>
					<html lang="sr">
					<head>
					<meta charset="UTF-8">
					<style>
					 h1 {color:#1E90FF;}
					</style>
					</head>
					<body>
					<p>Vaš verifikacioni kod je: </p>
					<h1>%s</h1>
					<p>
					Da biste završili kreiranje TAP korisničkog naloga, unesite kod u dijelu aplikacije za verifikaciju emaila.<br><br>
					U suprotnom, možete da zanemarite ovaj email.
					</p>
					</body>
					</html>
					"""
	);
	private static final String MAIL_SENDER_USER = "djordje.dragicevic";
	private static final String MAIL_SENDER_PASS = "dhnqvkjowrootkvl";

	private Mail() {
	}

	public static void sendCode(String code, String to) {

		final String from = "djordje.dragicevic@yahoo.com";

		String host = "smtp.mail.yahoo.com";
		Properties properties = System.getProperties();

		properties.put("mail.smtp.host", host);
		properties.put("mail.smtp.port", "587");
		properties.put("mail.smtp.starttls.enable", "true");
		properties.put("mail.smtp.auth", "true");

		Session session = Session.getInstance(properties, new Authenticator() {
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(MAIL_SENDER_USER, MAIL_SENDER_PASS);
			}
		});

		List<String> codeList = new ArrayList<>();
		for (char c : code.toCharArray())
			codeList.add(String.valueOf(c));

		String formattedCode = String.join("&nbsp;", codeList);
		String content = String.format(CONTENT.get(Languages.SR_SP), formattedCode);

		try {
			MimeMessage message = new MimeMessage(session);

			message.setFrom(new InternetAddress(from));
			message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
			message.setSubject(SUBJECT.get(Languages.SR_SP), "UTF-8");
			message.setContent(content, "text/html; charset=UTF-8");

			Transport.send(message);

		} catch (MessagingException mex) {
			mex.printStackTrace();
		}
	}

}
