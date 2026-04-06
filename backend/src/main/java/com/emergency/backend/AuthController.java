package com.emergency.backend;

import com.emergency.backend.dto.AuthResponse;
import com.emergency.backend.dto.LoginRequest;
import com.emergency.backend.dto.RegisterRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        try {
            return authService.register(request);
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage());
        }
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        try {
            return authService.login(request);
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, exception.getMessage());
        }
    }
}
