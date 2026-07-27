package com.backend.exception_handler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.backend.custom_exceptions.BadRequestException;
import com.backend.custom_exceptions.ResourceAlreadyExistsException;
import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.response.ApiResponse;
import com.backend.service.CategoryServiceImpl;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<?> resourceNotFoundException(ResourceNotFoundException e) {
		
	    log.error("Resource not found: {}", e.getMessage());
		
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(new ApiResponse("Failed", e.getMessage()));
	}
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(code = HttpStatus.BAD_REQUEST)
	public Map<String,String> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {

		log.warn("Validation failed: {}", e.getBindingResult().getFieldErrors());
		
		List<FieldError> fieldErrors = e.getFieldErrors();
		Map<String,String> fieldErrMap=new HashMap<>();
		fieldErrors.forEach(fieldErr -> fieldErrMap.put(fieldErr.getField(), fieldErr.getDefaultMessage()));
		return fieldErrMap;
	}
	
	@ExceptionHandler(DuplicateKeyException.class)
	public ResponseEntity<ApiResponse> handleDuplicateKeyException(DuplicateKeyException ex) {
		
	    log.error("Duplicate Key Inserted: {}", ex.getMessage());

	    return ResponseEntity
	            .status(HttpStatus.CONFLICT)
	            .body(new ApiResponse("FAILED", "Resource already exists"));
	}
	
	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<ApiResponse> handleBadRequestException(
	        BadRequestException ex) {

	    return ResponseEntity
	    		.status(HttpStatus.BAD_REQUEST)
	    		.body(new ApiResponse("Failed", ex.getMessage()));
	}
	
	@ExceptionHandler(ResourceAlreadyExistsException.class)
	public ResponseEntity<ApiResponse> handleResourceAlreadyExistsException(
			ResourceAlreadyExistsException ex) {

	    return ResponseEntity
	    		.status(HttpStatus.CONFLICT)
	    		.body(new ApiResponse("Failed", ex.getMessage()));
	}
}
