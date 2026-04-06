package com.emergency.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController  // Marks this class as API controller
public class HelloController {

    @GetMapping("/")  // When user opens localhost:8080/
    public String hello() {
        return "Emergency Response System Backend is Running!";
    }
}