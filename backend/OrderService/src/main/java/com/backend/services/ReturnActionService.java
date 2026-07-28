package com.backend.services;

import java.util.List;

import com.backend.dtos.ReturnActionDto;
import com.backend.entities.ReturnActions;

public interface ReturnActionService {

	String createReturnAction(ReturnActionDto request);

	List<ReturnActions> getActionsByReturnRequestId(Long returnRequestId);

}