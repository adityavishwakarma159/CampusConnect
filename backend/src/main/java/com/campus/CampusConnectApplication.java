package com.campus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CampusConnectApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(CampusConnectApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("Campus Connect Backend Started Successfully!");
        System.out.println("Server running on: http://localhost:8080");
        System.out.println("========================================\n");
    }
}
