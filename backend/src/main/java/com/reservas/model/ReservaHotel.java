package com.reservas.model;

import java.text.SimpleDateFormat;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("HOTEL")
public class ReservaHotel extends Reserva {
    
    private String nombreHotel;
    private String tipoHabitacion;
    private int numeroHuespedes;
    private boolean incluyeDesayuno;
    private boolean incluyeEstacionamiento;
    
    // Getters y Setters
    public String getNombreHotel() { return nombreHotel; }
    public void setNombreHotel(String nombreHotel) { this.nombreHotel = nombreHotel; }
    
    public String getTipoHabitacion() { return tipoHabitacion; }
    public void setTipoHabitacion(String tipoHabitacion) { this.tipoHabitacion = tipoHabitacion; }
    
    public int getNumeroHuespedes() { return numeroHuespedes; }
    public void setNumeroHuespedes(int numeroHuespedes) { this.numeroHuespedes = numeroHuespedes; }
    
    public boolean isIncluyeDesayuno() { return incluyeDesayuno; }
    public void setIncluyeDesayuno(boolean incluyeDesayuno) { this.incluyeDesayuno = incluyeDesayuno; }
    
    public boolean isIncluyeEstacionamiento() { return incluyeEstacionamiento; }
    public void setIncluyeEstacionamiento(boolean incluyeEstacionamiento) { this.incluyeEstacionamiento = incluyeEstacionamiento; }
    
    @Override
    public String getTipoReserva() {
        return "HOTEL";
    }
    
    @Override
    public Double calcularPrecioTotal() {
        long diff = getFechaFin().getTime() - getFechaInicio().getTime();
        long noches = diff / (1000 * 60 * 60 * 24);
        
        double precioPorNoche = getPrecioBase();
        
        if (tipoHabitacion != null) {
            switch(tipoHabitacion) {
                case "SUITE" -> precioPorNoche *= 2.5;
                case "DOBLE" -> precioPorNoche *= 1.5;
            }
        }
        
        if (incluyeDesayuno) precioPorNoche += 15;
        if (incluyeEstacionamiento) precioPorNoche += 10;
        
        return precioPorNoche * noches;
    }
    
    @Override
    public String generarVoucher() {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        return String.format(
            "║ Hotel: %-30s ║\n║ Habitación: %-27s ║\n║ Huéspedes: %-28d ║\n║ Check-in: %-28s ║\n║ Check-out: %-28s ║\n",
            nombreHotel != null ? nombreHotel : "No especificado", 
            tipoHabitacion != null ? tipoHabitacion : "No especificado", 
            numeroHuespedes,
            sdf.format(getFechaInicio()), 
            sdf.format(getFechaFin())
        );
    }
    
    @Override
    public boolean validarDisponibilidad() {
        return Math.random() > 0.2;
    }
    
    @Override
    public String getDetallesEspecificos() {
        return String.format("%s - %s (%d huéspedes)", 
            nombreHotel != null ? nombreHotel : "Hotel", 
            tipoHabitacion != null ? tipoHabitacion : "Habitación", 
            numeroHuespedes);
    }
}