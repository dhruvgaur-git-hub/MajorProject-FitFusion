package com.backend.services;

import com.backend.dtos.PaymentRequestDto;
import com.backend.dtos.RazorpayOrderResponseDto;
import com.backend.dtos.RazorpayVerifyRequestDto;
import com.backend.entities.Payments;
import com.backend.entities.Payments.PaymentStatus;

public interface PaymentService {

	String recordNewPayment(PaymentRequestDto request, Long orderId);

	Payments getPaymentDetailsByOrderId(Long orderId);

	String updatePaymentStatusByPaymentId(Long paymentId, PaymentStatus status);
	
	// Razorpay methods
	RazorpayOrderResponseDto createRazorpayOrder(Long orderId) throws Exception;

	String verifyRazorpayPayment(RazorpayVerifyRequestDto request) throws Exception;

	void handleRazorpayWebhook(String rawPayload, String signatureHeader) throws Exception;


}
