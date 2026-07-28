package com.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RazorpayOrderResponseDto {

	private String razorpayOrderId;
	
	private Long amountInPaise;
	
	private String currency;
	
	private String razorpayKeyId;//its safe 

}