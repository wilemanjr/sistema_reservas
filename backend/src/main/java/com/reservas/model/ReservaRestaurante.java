package com.reservas.model;

import java.text.SimpleDateFormat;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("RESTAURANTE")
public class ReservaRestaurante extends Reserva {
    
    private String nombreRestaurante;
    private int numeroPersonas;
    private String tipoMesa;
    private String ocasEspecial;
    private boolean requiereMenuInfantil;
    private String restriccionesAlimenticias;
    
    // Getters y Setters
    public String getNombreRestaurante() { return nombreRestaurante; }
    public void setNombreRestaurante(String nombreRestaurante) { this.nombreRestaurante = nombreRestaurante; }
    
    public int getNumeroPersonas() { return numeroPersonas; }
    public void setNumeroPersonas(int numeroPersonas) { this.numeroPersonas = numeroPersonas; }
    
    public String getTipoMesa() { return tipoMesa; }
    public void setTipoMesa(String tipoMesa) { this.tipoMesa = tipoMesa; }
    
    public String getOcasEspecial() { return ocasEspecial; }
    public void setOcasEspecial(String ocasEspecial) { this.ocasEspecial = ocasEspecial; }
    
    public boolean isRequiereMenuInfantil() { return requiereMenuInfantil; }
    public void setRequiereMenuInfantil(boolean requiereMenuInfantil) { this.requiereMenuInfantil = requiereMenuInfantil; }
    
    public String getRestriccionesAlimenticias() { return restriccionesAlimenticias; }
    public void setRestriccionesAlimenticias(String restriccionesAlimenticias) { this.restriccionesAlimenticias = restriccionesAlimenticias; }
    
    @Override
    public String getTipoReserva() {
        return "RESTAURANTE";
    }
    
    @Override
    public Double calcularPrecioTotal() {
        double precioPorPersona = getPrecioBase();
        
        if (tipoMesa != null) {
            switch(tipoMesa) {
                case "VIP" -> precioPorPersona *= 2.0;
                case "TERRAZA" -> precioPorPersona *= 1.3;
            }
        }
        
        double total = precioPorPersona * numeroPersonas;
        
        if (ocasEspecial != null && !ocasEspecial.equals("NINGUNA")) {
            total += 50;
        }
        
        if (numeroPersonas > 8) {
            total *= 0.9;
        }
        
        return total;
    }
    
    @Override
    public String generarVoucher() {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");
        String ocasionStr = (ocasEspecial != null && ocasEspecial.equals("NINGUNA")) ? "Ninguna" : 
                            (ocasEspecial != null ? ocasEspecial : "Ninguna");
        return String.format(
            "║ Restaurante: %-26s ║\n║ Fecha: %-31s ║\n║ Personas: %-28d ║\n║ Mesa: %-32s ║\n║ Ocasión: %-29s ║\n",
            nombreRestaurante != null ? nombreRestaurante : "No especificado", 
            sdf.format(getFechaInicio()), 
            numeroPersonas,
            tipoMesa != null ? tipoMesa : "Interior",
            ocasionStr
        );
    }
    
    @Override
    public boolean validarDisponibilidad() {
        return Math.random() > 0.4;
    }
    
    @Override
    public String getDetallesEspecificos() {
        return String.format("%s - %d personas (Mesa: %s)%s",
            nombreRestaurante != null ? nombreRestaurante : "Restaurante", 
            numeroPersonas, 
            tipoMesa != null ? tipoMesa : "Interior",
            (ocasEspecial != null && !ocasEspecial.equals("NINGUNA")) ? " (" + ocasEspecial + ")" : "");
    }
}
