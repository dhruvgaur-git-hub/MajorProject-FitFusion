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

        log.info("Creating new attribute definition");

        AttributeDefinition attri = mapper.map(attribute, AttributeDefinition.class);
        attri.setActive(true);

        attriRepo.save(attri);

        log.info("Attribute definition created successfully with id {}", attri.getId());

        return new ApiResponse("Success", "Atrribute Added Successfully");
    }

    @Override
    public List<AttributeDefinitionResponse> getAllAttributes() {

        log.info("Fetching all active attribute definitions");

        List<AttributeDefinition> attributes = attriRepo.findByActiveTrue();

        List<AttributeDefinitionResponse> resp = new ArrayList<>();

        attributes.forEach(attribute -> {
            AttributeDefinitionResponse temp = mapper.map(attribute, AttributeDefinitionResponse.class);
            resp.add(temp);
        });

        log.info("Successfully fetched {} attribute definitions", resp.size());

        return resp;
    }

    @Override
    public AttributeDefinitionResponse getAttributeById(String id) {

        log.info("Fetching attribute definition with id {}", id);

        AttributeDefinition attribute = attriRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attribute Definition Does Not Exist"));

        AttributeDefinitionResponse resp = mapper.map(attribute, AttributeDefinitionResponse.class);

        log.info("Attribute definition fetched successfully");

        return resp;
    }

    @Override
    public ApiResponse updateAttribute(String id, AttributeDefinitionRequest dto) {

        log.info("Updating attribute definition with id {}", id);

        AttributeDefinition attribute = attriRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attribute Definition Does Not Exist"));

        mapper.map(dto, attribute);

        attriRepo.save(attribute);

        log.info("Attribute definition updated successfully");

        return new ApiResponse("Success", "Attribute Definition Updated Successfully!!");
    }

    @Override
    public ApiResponse deleteAttribute(String id) {

        log.info("Deleting attribute definition with id {}", id);

        AttributeDefinition attribute = attriRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attribute Definition Does Not Exist"));

        attribute.setActive(false);
        attriRepo.save(attribute);

        log.info("Attribute definition marked as inactive successfully");

        return new ApiResponse("Success", "Attribute Definition Deleted Successfully!!");
    }

    @Override
    public ApiResponse restoreAttribute(String id) {

        log.info("Restoring attribute definition with id {}", id);

        AttributeDefinition attribute = attriRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attribute Definition Does Not Exist"));

        attribute.setActive(true);
        attriRepo.save(attribute);

        log.info("Attribute definition restored successfully");

        return new ApiResponse("Success", "Attribute Definition Restored Successfully!!");
    }

    @Override
	public List<AttributeDefinitionResponse> getAttributesBySubCategory(String subCategoryId) {
		
		log.info("Fetching attribute definitions for subCategoryId {}", subCategoryId);

		List<AttributeDefinition> attributes = attriRepo.findBySubCategoryIdAndActiveTrue(subCategoryId);

		List<AttributeDefinitionResponse> resp = new ArrayList<>();

		attributes.forEach(attribute -> {
			AttributeDefinitionResponse temp = mapper.map(attribute, AttributeDefinitionResponse.class);
			resp.add(temp);
		});

		log.info("Successfully fetched {} attribute definitions for subCategoryId {}", resp.size(), subCategoryId);

		return resp;
	}
}