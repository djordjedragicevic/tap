package com.tap.common;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.stream.Stream;

public class Mail {
	private static final String MAIL_SUBJECT = "TAP - Verification mail";
	private static final String MAIL_SENDER_USER = "djordje.dragicevic";
	private static final String MAIL_SENDER_PASS = "dhnqvkjowrootkvl";
	private static final String CODE_HTML = """
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
			""";

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
		String content = String.format(CODE_HTML, formattedCode);

		try {
			MimeMessage message = new MimeMessage(session);

			message.setFrom(new InternetAddress(from));
			message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
			message.setSubject(MAIL_SUBJECT);
			message.setContent(content, "text/html");

			Transport.send(message);

		} catch (MessagingException mex) {
			mex.printStackTrace();
		}
	}

}
