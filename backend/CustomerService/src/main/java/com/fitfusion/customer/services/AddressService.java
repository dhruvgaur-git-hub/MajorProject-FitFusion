package com.fitfusion.customer.services;

import java.util.List;

import com.fitfusion.customer.dtos.AddressRequestDto;
import com.fitfusion.customer.dtos.AddressResponseDto;

public interface AddressService {

    AddressResponseDto addAddress(
            String customerEmail,
            AddressRequestDto request);

    List<AddressResponseDto> getAllAddresses(
            String customerEmail);

    AddressResponseDto getAddressById(
            Long addressId,
            String customerEmail);

    AddressResponseDto updateAddress(
            Long addressId,
            String customerEmail,
            AddressRequestDto request);

    void deleteAddress(
            Long addressId,
            String customerEmail);

    AddressResponseDto setDefaultAddress(
            Long addressId,
            String customerEmail);
}