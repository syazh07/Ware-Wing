package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterRequestDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.repository.SystemUserRepository;
import com.example.demo.util.JwtService;

@Service
public class AuthService {

    @Autowired
    private SystemUserRepository systemUserRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public String register(RegisterRequestDto registerRequestDto) {

        if (systemUserRepository.findByUsername(registerRequestDto.getUsername()).isPresent()) {
            throw new BusinessValidationException("Username already exists");
        }

        SystemUser user = new SystemUser();

        user.setUsername(registerRequestDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequestDto.getPassword()));
        user.setRole(registerRequestDto.getRole());

        systemUserRepository.save(user);

        return "User registered successfully";
    }


    public AuthResponseDto login(AuthRequestDto authRequestDto) {

        SystemUser user = systemUserRepository
                .findByUsername(authRequestDto.getUsername())
                .orElseThrow(() ->
                        new BusinessValidationException("Invalid username or password"));

        if (!passwordEncoder.matches(authRequestDto.getPassword(), user.getPassword())) {
            throw new BusinessValidationException("Invalid username or password");
        }

        String token = jwtService.generateToken(
                user.getUsername(),
                user.getRole());

        return new AuthResponseDto(
                token,
                user.getRole(),
                user.getUsername());
    }
}