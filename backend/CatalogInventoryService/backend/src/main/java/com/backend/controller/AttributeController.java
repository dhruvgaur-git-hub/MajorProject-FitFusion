package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.request.AttributeDefinitionRequest;
import com.backend.service.AttributeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Validated
@RestController
@RequestMapping("/api/attribute")
@RequiredArgsConstructor
public class AttributeController {

    private final AttributeService attributeService;

    @PostMapping("/addAttribute")
    public ResponseEntity<?> addAttribute(@RequestBody @Valid AttributeDefinitionRequest attribute) {

    	log.info("Received request to add attribute definition");
    	
        return ResponseEntity.ok(attributeService.addAttribute(attribute));
    }

    @GetMapping("/fetchAll")
    public ResponseEntity<?> fetchAllAttributes() {

        log.info("Received request to fetch all attributes");

        return ResponseEntity.ok(attributeService.getAllAttributes());
    }

    @GetMapping("/fetchById/{id}")
    public ResponseEntity<?> fetchAttributeById(@PathVariable String id) {

        log.info("Received request to fetch attribute with id {}", id);

        return ResponseEntity.ok(attributeService.getAttributeById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttribute(@PathVariable String id,
                                             @RequestBody AttributeDefinitionRequest attribute) {

        log.info("Received request to update attribute with id {}", id);

        return ResponseEntity.ok(attributeService.updateAttribute(id, attribute));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttribute(@PathVariable String id) {

        log.info("Received request to delete attribute with id {}", id);

        return ResponseEntity.ok(attributeService.deleteAttribute(id));
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<?> restoreAttribute(@PathVariable String id) {

        log.info("Received request to restore attribute with id {}", id);

        return ResponseEntity.ok(attributeService.restoreAttribute(id));
    }
}