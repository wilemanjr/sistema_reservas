package com.reservas.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reservas.model.Reserva;
import com.reservas.model.ReservaHotel;
import com.reservas.model.ReservaRestaurante;
import com.reservas.model.ReservaVuelo;
import com.reservas.repository.ReservaRepository;

@RestController
@RequestMapping("/reservas")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservaController {
    
    private static final Logger logger = LoggerFactory.getLogger(ReservaController.class);

    @Autowired
    private ReservaRepository reservaRepository;
    
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    private final SimpleDateFormat dateTimeFormatISO = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
    
    @PostMapping("/hotel")
    public ResponseEntity<?> crearReservaHotel(@RequestBody Map<String, Object> data) {
        try {
            ReservaHotel reserva = new ReservaHotel();
            reserva.setIdUsuario(Long.valueOf(data.get("idUsuario").toString()));
            reserva.setCliente((String) data.get("cliente"));
            
            String fechaInicioStr = (String) data.get("fechaInicio");
            String fechaFinStr = (String) data.get("fechaFin");
            reserva.setFechaInicio(dateFormat.parse(fechaInicioStr));
            reserva.setFechaFin(dateFormat.parse(fechaFinStr));
            
            reserva.setPrecioBase(Double.valueOf(data.get("precioBase").toString()));
            reserva.setNombreHotel((String) data.get("nombreHotel"));
            reserva.setTipoHabitacion((String) data.get("tipoHabitacion"));
            reserva.setNumeroHuespedes(Integer.parseInt(data.get("numeroHuespedes").toString()));
            reserva.setIncluyeDesayuno((Boolean) data.get("incluyeDesayuno"));
            reserva.setIncluyeEstacionamiento((Boolean) data.get("incluyeEstacionamiento"));
            
            String resultado = reserva.procesarReserva();
            Reserva saved = reservaRepository.save(reserva);
            
            Map<String, Object> response = new HashMap<>();
            response.put("reserva", saved);
            response.put("resultado", resultado);
            response.put("mensaje", "Reserva de hotel creada exitosamente");
            
            return ResponseEntity.ok(response);

        } catch (ParseException e) {
            logger.error("Error al parsear fechas en reserva de hotel", e);
            return ResponseEntity.badRequest().body(Map.of("error", "Error en formato de fecha: " + e.getMessage()));

        } catch (NumberFormatException e) {
            logger.error("Error en formato numérico en reserva de hotel", e);
            return ResponseEntity.badRequest().body(Map.of("error", "Error en formato numérico: " + e.getMessage()));

        } catch (Exception e) {
            logger.error("Error al crear reserva de hotel", e);
            return ResponseEntity.badRequest().body(Map.of("error", "Error al crear reserva: " + e.getMessage()));
        }
    }
    
    @PostMapping("/vuelo")
    public ResponseEntity<?> crearReservaVuelo(@RequestBody Map<String, Object> data) {
        try {
            logger.info("=== DATOS VUELO RECIBIDOS === {}", data);
            
            ReservaVuelo reserva = new ReservaVuelo();
            reserva.setIdUsuario(Long.valueOf(data.get("idUsuario").toString()));
            reserva.setCliente((String) data.get("cliente"));
            
            String fechaStr = (String) data.get("fechaInicio");
            Date fechaInicio = dateTimeFormatISO.parse(fechaStr);
            reserva.setFechaInicio(fechaInicio);
            
            reserva.setPrecioBase(Double.valueOf(data.get("precioBase").toString()));
            reserva.setAerolinea((String) data.get("aerolinea"));
            reserva.setNumeroVuelo((String) data.get("numeroVuelo"));
            reserva.setOrigen((String) data.get("origen"));
            reserva.setDestino((String) data.get("destino"));
            reserva.setClase((String) data.get("clase"));
            reserva.setNumPasajeros(Integer.parseInt(data.get("numPasajeros").toString()));
            reserva.setIdaVuelta((Boolean) data.get("idaVuelta"));
            
            if ((Boolean) data.get("idaVuelta") && data.get("fechaFin") != null && !data.get("fechaFin").toString().isEmpty()) {
                String fechaFinStr = (String) data.get("fechaFin");
                Date fechaFin = dateTimeFormatISO.parse(fechaFinStr);
                reserva.setFechaFin(fechaFin);
            }
            
            String resultado = reserva.procesarReserva();
            Reserva saved = reservaRepository.save(reserva);
            
            Map<String, Object> response = new HashMap<>();
            response.put("reserva", saved);
            response.put("resultado", resultado);
            response.put("mensaje", "Reserva de vuelo creada exitosamente");
            
            return ResponseEntity.ok(response);

        } catch (ParseException e) {
            logger.error("Error al parsear fechas en reserva de vuelo", e);
            return ResponseEntity.badRequest().body(Map.of("error", "Error en formato de fecha: " + e.getMessage()));

        } catch (NumberFormatException e) {
            logger.error("Error en formato numérico en reserva de vuelo", e);
            return ResponseEntity.badRequest().body(Map.of("error", "Error en formato numérico: " + e.getMessage()));

        } catch (Exception e) {
            logger.error("Error al crear reserva de vuelo", e);
            return ResponseEntity.badRequest().body(Map.of("error", "Error al crear reserva: " + e.getMessage()));
        }
    }
    
    @PostMapping("/restaurante")
    public ResponseEntity<?> crearReservaRestaurante(@RequestBody Map<String, Object> data) {
        try {
            logger.info("=== DATOS RESTAURANTE RECIBIDOS === {}", data);
            
            ReservaRestaurante reserva = new ReservaRestaurante();
            reserva.setIdUsuario(Long.valueOf(data.get("idUsuario").toString()));
            reserva.setCliente((String) data.get("cliente"));
            
            String fechaStr = (String) data.get("fechaInicio");
            Date fechaInicio = dateTimeFormatISO.parse(fechaStr);
            reserva.setFechaInicio(fechaInicio);
            
            // Fecha fin = fecha inicio + 2 horas
            reserva.setFechaFin(new Date(fechaInicio.getTime() + 2 * 60 * 60 * 1000));
            
            reserva.setPrecioBase(Double.valueOf(data.get("precioBase").toString()));
            reserva.setNombreRestaurante((String) data.get("nombreRestaurante"));
            reserva.setNumeroPersonas(Integer.parseInt(data.get("numeroPersonas").toString()));
            reserva.setTipoMesa((String) data.get("tipoMesa"));
            reserva.setOcasEspecial((String) data.get("ocasEspecial"));
            reserva.setRequiereMenuInfantil((Boolean) data.get("requiereMenuInfantil"));
            
            String restricciones = data.get("restriccionesAlimenticias") != null
                    ? (String) data.get("restriccionesAlimenticias")
                    : "";
            reserva.setRestriccionesAlimenticias(restricciones);
            
            String resultado = reserva.procesarReserva();
            Reserva saved = reservaRepository.save(reserva);
            
            Map<String, Object> response = new HashMap<>();
            response.put("reserva", saved);
            response.put("resultado", resultado);
            response.put("mensaje", "Reserva de restaurante creada exitosamente");
            
            return ResponseEntity.ok(response);

        } catch (ParseException e) {
            logger.error("Error al parsear fechas en reserva de restaurante", e);
            return ResponseEntity.badRequest().body(Map.of("error", "Error en formato de fecha: " + e.getMessage()));

        } catch (NumberFormatException e) {
            logger.error("Error en formato numérico en reserva de restaurante", e);
            return ResponseEntity.badRequest().body(Map.of("error", "Error en formato numérico: " + e.getMessage()));

        } catch (Exception e) {
            logger.error("Error al crear reserva de restaurante", e);
            return ResponseEntity.badRequest().body(Map.of("error", "Error al crear reserva: " + e.getMessage()));
        }
    }
    
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Reserva>> getReservasByUsuario(@PathVariable("idUsuario") Long idUsuario) {
        List<Reserva> reservas = reservaRepository.findByIdUsuario(idUsuario);
        return ResponseEntity.ok(reservas);
    }
    
    @PostMapping("/clonar/{id}")
    public ResponseEntity<?> clonarReserva(@PathVariable("id") Long id) {
        try {
            Reserva original = reservaRepository.findById(id).orElse(null);

            if (original == null) {
                return ResponseEntity.notFound().build();
            }
            
            Reserva clon = switch (original) {
                case ReservaHotel originalHotel -> {
                    ReservaHotel clonHotel = new ReservaHotel();
                    clonHotel.setIdUsuario(originalHotel.getIdUsuario());
                    clonHotel.setCliente(originalHotel.getCliente());
                    clonHotel.setFechaInicio(originalHotel.getFechaInicio());
                    clonHotel.setFechaFin(originalHotel.getFechaFin());
                    clonHotel.setPrecioBase(originalHotel.getPrecioBase());
                    clonHotel.setNombreHotel(originalHotel.getNombreHotel());
                    clonHotel.setTipoHabitacion(originalHotel.getTipoHabitacion());
                    clonHotel.setNumeroHuespedes(originalHotel.getNumeroHuespedes());
                    clonHotel.setIncluyeDesayuno(originalHotel.isIncluyeDesayuno());
                    clonHotel.setIncluyeEstacionamiento(originalHotel.isIncluyeEstacionamiento());
                    yield clonHotel;
                }
                case ReservaVuelo originalVuelo -> {
                    ReservaVuelo clonVuelo = new ReservaVuelo();
                    clonVuelo.setIdUsuario(originalVuelo.getIdUsuario());
                    clonVuelo.setCliente(originalVuelo.getCliente());
                    clonVuelo.setFechaInicio(originalVuelo.getFechaInicio());
                    clonVuelo.setFechaFin(originalVuelo.getFechaFin());
                    clonVuelo.setPrecioBase(originalVuelo.getPrecioBase());
                    clonVuelo.setAerolinea(originalVuelo.getAerolinea());
                    clonVuelo.setNumeroVuelo(originalVuelo.getNumeroVuelo());
                    clonVuelo.setOrigen(originalVuelo.getOrigen());
                    clonVuelo.setDestino(originalVuelo.getDestino());
                    clonVuelo.setClase(originalVuelo.getClase());
                    clonVuelo.setNumPasajeros(originalVuelo.getNumPasajeros());
                    clonVuelo.setIdaVuelta(originalVuelo.isIdaVuelta());
                    yield clonVuelo;
                }
                case ReservaRestaurante originalRest -> {
                    ReservaRestaurante clonRest = new ReservaRestaurante();
                    clonRest.setIdUsuario(originalRest.getIdUsuario());
                    clonRest.setCliente(originalRest.getCliente());
                    clonRest.setFechaInicio(originalRest.getFechaInicio());
                    clonRest.setFechaFin(originalRest.getFechaFin());
                    clonRest.setPrecioBase(originalRest.getPrecioBase());
                    clonRest.setNombreRestaurante(originalRest.getNombreRestaurante());
                    clonRest.setNumeroPersonas(originalRest.getNumeroPersonas());
                    clonRest.setTipoMesa(originalRest.getTipoMesa());
                    clonRest.setOcasEspecial(originalRest.getOcasEspecial());
                    clonRest.setRequiereMenuInfantil(originalRest.isRequiereMenuInfantil());
                    clonRest.setRestriccionesAlimenticias(originalRest.getRestriccionesAlimenticias());
                    yield clonRest;
                }
                default -> null;
            };
            
            if (clon != null) {
                clon.setId(null);
                clon.setEstado("PENDIENTE");
                clon.setFechaReserva(new Date());
                Reserva saved = reservaRepository.save(clon);
                return ResponseEntity.ok(saved);
            }
            
            return ResponseEntity.badRequest().body(Map.of("error", "No se pudo clonar la reserva"));

        } catch (Exception e) {
            logger.error("Error al clonar reserva con id {}", id, e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
