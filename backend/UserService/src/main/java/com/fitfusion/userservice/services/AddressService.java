package com.fitfusion.userservice.services;

import java.util.List;

import com.fitfusion.userservice.dtos.AddressRequestDto;
import com.fitfusion.userservice.dtos.AddressResponseDto;

public interface AddressService {

    List<AddressResponseDto> getAddresses(String email);

    AddressResponseDto saveAddress(String email, AddressRequestDto requestDTO);

    AddressResponseDto updateAddress(String email, Long addressId, AddressRequestDto requestDTO);

    // Marks exactly one address as default, unsetting it on all the user's other addresses.
    AddressResponseDto setDefaultAddress(String email, Long addressId);

    void deleteAddress(String email, Long addressId);
}
