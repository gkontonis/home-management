package com.homemanagement.security;

/**
 * Constants for user roles used throughout the application.
 * These roles should be used consistently for authorization checks.
 */
public class RoleConstants {

    /**
     * Administrator role with full system access including user management.
     */
    public static final String ADMIN = "ROLE_ADMIN";

    /**
     * Regular user role with access to their own data and tasks.
     */
    public static final String USER = "ROLE_USER";

    private RoleConstants() {
        // Utility class - prevent instantiation
    }
}
