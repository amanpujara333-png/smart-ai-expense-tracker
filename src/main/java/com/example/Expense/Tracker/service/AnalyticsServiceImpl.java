package com.example.Expense.Tracker.service;

import com.example.Expense.Tracker.model.Transaction;
import com.example.Expense.Tracker.model.User;
import com.example.Expense.Tracker.repository.TransactionRepository;
import com.example.Expense.Tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Map<String, Object> getFinancialSummary(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Transaction> transactions = transactionRepository.findByUserUsername(username);
        
        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();

        // Basic Totals
        double totalBalance = transactions.stream().mapToDouble(Transaction::getAmount).sum();
        double monthlyIncome = transactions.stream()
                .filter(t -> t.getAmount() > 0 && isCurrentMonth(t, currentMonth, currentYear))
                .mapToDouble(Transaction::getAmount).sum();
        double monthlyExpenses = transactions.stream()
                .filter(t -> t.getAmount() < 0 && isCurrentMonth(t, currentMonth, currentYear))
                .mapToDouble(t -> Math.abs(t.getAmount())).sum();

        // Category Breakdown
        Map<String, Double> categoryBreakdown = transactions.stream()
                .filter(t -> t.getAmount() < 0 && isCurrentMonth(t, currentMonth, currentYear))
                .collect(Collectors.groupingBy(
                        t -> t.getCategory().name(),
                        Collectors.summingDouble(t -> Math.abs(t.getAmount()))
                ));

        // 1. Financial Health Score (0-100)
        double healthScore = calculateHealthScore(monthlyIncome, monthlyExpenses, user.getMonthlyBudget(), transactions);

        // 2. Budget Alert
        String budgetStatus = "On Track";
        if (user.getMonthlyBudget() != null && user.getMonthlyBudget() > 0) {
            double percentUsed = (monthlyExpenses / user.getMonthlyBudget()) * 100;
            if (percentUsed >= 100) budgetStatus = "Exceeded";
            else if (percentUsed >= 80) budgetStatus = "Critical";
        } else {
            budgetStatus = "Budget Not Set";
        }

        // 3. AI Insights (Rule-based)
        List<String> aiInsights = generateInsights(transactions, monthlyIncome, monthlyExpenses, categoryBreakdown);

        // 4. Subscription Detection
        List<Map<String, Object>> subscriptions = detectSubscriptions(transactions);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalBalance", totalBalance);
        summary.put("monthlyIncome", monthlyIncome);
        summary.put("monthlyExpenses", monthlyExpenses);
        summary.put("categoryBreakdown", categoryBreakdown);
        summary.put("healthScore", Math.round(healthScore));
        summary.put("budgetStatus", budgetStatus);
        summary.put("monthlyBudget", user.getMonthlyBudget() != null ? user.getMonthlyBudget() : 0);
        summary.put("aiInsights", aiInsights);
        summary.put("subscriptions", subscriptions);

        return summary;
    }

    private boolean isCurrentMonth(Transaction t, int month, int year) {
        return t.getDate() != null && 
               t.getDate().getMonthValue() == month && 
               t.getDate().getYear() == year;
    }

    private double calculateHealthScore(double income, double expenses, Double budget, List<Transaction> transactions) {
        if (income <= 0) return 0;
        
        double savingsRate = Math.max(0, (income - expenses) / income);
        double savingsScore = savingsRate * 40; // 40 points for savings rate

        double budgetScore = 0;
        if (budget != null && budget > 0) {
            double budgetAdherence = Math.max(0, (budget - expenses) / budget);
            budgetScore = budgetAdherence * 30; // 30 points for budget discipline
        } else {
            budgetScore = 15; // neutral
        }

        // Unnecessary spending (Category OTHER)
        double otherSpending = transactions.stream()
                .filter(t -> t.getAmount() < 0 && t.getCategory().name().equals("OTHER"))
                .mapToDouble(t -> Math.abs(t.getAmount())).sum();
        double necessaryScore = Math.max(0, (income - otherSpending) / income) * 20; // 20 points for low unnecessary spend

        // Consistency (Simplified: standard deviation of daily spend or just a fixed bonus for low variance)
        double consistencyScore = 10; // Base points for consistency

        return Math.min(100, Math.max(0, savingsScore + budgetScore + necessaryScore + consistencyScore));
    }

    private List<String> generateInsights(List<Transaction> transactions, double income, double expenses, Map<String, Double> categories) {
        List<String> insights = new ArrayList<>();
        LocalDate now = LocalDate.now();
        int dayOfMonth = now.getDayOfMonth();
        int daysInMonth = now.lengthOfMonth();

        // 1. Budget Prediction
        double predictedSpend = (expenses / dayOfMonth) * daysInMonth;
        insights.add(String.format("Prediction: You are on track to spend $%.2f by the end of the month.", predictedSpend));

        if (income > 0 && predictedSpend > income) {
            insights.add("Alert: Your predicted spending exceeds your monthly income. Consider cutting back.");
        }

        // 2. Trend Analysis (Current vs Previous Week)
        long currentWeekSpend = transactions.stream()
                .filter(t -> t.getAmount() < 0 && t.getDate() != null && t.getDate().isAfter(now.minusDays(7)))
                .mapToLong(t -> (long)Math.abs(t.getAmount())).sum();
        long prevWeekSpend = transactions.stream()
                .filter(t -> t.getAmount() < 0 && t.getDate() != null && 
                             t.getDate().isBefore(now.minusDays(7)) && t.getDate().isAfter(now.minusDays(14)))
                .mapToLong(t -> (long)Math.abs(t.getAmount())).sum();

        if (prevWeekSpend > 0) {
            double change = ((double)(currentWeekSpend - prevWeekSpend) / prevWeekSpend) * 100;
            if (change > 10) insights.add(String.format("Spending Trend: You've spent %.1f%% more this week compared to last week.", change));
            else if (change < -10) insights.add(String.format("Great Job! You've spent %.1f%% less this week compared to last week.", Math.abs(change)));
        }

        // 3. Category Specific Advice
        categories.forEach((name, amount) -> {
            if (amount > income * 0.25) {
                insights.add("Optimization: " + name + " is taking up a large portion of your budget. Reducing it by 10% could save $" + Math.round(amount * 0.1) + "/mo.");
            }
        });

        // 4. Weekend vs Weekday patterns
        long weekendSpend = transactions.stream()
                .filter(t -> t.getAmount() < 0 && t.getDate() != null && (t.getDate().getDayOfWeek().getValue() >= 6))
                .mapToLong(t -> (long)Math.abs(t.getAmount())).sum();
        if (weekendSpend > expenses * 0.5) {
            insights.add("Pattern Detected: Over 50% of your spending happens on weekends.");
        }

        if (insights.size() < 2) {
            insights.add("Your financial patterns are stable. Review your subscriptions for potential savings.");
        }
        return insights;
    }

    private List<Map<String, Object>> detectSubscriptions(List<Transaction> transactions) {
        // Group by Description and Amount, then check for repetition
        return transactions.stream()
                .filter(t -> t.getAmount() < 0)
                .collect(Collectors.groupingBy(
                        t -> t.getText().toLowerCase() + "|" + Math.abs(t.getAmount()),
                        Collectors.toList()
                ))
                .entrySet().stream()
                .filter(e -> e.getValue().size() >= 2) // At least twice
                .map(e -> {
                    Transaction sample = e.getValue().get(0);
                    Map<String, Object> sub = new HashMap<>();
                    sub.put("name", sample.getText());
                    sub.put("amount", Math.abs(sample.getAmount()));
                    sub.put("frequency", "Monthly (Likely)");
                    return sub;
                })
                .collect(Collectors.toList());
    }
}
