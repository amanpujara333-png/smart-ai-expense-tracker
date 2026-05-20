package com.example.Expense.Tracker;

import com.example.Expense.Tracker.model.User;
import com.example.Expense.Tracker.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ExpenseTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExpenseTrackerApplication.class, args);
	}

	@Bean
	CommandLineRunner init(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.findByUsername("admin").isEmpty()) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setEmail("admin@example.com");
				admin.setPassword(passwordEncoder.encode("admin123"));
				
				userRepository.save(admin);
				System.out.println("✅ Default user created: admin / admin123");
			}
		};
	}

}
