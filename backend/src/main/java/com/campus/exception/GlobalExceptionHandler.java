package com.campus.exception;

import com.campus.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(CustomExceptions.InvalidCredentialsException.class)
    public ResponseEntity<ApiResponse> handleInvalidCredentials(CustomExceptions.InvalidCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, ex.getMessage()));
    }
    
    @ExceptionHandler(CustomExceptions.TokenExpiredException.class)
    public ResponseEntity<ApiResponse> handleTokenExpired(CustomExceptions.TokenExpiredException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, ex.getMessage()));
    }
    
    @ExceptionHandler(CustomExceptions.UserNotFoundException.class)
    public ResponseEntity<ApiResponse> handleUserNotFound(CustomExceptions.UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, ex.getMessage()));
    }
    
    @ExceptionHandler(CustomExceptions.UnauthorizedException.class)
    public ResponseEntity<ApiResponse> handleUnauthorized(CustomExceptions.UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ApiResponse(false, ex.getMessage()));
    }
    
    @ExceptionHandler(CustomExceptions.DuplicateEmailException.class)
    public ResponseEntity<ApiResponse> handleDuplicateEmail(CustomExceptions.DuplicateEmailException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiResponse(false, ex.getMessage()));
    }
    
    @ExceptionHandler(CustomExceptions.InvalidTokenException.class)
    public ResponseEntity<ApiResponse> handleInvalidToken(CustomExceptions.InvalidTokenException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, ex.getMessage()));
    }
    
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, "Invalid email or password"));
    }
    
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse> handleUsernameNotFound(UsernameNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, ex.getMessage()));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, "Validation failed", errors));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGenericException(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "An error occurred: " + ex.getMessage()));
    }
}
