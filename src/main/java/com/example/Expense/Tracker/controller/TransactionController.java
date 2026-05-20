package com.example.Expense.Tracker.controller;

import com.example.Expense.Tracker.dto.TransactionDTO;
import com.example.Expense.Tracker.model.Transaction;
import com.example.Expense.Tracker.model.Category;
import com.example.Expense.Tracker.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionDTO> addTransaction(@RequestBody TransactionDTO transactionDTO, Authentication authentication) {
        String username = authentication.getName();
        
        Transaction transaction = new Transaction();
        transaction.setText(transactionDTO.getText());
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setDate(transactionDTO.getDate());
        transaction.setCategory(Category.valueOf(transactionDTO.getCategory().toUpperCase()));
        
        Transaction saved = transactionService.addTransaction(transaction, username);
        return ResponseEntity.ok(convertToDTO(saved));
    }

    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllTransactions(Authentication authentication) {
        String username = authentication.getName();
        List<Transaction> transactions = transactionService.getAllTransactions(username);
        List<TransactionDTO> dtos = transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/export")
    public ResponseEntity<String> exportTransactions(Authentication authentication) {
        String username = authentication.getName();
        List<Transaction> transactions = transactionService.getAllTransactions(username);
        
        StringBuilder csv = new StringBuilder("Date,Description,Category,Amount\n");
        for (Transaction t : transactions) {
            csv.append(t.getDate()).append(",")
               .append(t.getText()).append(",")
               .append(t.getCategory()).append(",")
               .append(t.getAmount()).append("\n");
        }
        
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=transactions.csv")
                .contentType(org.springframework.http.MediaType.parseMediaType("text/csv"))
                .body(csv.toString());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        transactionService.deleteTransaction(id, username);
        return ResponseEntity.ok().build();
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setText(transaction.getText());
        dto.setAmount(transaction.getAmount());
        dto.setDate(transaction.getDate());
        dto.setCategory(transaction.getCategory() != null ? transaction.getCategory().name() : "OTHER");
        return dto;
    }
}
