package com.fitfusion.userservice.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitfusion.userservice.dtos.AddressRequestDto;
import com.fitfusion.userservice.dtos.AddressResponseDto;
import com.fitfusion.userservice.dtos.ApiResponse;
import com.fitfusion.userservice.entities.User;
import com.fitfusion.userservice.exceptions.ResourceNotFoundException;
import com.fitfusion.userservice.repositories.UserRepository;
import com.fitfusion.userservice.services.AddressService;

@RestController
@RequestMapping("api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService, UserRepository userRepo) {
        this.addressService = addressService;
    }

    // GET /api/addresses/user/{userId} -> list all saved addresses of a user
    @GetMapping
    public ResponseEntity<List<AddressResponseDto>> getAddresses(@AuthenticationPrincipal UserDetails userDetails) {
		/*
		 * User user= userRepo.findByEmail(userDetails.getUsername()).orElseThrow(()->
		 * new ResourceNotFoundException("No user found")); List<AddressResponseDto>
		 * addresses = addressService.getAddressesByUserId(user.getUserId());
		 */
    	 return ResponseEntity.ok(addressService.getAddresses(userDetails.getUsername()));
    }

    // POST /api/addresses -> save a new address
    @PostMapping
    public ResponseEntity<ApiResponse> saveAddress(@AuthenticationPrincipal UserDetails userDetails, @RequestBody AddressRequestDto requestDTO) {
        addressService.saveAddress(userDetails.getUsername(),requestDTO);
        ApiResponse response = new ApiResponse("SUCCESS", "Address created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // PUT /api/addresses/{id} -> edit address
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateAddress(@AuthenticationPrincipal UserDetails userDetails, @PathVariable("id") Long addressId,
                                                    @RequestBody AddressRequestDto requestDTO) {
        addressService.updateAddress(userDetails.getUsername(), addressId, requestDTO);
        ApiResponse response = new ApiResponse("SUCCESS", "Address updated successfully with ID: " + addressId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // DELETE /api/addresses/{id} -> delete address
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteAddress(@AuthenticationPrincipal UserDetails userDetails, @PathVariable("id") Long addressId) {
        addressService.deleteAddress(userDetails.getUsername(), addressId);
        ApiResponse response = new ApiResponse("SUCCESS", "Address deleted successfully with ID: " + addressId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}