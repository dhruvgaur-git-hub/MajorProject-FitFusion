package com.fitfusion.userservice.services;


import com.fitfusion.userservice.dtos.AddressRequestDto;
import com.fitfusion.userservice.dtos.AddressResponseDto;
import com.fitfusion.userservice.entities.Address;
import com.fitfusion.userservice.entities.User;
import com.fitfusion.userservice.exceptions.ResourceNotFoundException;
import com.fitfusion.userservice.repositories.AddressRepository;
import com.fitfusion.userservice.repositories.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import com.fitfusion.userservice.entities.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public AddressService(AddressRepository addressRepository, 
                          UserRepository userRepository, 
                          ModelMapper modelMapper) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

	
	  public List<AddressResponseDto> getAddresses(String email) {
	  
	  User user = userRepository.findByEmail(email) .orElseThrow(() -> new
	  ResourceNotFoundException("User not found"));
	  
	  List<Address> addresses =
	  addressRepository.findByUser_UserId(user.getUserId());
	  
	  List<AddressResponseDto> dtoList = new ArrayList<>();
	  
	  for (Address address : addresses) { AddressResponseDto dto =
	  modelMapper.map(address, AddressResponseDto.class);
	  dto.setUserId(user.getUserId()); dtoList.add(dto); }
	  
	  return dtoList; }
	 
	/*
	 * public List<AddressResponseDto> getAddresses(String email) {
	 * 
	 * System.out.println("Email = " + email);
	 * 
	 * User user = userRepository.findByEmail(email) .orElseThrow(() -> new
	 * ResourceNotFoundException("User not found"));
	 * 
	 * System.out.println("User ID = " + user.getUserId());
	 * 
	 * List<Address> all = addressRepository.findAll();
	 * System.out.println("Total addresses in DB = " + all.size());
	 * 
	 * List<Address> addresses =
	 * addressRepository.findByUser_UserId(user.getUserId());
	 * System.out.println("Addresses found for user = " + addresses.size());
	 * 
	 * return addresses.stream() .map(address -> { AddressResponseDto dto =
	 * modelMapper.map(address, AddressResponseDto.class);
	 * dto.setUserId(user.getUserId()); return dto; }) .toList(); }
	 */
    public AddressResponseDto saveAddress(String email, AddressRequestDto requestDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Address address = modelMapper.map(requestDTO, Address.class);
        address.setUser(user); // Set parent relation

        Address savedAddress = addressRepository.save(address);
        return modelMapper.map(savedAddress, AddressResponseDto.class);
    }

    public AddressResponseDto updateAddress(String email, Long addressId, AddressRequestDto requestDTO) {
    	User user= userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("user not found"));
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));
        if (!address.getUser().getUserId().equals(user.getUserId())) {
            throw new AccessDeniedException("You cannot update this address");
        }
        modelMapper.map(requestDTO, address);

        Address updatedAddress = addressRepository.save(address);
        return modelMapper.map(updatedAddress, AddressResponseDto.class);
    }

    public void deleteAddress(String email, Long addressId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));
        if (!address.getUser().getUserId().equals(user.getUserId())) {
            throw new AccessDeniedException("You cannot update this address");
        }
        addressRepository.deleteById(addressId);
    }
}