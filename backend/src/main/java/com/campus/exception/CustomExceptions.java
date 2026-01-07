package com.campus.exception;

public class CustomExceptions {
    
    public static class InvalidCredentialsException extends RuntimeException {
        public InvalidCredentialsException(String message) {
            super(message);
        }
    }
    
    public static class TokenExpiredException extends RuntimeException {
        public TokenExpiredException(String message) {
            super(message);
        }
    }
    
    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(String message) {
            super(message);
        }
    }
    
    public static class UnauthorizedException extends RuntimeException {
        public UnauthorizedException(String message) {
            super(message);
        }
    }
    
    public static class DuplicateEmailException extends RuntimeException {
        public DuplicateEmailException(String message) {
            super(message);
        }
    }
    
    public static class InvalidTokenException extends RuntimeException {
        public InvalidTokenException(String message) {
            super(message);
        }
    }
}
