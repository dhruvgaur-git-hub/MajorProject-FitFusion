package com.fitfusion.userservice.controllers;

import com.fitfusion.userservice.dtos.AddressDTO;
import com.fitfusion.userservice.dtos.AddressRequestDTO;
import com.fitfusion.userservice.dtos.ApiResponse;
import com.fitfusion.userservice.services.AddressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    // GET /api/addresses/user/{userId} -> list all saved addresses of a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressDTO>> getAddressesByUserId(@PathVariable Long userId) {
        List<AddressDTO> addresses = addressService.getAddressesByUserId(userId);
        return ResponseEntity.status(HttpStatus.OK).body(addresses);
    }

    // POST /api/addresses -> save a new address 
    @PostMapping
    public ResponseEntity<ApiResponse> saveAddress(@RequestBody AddressRequestDTO requestDTO) {
        addressService.saveAddress(requestDTO);
        ApiResponse response = new ApiResponse("SUCCESS", "Address created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // PUT /api/addresses/{id} -> edit address 
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateAddress(@PathVariable("id") Long addressId, 
                                                    @RequestBody AddressRequestDTO requestDTO) {
        addressService.updateAddress(addressId, requestDTO);
        ApiResponse response = new ApiResponse("SUCCESS", "Address updated successfully with ID: " + addressId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // DELETE /api/addresses/{id} -> delete address 
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteAddress(@PathVariable("id") Long addressId) {
        addressService.deleteAddress(addressId);
        ApiResponse response = new ApiResponse("SUCCESS", "Address deleted successfully with ID: " + addressId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}