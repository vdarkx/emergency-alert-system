package com.emergency.backend;

import com.emergency.backend.dto.UserSummaryResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final EmergencyRequestRepository emergencyRequestRepository;

    public AdminController(UserRepository userRepository, EmergencyRequestRepository emergencyRequestRepository) {
        this.userRepository = userRepository;
        this.emergencyRequestRepository = emergencyRequestRepository;
    }

    @GetMapping("/users")
    public List<UserSummaryResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserSummaryResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name()
                ))
                .toList();
    }

    @GetMapping("/requests")
    public List<EmergencyRequest> getAllRequestsForAdmin() {
        return emergencyRequestRepository.findAllByOrderByCreatedAtDesc();
    }
}
