package com.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.request.BrandRequest;
import com.backend.dtos.response.ApiResponse;
import com.backend.dtos.response.BrandResponse;
import com.backend.entites.mongo.Brand;
import com.backend.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService{
	
	private final BrandRepository brandRepo;
	private final ModelMapper mapper;

	@Override
	public ApiResponse addBrand(BrandRequest dto) {
		
		log.info("Creating brand '{}'", dto.getName());
		
		Brand brand = mapper.map(dto, Brand.class);
		brand.setActive(true);
		
		brandRepo.save(brand);
		
		log.info("Brand '{}' saved successfully with Id {}", brand.getName(), brand.getId());
		
		return new ApiResponse("SUCCESS", "Brand added successfully");
	}

	@Override
	public List<BrandResponse> getAllBrands() {

	    log.info("Fetching all brands");

	    List<Brand> lst = brandRepo.findAll();

	    List<BrandResponse> resp = new ArrayList<>();

	    lst.forEach(brand -> {
	        BrandResponse brandResp = mapper.map(brand, BrandResponse.class);
	        resp.add(brandResp);
	    });

	    log.info("Successfully fetched {} brands", resp.size());

	    return resp;
	}

	@Override
	public BrandResponse getBrandById(String id) {

	    log.info("Trying to fetch Brand By {}", id);

	    Brand brand = brandRepo.findById(id)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Brand Not Found!!"));

	    log.info("Brand '{}' found by Id {}", brand.getName(), brand.getId());

	    BrandResponse resp = mapper.map(brand, BrandResponse.class);

	    log.info("Brand '{}' mapped successfully with DTO", resp.getName());

	    return resp;
	}

	@Override
	public ApiResponse updateById(String id, BrandRequest dto) {

	    log.info("Trying to update Brand with ID {}", id);

	    Brand brand = brandRepo.findById(id)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Brand Not Found!!"));

	    log.info("Brand '{}' found for update", brand.getName());

	    brand.setName(dto.getName());
	    brand.setDescription(dto.getDescription());

	    brandRepo.save(brand);

	    log.info("Brand '{}' updated successfully", brand.getName());

	    return new ApiResponse("SUCCESS", "Brand Updated Successfully");
	}

	@Override
	public ApiResponse deleteById(String id) {

	    log.info("Trying to delete Brand with ID {}", id);

	    Brand brand = brandRepo.findById(id)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Brand Not Found!!"));

	    log.info("Brand '{}' found for deletion", brand.getName());

	    brand.setActive(false);

	    brandRepo.save(brand);

	    log.info("Brand '{}' marked as inactive successfully", brand.getName());

	    return new ApiResponse("SUCCESS", "Brand Deleted Successfully");
	}

}
