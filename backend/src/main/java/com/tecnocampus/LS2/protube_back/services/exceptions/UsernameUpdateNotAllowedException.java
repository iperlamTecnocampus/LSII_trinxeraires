package com.tecnocampus.LS2.protube_back.services.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UsernameUpdateNotAllowedException extends RuntimeException {
    public UsernameUpdateNotAllowedException(String message) {
        super(message);
    }
}