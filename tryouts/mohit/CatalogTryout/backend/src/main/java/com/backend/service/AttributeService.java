package com.backend.service;

import java.util.List;

import com.backend.dtos.request.AttributeDefinitionRequest;
import com.backend.dtos.response.ApiResponse;
import com.backend.dtos.response.AttributeDefinitionResponse;

public interface AttributeService {

	ApiResponse addAttribute(AttributeDefinitionRequest attribute);

	List<AttributeDefinitionResponse> getAllAttributes();

	AttributeDefinitionResponse getAttributeById(String id);

}
