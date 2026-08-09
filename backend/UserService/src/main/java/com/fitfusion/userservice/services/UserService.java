package com.fitfusion.userservice.services;

import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fitfusion.security.CustomUserDetailsService;
import com.fitfusion.security.JwtService;
import com.fitfusion.userservice.dtos.ChangePasswordRequestDto;
import com.fitfusion.userservice.dtos.CustomerRegisterRequestDto;
import com.fitfusion.userservice.dtos.LoginRequestDto;
import com.fitfusion.userservice.dtos.LoginResponseDto;
import com.fitfusion.userservice.dtos.RetailerRegisterRequestDto;
import com.fitfusion.userservice.dtos.UpdateUserRequestDto;
import com.fitfusion.userservice.dtos.UserResponseDto;
import com.fitfusion.userservice.entities.Retailer;
import com.fitfusion.userservice.entities.RetailerStatus;
import com.fitfusion.userservice.entities.Role;
import com.fitfusion.userservice.entities.User;
import com.fitfusion.userservice.exceptions.InvalidCredentialsException;
import com.fitfusion.userservice.exceptions.ResourceNotFoundException;
import com.fitfusion.userservice.exceptions.RetailerNotApprovedException;
import com.fitfusion.userservice.exceptions.UserAlreadyExistsException;
import com.fitfusion.userservice.repositories.RetailerRepository;
import com.fitfusion.userservice.repositories.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional
public class UserService {
	
	private final UserRepository userRepo;
	private final RetailerRepository retailerRepo;
	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;
	/* private final CustomUserDetailsService customUserDetailsService; */
	
    public UserResponseDto registerCustomer(CustomerRegisterRequestDto reqDto) {
    	if(userRepo.existsByEmail(reqDto.getEmail())) {
    		throw new UserAlreadyExistsException("User already has an account with this email");
    	}
    	if (userRepo.existsByMobile(reqDto.getMobile())) {
    	    throw new UserAlreadyExistsException("User already has an account with this mobile");
    	}
    	User user= User.builder()
    			.name(reqDto.getName())
    			.email(reqDto.getEmail())
    			.password(passwordEncoder.encode(reqDto.getPassword()))
    			.mobile(reqDto.getMobile())
    			.role(Role.CUSTOMER)
    			.build();
    	User savedUser= userRepo.save(user);
    	UserResponseDto respDto= modelMapper.map(savedUser, UserResponseDto.class);
    	return respDto;
    }

    public UserResponseDto registerRetailer(RetailerRegisterRequestDto req) {
    	if(userRepo.existsByEmail(req.getEmail())) {
    		throw new UserAlreadyExistsException("email already registered");
    	}
    	if(userRepo.existsByMobile(req.getMobile())) {
    		throw new UserAlreadyExistsException("mobile already registered");
    	}
    	User user= User.builder()
    			.name(req.getName())
    			.email(req.getEmail())
    			.password(passwordEncoder.encode(req.getPassword()))
    			.mobile(req.getMobile())
    			.role(Role.RETAILER)
    			.build();
    	User savedUser= userRepo.save(user);
    	Retailer retailer = new Retailer();

    	retailer.setUser(savedUser);

    	retailer.setStoreName(req.getStoreName());
    	retailer.setPickupAddress(req.getPickupAddress());
    	retailer.setGstinNo(req.getGstinNo());
    	retailer.setAccountNumber(req.getAccountNumber());
    	retailer.setIfscCode(req.getIfscCode());
    	retailer.setBankName(req.getBankName());
    	
    	Retailer savedRetailer= retailerRepo.save(retailer);
    	return modelMapper.map(savedUser, UserResponseDto.class);
    }

    public LoginResponseDto login(LoginRequestDto req) {
		/*
		 * User user= userRepo.findByEmail(req.getEmail()).orElseThrow(()->new
		 * ResourceNotFoundException("User doesnt exist"));
		 * if(!passwordEncoder.matches(req.getPassword(), user.getPassword())) { throw
		 * new InvalidCredentialsException("wrong email or password"); }
		 */
		/*
		 * authenticationManager.authenticate( new
		 * UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()) );
		 * UserDetails userDetails=
		 * customUserDetailsService.loadUserByUsername(req.getEmail());
		 */
    	Authentication authentication = authenticationManager.authenticate(
    	        new UsernamePasswordAuthenticationToken(
    	                req.getEmail(),
    	                req.getPassword()));

		/* UserDetails userDetails = (UserDetails) authentication.getPrincipal(); */
    	User user = userRepo.findByEmail(req.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User not found"));

    	if (user.getRole() == Role.RETAILER) {
    		Retailer retailer = retailerRepo.findById(user.getUserId())
    				.orElseThrow(() -> new ResourceNotFoundException("Retailer profile not found"));

    		if (retailer.getStatus() != RetailerStatus.APPROVED) {
    			switch (retailer.getStatus()) {
    				case PENDING:
    					throw new RetailerNotApprovedException("Your retailer account is still under review. Please wait for admin approval.");
    				case REJECTED:
    					throw new RetailerNotApprovedException("Your retailer application was rejected.");
    				case BLOCKED:
    					throw new RetailerNotApprovedException("Your retailer account has been blocked. Contact support for details.");
    				case CLOSED:
    					throw new RetailerNotApprovedException("This retailer account has been closed. Please create a new account to continue.");
    				default:
    					throw new RetailerNotApprovedException("Your retailer account is not currently active.");
    			}
    		}
    	}

        String token = jwtService.generateToken(user);

        
        return LoginResponseDto.builder()
        		.token(token)
        		.type("Bearer")
        		.email(user.getEmail())
        		.role(user.getRole().name())
        		.build();
  
		/* return jwtService.generateToken(userDetails); */
    }

	public UserResponseDto getProfile(String userEmail) {
		User user= userRepo.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("Email not found"));
		UserResponseDto userResponse= modelMapper.map(user, UserResponseDto.class);
		return userResponse;
	}

    public UserResponseDto updateUser(String userEmailId, UpdateUserRequestDto req) {
        User user = userRepo.findByEmail(userEmailId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    	user.setName(req.getName());
    	user.setMobile(req.getMobile());
    	userRepo.save(user);
    	return modelMapper.map(user, UserResponseDto.class);
    }

    public void changePassword(String userEmailId, ChangePasswordRequestDto req) {
    	User user= userRepo.findByEmail(userEmailId).orElseThrow(()->new ResourceNotFoundException("user not found with the given email"));
    	if(!passwordEncoder.matches(req.getOldPassword(), user.getPassword())) {
    		throw new InvalidCredentialsException("wrong password");
    	}
    	user.setPassword(passwordEncoder.encode(req.getNewPassword()));
    	userRepo.save(user);
    }

    public void deleteUser(String email) {
    	User user = userRepo.findByEmail(email).orElseThrow(()->new ResourceNotFoundException("user not found with the given email"));
    	userRepo.delete(user);
    }
}