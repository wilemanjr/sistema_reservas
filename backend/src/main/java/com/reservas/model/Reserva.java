package com.reservas.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_reserva")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "tipo")
@JsonSubTypes({
    @JsonSubTypes.Type(value = ReservaHotel.class, name = "HOTEL"),
    @JsonSubTypes.Type(value = ReservaVuelo.class, name = "VUELO"),
    @JsonSubTypes.Type(value = ReservaRestaurante.class, name = "RESTAURANTE")
})
public abstract class Reserva {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long idUsuario;
    private String cliente;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaReserva = new Date();
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaInicio;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaFin;
    
    private Double precioBase;
    private String estado = "PENDIENTE";
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    
    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }
    
    public Date getFechaReserva() { return fechaReserva; }
    public void setFechaReserva(Date fechaReserva) { this.fechaReserva = fechaReserva; }
    
    public Date getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(Date fechaInicio) { this.fechaInicio = fechaInicio; }
    
    public Date getFechaFin() { return fechaFin; }
    public void setFechaFin(Date fechaFin) { this.fechaFin = fechaFin; }
    
    public Double getPrecioBase() { return precioBase; }
    public void setPrecioBase(Double precioBase) { this.precioBase = precioBase; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    
    // Abstract methods - Patrón Abstract Method
    public abstract String getTipoReserva();
    public abstract Double calcularPrecioTotal();
    public abstract String generarVoucher();
    public abstract boolean validarDisponibilidad();
    public abstract String getDetallesEspecificos();
    
    // Template Method
    public String procesarReserva() {
        StringBuilder proceso = new StringBuilder();
        proceso.append("╔══════════════════════════════════════════╗\n");
        proceso.append("║     PROCESANDO RESERVA                   ║\n");
        proceso.append("╠══════════════════════════════════════════╣\n");
        proceso.append("║ Tipo: ").append(String.format("%-33s", getTipoReserva())).append("║\n");
        proceso.append("║ Cliente: ").append(String.format("%-31s", cliente)).append("║\n");
        proceso.append("╠══════════════════════════════════════════╣\n");
        proceso.append("║ Verificando disponibilidad...            ║\n");
        
        if (validarDisponibilidad()) {
            proceso.append("║ ✅ Disponibilidad confirmada              ║\n");
            Double total = calcularPrecioTotal();
            proceso.append("║ 💰 Precio total: $").append(String.format("%-20.2f", total)).append("║\n");
            proceso.append("╠══════════════════════════════════════════╣\n");
            proceso.append("║           VOUCHER DE RESERVA             ║\n");
            proceso.append("╠══════════════════════════════════════════╣\n");
            proceso.append(generarVoucher());
            this.estado = "CONFIRMADA";
            proceso.append("╠══════════════════════════════════════════╣\n");
            proceso.append("║ ✅ RESERVA CONFIRMADA                     ║\n");
        } else {
            proceso.append("║ ❌ Sin disponibilidad                     ║\n");
            this.estado = "CANCELADA";
        }
        proceso.append("╚══════════════════════════════════════════╝");
        
        return proceso.toString();
    }
}