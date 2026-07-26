package com.backend.services;

import com.backend.dtos.PaymentRequestDto;
import com.backend.entities.Payments;
import com.backend.entities.Payments.PaymentStatus;

public interface PaymentService {

	String recordNewPayment(PaymentRequestDto request, Long orderId);

	Payments getPaymentDetailsByOrderId(Long orderId);

	String updatePaymentStatusByPaymentId(Long paymentId, PaymentStatus status);

}
