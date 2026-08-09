package com.backend.services;

import com.backend.dtos.RefundDto;
import com.backend.entities.Refunds;
import com.backend.entities.Refunds.RefundStatus;

public interface RefundService {

	String createRefund(RefundDto request);

	Refunds getRefundByReturnRequestId(Long returnRequestId);

	String updateRefundStatus(Long refundId, RefundStatus status);

}