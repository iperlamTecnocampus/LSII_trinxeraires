package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.controller.exceptionHandler.DomainExceptionHandler;
import com.tecnocampus.LS2.protube_back.services.exceptions.UserAlreadyExistsException;
import com.tecnocampus.LS2.protube_back.services.exceptions.UserNotFoundException;
import com.tecnocampus.LS2.protube_back.services.exceptions.VideoNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DomainExceptionHandlerTest {
    private final DomainExceptionHandler handler = new DomainExceptionHandler();

    @Test
    void mapsNotFoundAndConflictExceptionsToProblemDetails() {
        ProblemDetail userNotFound = handler.handleUserNotFoundException(new UserNotFoundException("missing user"));
        ProblemDetail videoNotFound = handler.handleVideoNotFoundException(new VideoNotFoundException("missing video"));
        ProblemDetail userConflict = handler.handleUserAlreadyExistsException(
                new UserAlreadyExistsException("duplicate user"));

        assertEquals(HttpStatus.NOT_FOUND.value(), userNotFound.getStatus());
        assertEquals("User Not Found", userNotFound.getTitle());
        assertEquals("missing user", userNotFound.getDetail());
        assertEquals(HttpStatus.NOT_FOUND.value(), videoNotFound.getStatus());
        assertEquals("Video Not Found", videoNotFound.getTitle());
        assertEquals(HttpStatus.CONFLICT.value(), userConflict.getStatus());
        assertEquals("User Already Exists", userConflict.getTitle());
    }

    @Test
    void mapsIllegalArgumentsToBadRequest() {
        ProblemDetail result = handler.handleIllegalArgumentException(new IllegalArgumentException("invalid"));

        assertEquals(HttpStatus.BAD_REQUEST.value(), result.getStatus());
        assertEquals("Bad Request", result.getTitle());
        assertEquals("invalid", result.getDetail());
    }
}
