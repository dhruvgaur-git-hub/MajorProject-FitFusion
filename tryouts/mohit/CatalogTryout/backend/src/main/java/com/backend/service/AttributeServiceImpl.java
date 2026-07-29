package com.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.request.AttributeDefinitionRequest;
import com.backend.dtos.response.ApiResponse;
import com.backend.dtos.response.AttributeDefinitionResponse;
import com.backend.entites.mongo.AttributeDefinition;
import com.backend.repository.AttributeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AttributeServiceImpl implements AttributeService {
	
	private final ModelMapper mapper;
	private final AttributeRepository attriRepo;

	@Override
	public ApiResponse addAttribute(AttributeDefinitionRequest attribute) {
		
		AttributeDefinition attri = mapper.map(attribute, AttributeDefinition.class);
		attri.setActive(true);
		
		attriRepo.save(attri);
		
		return new ApiResponse("Success", "Atrribute Added Successfully");
	}

	@Override
	public List<AttributeDefinitionResponse> getAllAttributes() {
		
		List<AttributeDefinition> attributes = attriRepo.findAll();
		
		List<AttributeDefinitionResponse> resp = new ArrayList<>();
		
		attributes.forEach(attribute ->{
			AttributeDefinitionResponse temp = mapper.map(attribute, AttributeDefinitionResponse.class);
			resp.add(temp);
		});
		
		return resp;
	}

	@Override
	public AttributeDefinitionResponse getAttributeById(String id) {
		
		AttributeDefinition attribute = attriRepo.findById(id)
				.orElseThrow(()-> new ResourceNotFoundException("Attribute Definition Does Not Exist"));
		
		AttributeDefinitionResponse resp = mapper.map(attribute, AttributeDefinitionResponse.class);
		
		return resp;
	}	
}
