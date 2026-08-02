package com.fitfusion.userservice.exceptions;

public class RetailerNotApprovedException extends RuntimeException {
	public RetailerNotApprovedException(String message) {
		super(message);
	}
}
