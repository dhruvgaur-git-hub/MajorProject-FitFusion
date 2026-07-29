package com.fitfusion.customer.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitfusion.customer.dtos.CustomerResponseDto;
import com.fitfusion.customer.dtos.SignUpRequestDto;
import com.fitfusion.customer.services.CustomerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/fitfusion/customers")
@RequiredArgsConstructor
public class CustomerController{
	private final CustomerService customerService;
	@PostMapping("/signup")
	public ResponseEntity<CustomerResponseDto> signup(@Valid @RequestBody SignUpRequestDto request){
		CustomerResponseDto response= customerService.signup(request);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}
}
