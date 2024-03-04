package com.tap.rest.dtor;

public record ChangePassword(String oldPassword, String newPassword, String repeatPassword) {
}
