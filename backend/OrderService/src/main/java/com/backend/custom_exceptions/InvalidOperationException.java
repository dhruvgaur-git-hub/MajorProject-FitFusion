package com.backend.custom_exceptions;

public class InvalidOperationException extends RuntimeException {

	public InvalidOperationException(String message) {
		super(message);
	}

}
