package com.reservas.model;

import java.text.SimpleDateFormat;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("VUELO")
public class ReservaVuelo extends Reserva {
    
    private String aerolinea;
    private String numeroVuelo;
    private String origen;
    private String destino;
    private String clase;
    private int numPasajeros;
    private boolean idaVuelta;
    
    // Getters y Setters
    public String getAerolinea() { return aerolinea; }
    public void setAerolinea(String aerolinea) { this.aerolinea = aerolinea; }
    
    public String getNumeroVuelo() { return numeroVuelo; }
    public void setNumeroVuelo(String numeroVuelo) { this.numeroVuelo = numeroVuelo; }
    
    public String getOrigen() { return origen; }
    public void setOrigen(String origen) { this.origen = origen; }
    
    public String getDestino() { return destino; }
    public void setDestino(String destino) { this.destino = destino; }
    
    public String getClase() { return clase; }
    public void setClase(String clase) { this.clase = clase; }
    
    public int getNumPasajeros() { return numPasajeros; }
    public void setNumPasajeros(int numPasajeros) { this.numPasajeros = numPasajeros; }
    
    public boolean isIdaVuelta() { return idaVuelta; }
    public void setIdaVuelta(boolean idaVuelta) { this.idaVuelta = idaVuelta; }
    
    @Override
    public String getTipoReserva() {
        return "VUELO";
    }
    
    @Override
    public Double calcularPrecioTotal() {
        double precioPorPasajero = getPrecioBase();
        
        if (clase != null) {
            switch(clase) {
                case "EJECUTIVA" -> precioPorPasajero *= 2.0;
                case "PRIMERA" -> precioPorPasajero *= 3.5;
            }
        }
        
        double total = precioPorPasajero * numPasajeros;
        
        if (idaVuelta) {
            total *= 1.8;
        }
        
        return total;
    }
    
    @Override
    public String generarVoucher() {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");
        return String.format(
            "║ Aerolínea: %-28s ║\n║ Vuelo: %-31s ║\n║ Origen: %-30s ║\n║ Destino: %-29s ║\n║ Fecha: %-31s ║\n",
            aerolinea != null ? aerolinea : "No especificada", 
            numeroVuelo != null ? numeroVuelo : "No especificado", 
            origen != null ? origen : "No especificado", 
            destino != null ? destino : "No especificado",
            sdf.format(getFechaInicio())
        );
    }
    
    @Override
    public boolean validarDisponibilidad() {
        return Math.random() > 0.3;
    }
    
    @Override
    public String getDetallesEspecificos() {
        return String.format("%s %s: %s → %s (%d pasajeros)%s", 
            aerolinea != null ? aerolinea : "Aerolínea", 
            numeroVuelo != null ? numeroVuelo : "Vuelo", 
            origen != null ? origen : "Origen", 
            destino != null ? destino : "Destino", 
            numPasajeros,
            idaVuelta ? " (Ida y vuelta)" : "");
    }
}