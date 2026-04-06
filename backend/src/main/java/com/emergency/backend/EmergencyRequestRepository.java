package com.emergency.backend;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequest, Long> {
    List<EmergencyRequest> findAllByOrderByCreatedAtDesc();
    List<EmergencyRequest> findByPriorityOrderByCreatedAtDesc(String priority);
    List<EmergencyRequest> findByStatusOrderByCreatedAtDesc(String status);
    List<EmergencyRequest> findByPriorityAndStatusOrderByCreatedAtDesc(String priority, String status);
    List<EmergencyRequest> findByCreatedByEmailOrderByCreatedAtDesc(String createdByEmail);
    List<EmergencyRequest> findByCreatedByEmailAndPriorityOrderByCreatedAtDesc(String createdByEmail, String priority);
    List<EmergencyRequest> findByCreatedByEmailAndStatusOrderByCreatedAtDesc(String createdByEmail, String status);
    List<EmergencyRequest> findByCreatedByEmailAndPriorityAndStatusOrderByCreatedAtDesc(
            String createdByEmail,
            String priority,
            String status
    );
}