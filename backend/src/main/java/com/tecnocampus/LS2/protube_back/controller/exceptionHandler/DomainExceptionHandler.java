package com.tecnocampus.LS2.protube_back.controller.exceptionHandler;

import com.tecnocampus.LS2.protube_back.services.exceptions.UserNotFoundException;
import com.tecnocampus.LS2.protube_back.services.exceptions.VideoNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.Instant;

@ControllerAdvice
public class DomainExceptionHandler{
    @ExceptionHandler(UserNotFoundException.class)
    @ResponseBody
    public ProblemDetail handleUserNotFoundException(UserNotFoundException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        pd.setTitle("User Not Found");
        pd.setProperty("timestamp", Instant.now());
        return pd;
    }

    @ExceptionHandler(VideoNotFoundException.class)
    @ResponseBody
    public ProblemDetail handleVideoNotFoundException(VideoNotFoundException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        pd.setTitle("Video Not Found");
        pd.setProperty("timestamp", Instant.now());
        return pd;
    }
}
