package com.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.InvalidOperationException;
import com.backend.dtos.ReturnRequestDto;
import com.backend.entities.OrderItems;
import com.backend.entities.ReturnRequests;
import com.backend.entities.ReturnRequests.ReturnRequestStatus;
import com.backend.repositories.OrderItemRepository;
import com.backend.repositories.ReturnRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ReturnRequestServiceImpl implements ReturnRequestService {

	private final ReturnRequestRepository returnRequestRepo;
	private final OrderItemRepository orderItemRepo;

	@Override
	public String createReturnRequest(ReturnRequestDto request) {
		String mssg = "Return Request Creation Failed !!";
		
			OrderItems item = orderItemRepo.findByOrderItemId(request.getOrderItemId());

			if (item == null) {
				throw new InvalidOperationException("Invalid Order Item Id!!");
			}

			ReturnRequests returnRequest = new ReturnRequests();
			returnRequest.setOrderItem(item);
			returnRequest.setCustomerId(request.getCustomerId());
			returnRequest.setRequestType(request.getRequestType());
			returnRequest.setReason(request.getReason());
			returnRequest.setStatus(ReturnRequestStatus.PENDING);

			returnRequestRepo.save(returnRequest);

			mssg = "Return Request created successfully with ID: " + returnRequest.getReturnRequestId();
		
		return mssg;
	}

	@Override
	public List<ReturnRequests> getReturnRequestsByOrderItemId(Long orderItemId) {
		return returnRequestRepo.findByOrderItem_OrderItemId(orderItemId);
	}

	@Override
	public String reviewReturnRequest(Long returnRequestId, Long adminId, ReturnRequestStatus status) {
		String mssg = "Return Request Review Failed !!";
			ReturnRequests returnRequest = returnRequestRepo.findByReturnRequestId(returnRequestId);

			if (returnRequest == null) {
				throw new InvalidOperationException("Invalid Return Request Id!!");
			}

			returnRequest.setReviewedBy(adminId);
			returnRequest.setStatus(status);
			returnRequestRepo.save(returnRequest);

			mssg = "Return Request " + returnRequestId + " reviewed successfully. Status: " + status;
		
		return mssg;
	}

}