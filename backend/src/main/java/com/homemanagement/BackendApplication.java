package com.homemanagement;

import com.homemanagement.domain.User;
import com.homemanagement.rest.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Set;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Only create admin if it doesn't exist
            //TODO: Remove hardcoded password in production
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@home.com");
                admin.setRoles(Set.of("ROLE_ADMIN", "ROLE_USER"));
                
                userRepository.save(admin);
                System.out.println("✓ Admin user created with password: admin123");
            } else {
                System.out.println("✓ Admin user already exists");
            }
        };
    }
}