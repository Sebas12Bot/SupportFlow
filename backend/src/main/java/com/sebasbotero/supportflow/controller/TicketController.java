package com.sebasbotero.supportflow.controller;

import com.sebasbotero.supportflow.dto.request.AsignarTicketRequest;
import com.sebasbotero.supportflow.dto.request.CambiarEstadoRequest;
import com.sebasbotero.supportflow.dto.request.CrearTicketRequest;
import com.sebasbotero.supportflow.dto.response.HistorialEstadoResponse;
import com.sebasbotero.supportflow.dto.response.TicketResponse;
import com.sebasbotero.supportflow.entity.Usuario;
import com.sebasbotero.supportflow.exception.TicketNoEncontradoException;
import com.sebasbotero.supportflow.repository.UsuarioRepository;
import com.sebasbotero.supportflow.service.HistorialEstadoService;
import com.sebasbotero.supportflow.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@Tag(name = "Tickets", description = "Gestión de tickets de soporte")
public class TicketController {

    private final TicketService ticketService;
    private final HistorialEstadoService historialEstadoService;
    private final UsuarioRepository usuarioRepository;

    public TicketController(TicketService ticketService,
                             HistorialEstadoService historialEstadoService,
                             UsuarioRepository usuarioRepository) {
        this.ticketService = ticketService;
        this.historialEstadoService = historialEstadoService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo ticket", description = "Permite a un usuario autenticado crear un ticket de soporte")
    public ResponseEntity<TicketResponse> crearTicket(
            @Valid @RequestBody CrearTicketRequest request,
            Authentication authentication) {
        Long usuarioId = idDelUsuarioAutenticado(authentication);
        TicketResponse response = ticketService.crearTicket(request, usuarioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Listar todos los tickets", description = "Devuelve la lista completa de tickets registrados")
    public ResponseEntity<List<TicketResponse>> listarTickets() {
        return ResponseEntity.ok(ticketService.listarTickets());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un ticket por ID", description = "Devuelve el detalle de un ticket específico")
    public ResponseEntity<TicketResponse> obtenerTicket(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.obtenerTicket(id));
    }

    @GetMapping("/sin-asignar")
    @Operation(summary = "Listar tickets sin asignar", description = "Devuelve los tickets que aún no tienen agente asignado")
    public ResponseEntity<List<TicketResponse>> ticketsSinAsignar() {
        return ResponseEntity.ok(ticketService.ticketsSinAsignar());
    }

    @GetMapping("/{id}/historial")
    @Operation(summary = "Obtener historial de estados", description = "Devuelve el historial de cambios de estado de un ticket")
    public ResponseEntity<List<HistorialEstadoResponse>> obtenerHistorial(@PathVariable Long id) {
        return ResponseEntity.ok(historialEstadoService.obtenerHistorial(id));
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar el estado de un ticket",
               description = "Valida transiciones permitidas y aplica optimistic locking mediante el campo version")
    public ResponseEntity<TicketResponse> cambiarEstado(
            @PathVariable Long id,
            @Valid @RequestBody CambiarEstadoRequest request,
            Authentication authentication) {
        Long autorId = idDelUsuarioAutenticado(authentication);
        TicketResponse response = ticketService.cambiarEstado(id, request, autorId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/asignar")
    @Operation(summary = "Asignar un ticket a un agente", description = "Permite asignar un ticket a un agente específico")
    public ResponseEntity<TicketResponse> asignarTicket(
            @PathVariable Long id,
            @Valid @RequestBody AsignarTicketRequest request) {
        TicketResponse response = ticketService.asignarTicket(id, request);
        return ResponseEntity.ok(response);
    }

    private Long idDelUsuarioAutenticado(Authentication authentication) {
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new TicketNoEncontradoException("Usuario autenticado no encontrado"));
        return usuario.getId();
    }
}