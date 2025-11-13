package com.homemanagement.security;

import com.homemanagement.domain.User;
import com.homemanagement.rest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Initializes the database with required data on application startup.
 * Creates the initial admin user if no admin exists.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createAdminUserIfNotExists();
    }

    private void createAdminUserIfNotExists() {
        // Check if any user with ROLE_ADMIN exists
        boolean adminExists = userRepository.findAll().stream()
                .anyMatch(user -> user.getRoles().contains(RoleConstants.ADMIN));

        if (!adminExists) {
            log.info("No admin user found. Creating default admin user...");

            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@homemanagement.local");
            // Default password: Admin123! (MUST be changed after first login)
            admin.setPassword(passwordEncoder.encode("Admin123!"));
            admin.setRoles(Set.of(RoleConstants.ADMIN));

            userRepository.save(admin);

            log.info("======================================");
            log.info("ADMIN USER CREATED SUCCESSFULLY");
            log.info("Username: admin");
            log.info("Password: Admin123!");
            log.info("IMPORTANT: Please change this password immediately after first login!");
            log.info("======================================");
        } else {
            log.debug("Admin user already exists. Skipping initialization.");
        }
    }
}
