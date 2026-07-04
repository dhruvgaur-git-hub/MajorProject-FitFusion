package com.backend.exception_handler;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.response.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<?> resourceNotFoundException(ResourceNotFoundException e) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(new ApiResponse("Failed", e.getMessage()));
	}
	
	@ExceptionHandler(DuplicateKeyException.class)
	public ResponseEntity<ApiResponse> handleDuplicateKeyException(DuplicateKeyException ex) {

	    return ResponseEntity
	            .status(HttpStatus.CONFLICT)
	            .body(new ApiResponse("FAILED", "Resource already exists"));
	}
}
