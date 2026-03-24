package com.reservas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ReservasApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReservasApplication.class, args);
        System.out.println("🚀 Sistema de Reservas Backend iniciado!");
        System.out.println("📌 API disponible en: http://localhost:8081/api");
    }
}
