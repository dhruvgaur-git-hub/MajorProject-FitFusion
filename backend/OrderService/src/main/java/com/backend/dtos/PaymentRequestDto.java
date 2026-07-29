package com.backend.dtos;

import com.backend.entities.Payments.PaymentMode;
import com.backend.entities.Payments.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequestDto {
	
	private PaymentMode paymentMode;
	private String transactionId;
	private PaymentStatus status;
	private Double amount;
}
