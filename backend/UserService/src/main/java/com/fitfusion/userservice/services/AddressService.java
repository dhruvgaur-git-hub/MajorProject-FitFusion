package com.fitfusion.userservice.services;

import com.fitfusion.userservice.dtos.AddressDTO;
import com.fitfusion.userservice.dtos.AddressRequestDTO;
import com.fitfusion.userservice.entities.Address;
import com.fitfusion.userservice.entities.User;
import com.fitfusion.userservice.exceptions.ResourceNotFoundException;
import com.fitfusion.userservice.repositories.AddressRepository;
import com.fitfusion.userservice.repositories.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

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

    public List<AddressDTO> getAddressesByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }

        List<Address> addresses = addressRepository.findByUserUserId(userId);
        List<AddressDTO> dtoList = new ArrayList<>();

        for (Address address : addresses) {
            AddressDTO dto = modelMapper.map(address, AddressDTO.class);
            
            //setting user id in addressDTO
            if (address.getUser() != null) {
                dto.setUserId(address.getUser().getUserId()); 
            }
            
            dtoList.add(dto);
        }

        return dtoList;
    }
    public AddressDTO saveAddress(AddressRequestDTO requestDTO) {
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + requestDTO.getUserId()));
        
        Address address = modelMapper.map(requestDTO, Address.class);
        address.setUser(user); // Set parent relation

        Address savedAddress = addressRepository.save(address);
        return modelMapper.map(savedAddress, AddressDTO.class);
    }

    public AddressDTO updateAddress(Long addressId, AddressRequestDTO requestDTO) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));

        modelMapper.map(requestDTO, address);

        Address updatedAddress = addressRepository.save(address);
        return modelMapper.map(updatedAddress, AddressDTO.class);
    }

    public void deleteAddress(Long addressId) {
        if (!addressRepository.existsById(addressId)) {
            throw new ResourceNotFoundException("Address not found with ID: " + addressId);
        }
        addressRepository.deleteById(addressId);
    }
}