package com.fitfusion.customer.exceptions;

import com.fitfusion.customer.dtos.CustomerResponseDto;

public class InvalidCredentialsException extends RuntimeException {
	public InvalidCredentialsException(String message) {
		super(message);
	}
}
