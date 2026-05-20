package com.example.Expense.Tracker.controller;

import com.example.Expense.Tracker.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(analyticsService.getFinancialSummary(username));
    }
}
