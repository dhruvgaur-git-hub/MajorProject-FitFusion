package com.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.InvalidOperationException;
import com.backend.dtos.RefundDto;
import com.backend.entities.Refunds;
import com.backend.entities.Refunds.RefundStatus;
import com.backend.entities.ReturnRequests;
import com.backend.entities.ReturnRequests.ReturnRequestStatus;
import com.backend.repositories.RefundRepository;
import com.backend.repositories.ReturnRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class RefundServiceImpl implements RefundService {

	private final RefundRepository refundRepo;
	private final ReturnRequestRepository returnRequestRepo;

	@Override
	public String createRefund(RefundDto request) {
		String mssg = "Refund Creation Failed !!";
		try {
			ReturnRequests returnRequest = returnRequestRepo.findByReturnRequestId(request.getReturnRequestId());

			if (returnRequest == null) {
				throw new InvalidOperationException("Invalid Return Request Id!!");
			}

			if (refundRepo.findByReturnRequest_ReturnRequestId(request.getReturnRequestId()) != null) {
				throw new InvalidOperationException("Refund already exists for this return request!!");
			}

			Refunds refund = new Refunds();
			refund.setReturnRequest(returnRequest);
			refund.setAmount(request.getAmount());
			refund.setStatus(RefundStatus.PENDING);

			refundRepo.save(refund);

			mssg = "Refund created successfully with ID: " + refund.getRefundId();
		}
		catch (RuntimeException e) {
			mssg = e.getLocalizedMessage();
		}
		return mssg;
	}

	@Override
	public Refunds getRefundByReturnRequestId(Long returnRequestId) {
		Refunds refund = refundRepo.findByReturnRequest_ReturnRequestId(returnRequestId);

		if (refund == null) {
			throw new InvalidOperationException("No refund found for returnRequestId: " + returnRequestId);
		}

		return refund;
	}

	@Override
	public String updateRefundStatus(Long refundId, RefundStatus status) {
		String mssg = "Refund Status Update Failed !!";
		try {
			Refunds refund = refundRepo.findByRefundId(refundId);

			if (refund == null) {
				throw new InvalidOperationException("Invalid Refund Id!!");
			}

			refund.setStatus(status);
			refundRepo.save(refund);

			if (status == RefundStatus.PROCESSED) {
				ReturnRequests returnRequest = refund.getReturnRequest();
				returnRequest.setStatus(ReturnRequestStatus.COMPLETED);
				returnRequestRepo.save(returnRequest);
			}

			mssg = "Refund Status Updated to " + status + " Successfully!!";
		}
		catch (RuntimeException e) {
			mssg = e.getLocalizedMessage();
		}
		return mssg;
	}

}