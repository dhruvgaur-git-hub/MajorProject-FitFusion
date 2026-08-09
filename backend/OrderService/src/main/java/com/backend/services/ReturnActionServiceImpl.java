package com.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.InvalidOperationException;
import com.backend.dtos.ReturnActionDto;
import com.backend.entities.ReturnActions;
import com.backend.entities.ReturnRequests;
import com.backend.repositories.ReturnActionRepository;
import com.backend.repositories.ReturnRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ReturnActionServiceImpl implements ReturnActionService {

	private final ReturnActionRepository returnActionRepo;
	private final ReturnRequestRepository returnRequestRepo;

	@Override
	public String createReturnAction(ReturnActionDto request) {
		String mssg = "Return Action Creation Failed !!";
		
			ReturnRequests returnRequest = returnRequestRepo.findByReturnRequestId(request.getReturnRequestId());

			if (returnRequest == null) {
				throw new InvalidOperationException("Invalid Return Request Id!!");
			}

			ReturnActions action = new ReturnActions();
			action.setReturnRequest(returnRequest);
			action.setAdminId(request.getAdminId());
			action.setAction(request.getAction());

			returnActionRepo.save(action);

			mssg = "Return Action logged successfully with ID: " + action.getReturnActionId();
		
		return mssg;
	}

	@Override
	public List<ReturnActions> getActionsByReturnRequestId(Long returnRequestId) {
		return returnActionRepo.findByReturnRequest_ReturnRequestId(returnRequestId);
	}

}