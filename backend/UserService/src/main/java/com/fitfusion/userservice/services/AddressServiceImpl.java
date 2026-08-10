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
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public AddressServiceImpl(AddressRepository addressRepository,
                          UserRepository userRepository,
                          ModelMapper modelMapper) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }


	  @Override
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

    @Override
    public AddressResponseDto saveAddress(String email, AddressRequestDto requestDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Address> existing = addressRepository.findByUser_UserId(user.getUserId());

        Address address = modelMapper.map(requestDTO, Address.class);
        address.setAddressId(null);
        address.setUser(user); // Set parent relation

        // The very first address a user saves is automatically their default,
        // regardless of what was passed in — there's always exactly one default.
        boolean makeDefault = existing.isEmpty() || Boolean.TRUE.equals(requestDTO.getIsDefault());
        address.setIsDefault(makeDefault);

        if (makeDefault) {
            unsetExistingDefaults(existing);
        }

        Address savedAddress = addressRepository.save(address);
        return modelMapper.map(savedAddress, AddressResponseDto.class);
    }

    @Override
    public AddressResponseDto updateAddress(String email, Long addressId, AddressRequestDto requestDTO) {
    	User user= userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("user not found"));
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));
        if (!address.getUser().getUserId().equals(user.getUserId())) {
            throw new AccessDeniedException("You cannot update this address");
        }
        modelMapper.map(requestDTO, address);

        if (Boolean.TRUE.equals(requestDTO.getIsDefault())) {
            List<Address> others = addressRepository.findByUser_UserId(user.getUserId());
            others.removeIf(a -> a.getAddressId().equals(addressId));
            unsetExistingDefaults(others);
            address.setIsDefault(true);
        }

        Address updatedAddress = addressRepository.save(address);
        return modelMapper.map(updatedAddress, AddressResponseDto.class);
    }

    // Marks exactly one address as default, unsetting it on all the user's other addresses.
    @Override
    public AddressResponseDto setDefaultAddress(String email, Long addressId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));
        if (!address.getUser().getUserId().equals(user.getUserId())) {
            throw new AccessDeniedException("You cannot update this address");
        }

        List<Address> others = addressRepository.findByUser_UserId(user.getUserId());
        others.removeIf(a -> a.getAddressId().equals(addressId));
        unsetExistingDefaults(others);

        address.setIsDefault(true);
        Address saved = addressRepository.save(address);
        return modelMapper.map(saved, AddressResponseDto.class);
    }

    private void unsetExistingDefaults(List<Address> addresses) {
        for (Address a : addresses) {
            if (Boolean.TRUE.equals(a.getIsDefault())) {
                a.setIsDefault(false);
                addressRepository.save(a);
            }
        }
    }

    @Override
    public void deleteAddress(String email, Long addressId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));
        if (!address.getUser().getUserId().equals(user.getUserId())) {
            throw new AccessDeniedException("You cannot update this address");
        }
        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());
        addressRepository.deleteById(addressId);

        // If the deleted address was the default, promote another one (if any) to default.
        if (wasDefault) {
            List<Address> remaining = addressRepository.findByUser_UserId(user.getUserId());
            if (!remaining.isEmpty()) {
                Address newDefault = remaining.get(0);
                newDefault.setIsDefault(true);
                addressRepository.save(newDefault);
            }
        }
    }
}
