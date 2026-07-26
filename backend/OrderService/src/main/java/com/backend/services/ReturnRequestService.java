package com.backend.services;

import java.util.List;

import com.backend.dtos.ReturnRequestDto;
import com.backend.entities.ReturnRequests;
import com.backend.entities.ReturnRequests.ReturnRequestStatus;

public interface ReturnRequestService {

	String createReturnRequest(ReturnRequestDto request);

	List<ReturnRequests> getReturnRequestsByOrderItemId(Long orderItemId);

	String reviewReturnRequest(Long returnRequestId, Long adminId, ReturnRequestStatus status);

}