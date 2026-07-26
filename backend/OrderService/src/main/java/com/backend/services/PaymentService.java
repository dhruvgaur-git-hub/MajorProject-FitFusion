package com.backend.services;

import com.backend.dtos.PaymentRequestDto;

public interface PaymentService {

	String recordNewPayment(PaymentRequestDto request, Long orderId);

}
