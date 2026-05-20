package com.example.Expense.Tracker.service;

import java.util.Map;

public interface AnalyticsService {
    Map<String, Object> getFinancialSummary(String username);
}
