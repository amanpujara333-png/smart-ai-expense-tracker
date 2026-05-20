package com.example.Expense.Tracker.controller;

import com.example.Expense.Tracker.model.User;
import com.example.Expense.Tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.example.Expense.Tracker.dto.MessageResponse;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/budget")
    public ResponseEntity<?> updateBudget(@RequestBody Map<String, Double> budgetRequest, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setMonthlyBudget(budgetRequest.get("budget"));
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Budget updated successfully!"));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("hasImage", user.getProfileImage() != null);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/profile/image")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file, Authentication authentication) throws IOException {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        
        user.setProfileImage(file.getBytes());
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of("message", "Image uploaded successfully"));
    }

    @GetMapping("/profile/image")
    public ResponseEntity<byte[]> getImage(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        
        if (user.getProfileImage() == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(user.getProfileImage());
    }
}
