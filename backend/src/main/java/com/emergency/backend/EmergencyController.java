package com.emergency.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/emergency")
public class EmergencyController {

    @Autowired
    private EmergencyRequestRepository repository;

    // ✅ CREATE Emergency Request (POST)
    @PostMapping("/create")
    public EmergencyRequest createRequest(@RequestBody EmergencyRequest request, Authentication authentication) {
        // Set beginner-friendly defaults if client leaves fields empty.
        if (request.getStatus() == null || request.getStatus().isBlank()) {
            request.setStatus("PENDING");
        }
        if (request.getPriority() == null || request.getPriority().isBlank()) {
            request.setPriority("NORMAL");
        }

        request.setStatus(request.getStatus().toUpperCase(Locale.ROOT));
        request.setPriority(request.getPriority().toUpperCase(Locale.ROOT));
        request.setCreatedByEmail(authentication.getName());
        return repository.save(request);
    }

    // ✅ GET all requests with optional filters, latest first (DRIVER/ADMIN)
    @GetMapping("/all")
    public List<EmergencyRequest> getAllRequests(
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String status
    ) {
        if (priority != null && !priority.isBlank() && status != null && !status.isBlank()) {
            return repository.findByPriorityAndStatusOrderByCreatedAtDesc(
                    priority.toUpperCase(Locale.ROOT),
                    status.toUpperCase(Locale.ROOT)
            );
        }
        if (priority != null && !priority.isBlank()) {
            return repository.findByPriorityOrderByCreatedAtDesc(priority.toUpperCase(Locale.ROOT));
        }
        if (status != null && !status.isBlank()) {
            return repository.findByStatusOrderByCreatedAtDesc(status.toUpperCase(Locale.ROOT));
        }
        return repository.findAllByOrderByCreatedAtDesc();
    }

    // ✅ GET current user's own requests with optional filters (USER/ADMIN)
    @GetMapping("/my")
    public List<EmergencyRequest> getMyRequests(
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String status,
            Authentication authentication
    ) {
        String email = authentication.getName();
        if (priority != null && !priority.isBlank() && status != null && !status.isBlank()) {
            return repository.findByCreatedByEmailAndPriorityAndStatusOrderByCreatedAtDesc(
                    email,
                    priority.toUpperCase(Locale.ROOT),
                    status.toUpperCase(Locale.ROOT)
            );
        }
        if (priority != null && !priority.isBlank()) {
            return repository.findByCreatedByEmailAndPriorityOrderByCreatedAtDesc(
                    email,
                    priority.toUpperCase(Locale.ROOT)
            );
        }
        if (status != null && !status.isBlank()) {
            return repository.findByCreatedByEmailAndStatusOrderByCreatedAtDesc(
                    email,
                    status.toUpperCase(Locale.ROOT)
            );
        }
        return repository.findByCreatedByEmailOrderByCreatedAtDesc(email);
    }

    // ✅ UPDATE STATUS
    @PutMapping("/update/{id}")
    public EmergencyRequest updateStatus(
            @PathVariable Long id,
            @RequestBody EmergencyRequest updatedRequest
    ) {
        EmergencyRequest request = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (updatedRequest.getStatus() == null || updatedRequest.getStatus().isBlank()) {
            throw new RuntimeException("Status is required");
        }
        request.setStatus(updatedRequest.getStatus().toUpperCase(Locale.ROOT));

        return repository.save(request);
    }
}