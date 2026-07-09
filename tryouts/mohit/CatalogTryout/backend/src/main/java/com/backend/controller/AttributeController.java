package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.request.AttributeDefinitionRequest;
import com.backend.service.AttributeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Validated
@RestController
@RequestMapping("/attribute")
@RequiredArgsConstructor
public class AttributeController {
	
	private final AttributeService attributeService;
	
	@PostMapping("/addAttribute")
	public ResponseEntity<?> addAttribute(@RequestBody AttributeDefinitionRequest attribute){
		return ResponseEntity.ok(attributeService.addAttribute(attribute));
	}
	
	@GetMapping("/fetchAll")
	public ResponseEntity<?> fetchAllAttributes(){
		return ResponseEntity.ok(attributeService.getAllAttributes());
	}
	
	@GetMapping("/fetchById/{id}")
	public ResponseEntity<?> FetchAttributeById(@PathVariable String id){
		return ResponseEntity.ok(attributeService.getAttributeById(id));
	}
}
