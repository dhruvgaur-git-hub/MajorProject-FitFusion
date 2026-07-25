package com.backend.custom_exceptions;

public class ResourceAlreadyExistsException extends RuntimeException{
	public ResourceAlreadyExistsException(String msg) {
		super(msg);
	}
}
