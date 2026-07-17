package com.sebasbotero.supportflow.service;

import com.sebasbotero.supportflow.dto.request.AsignarTicketRequest;
import com.sebasbotero.supportflow.dto.request.CambiarEstadoRequest;
import com.sebasbotero.supportflow.dto.request.CrearTicketRequest;
import com.sebasbotero.supportflow.dto.response.TicketResponse;
import com.sebasbotero.supportflow.dto.response.UsuarioResponse;
import com.sebasbotero.supportflow.entity.Ticket;
import com.sebasbotero.supportflow.entity.Usuario;
import com.sebasbotero.supportflow.entity.enums.Estado;
import com.sebasbotero.supportflow.exception.TicketNoEncontradoException;
import com.sebasbotero.supportflow.exception.TicketVersionConflictException;
import com.sebasbotero.supportflow.exception.TransicionInvalidaException;
import com.sebasbotero.supportflow.repository.TicketRepository;
import com.sebasbotero.supportflow.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UsuarioRepository usuarioRepository;
    private final HistorialEstadoService historialEstadoService;

    // Mapa de transiciones válidas, tomado directamente del diagrama de estados
    private static final Map<Estado, Set<Estado>> TRANSICIONES_VALIDAS = new EnumMap<>(Estado.class);
    static {
        TRANSICIONES_VALIDAS.put(Estado.ABIERTO, EnumSet.of(Estado.EN_PROGRESO));
        TRANSICIONES_VALIDAS.put(Estado.EN_PROGRESO, EnumSet.of(Estado.ESCALADO, Estado.RESUELTO));
        TRANSICIONES_VALIDAS.put(Estado.ESCALADO, EnumSet.of(Estado.EN_PROGRESO));
        TRANSICIONES_VALIDAS.put(Estado.RESUELTO, EnumSet.of(Estado.CERRADO));
        TRANSICIONES_VALIDAS.put(Estado.CERRADO, EnumSet.noneOf(Estado.class));
    }

    public TicketService(TicketRepository ticketRepository,
                          UsuarioRepository usuarioRepository,
                          HistorialEstadoService historialEstadoService) {
        this.ticketRepository = ticketRepository;
        this.usuarioRepository = usuarioRepository;
        this.historialEstadoService = historialEstadoService;
    }

    @Transactional
    public TicketResponse crearTicket(CrearTicketRequest request, Long usuarioReportaId) {
        Usuario usuarioReporta = usuarioRepository.findById(usuarioReportaId)
                .orElseThrow(() -> new TicketNoEncontradoException("Usuario no encontrado: " + usuarioReportaId));

        Ticket ticket = new Ticket();
        ticket.setTitulo(request.titulo());
        ticket.setDescripcion(request.descripcion());
        ticket.setPrioridad(request.prioridad());
        ticket.setUsuarioReporta(usuarioReporta);
        ticket.setEstado(Estado.ABIERTO);

        Ticket guardado = ticketRepository.save(ticket);

        historialEstadoService.registrarCambio(guardado, null, Estado.ABIERTO, usuarioReporta);

        return toResponse(guardado);
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> listarTickets() {
        return ticketRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TicketResponse obtenerTicket(Long id) {
        Ticket ticket = buscarOLanzar(id);
        return toResponse(ticket);
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> ticketsSinAsignar() {
        return ticketRepository.findByUsuarioAsignadoIsNull().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TicketResponse cambiarEstado(Long ticketId, CambiarEstadoRequest request, Long autorId) {
        Ticket ticket = buscarOLanzar(ticketId);

        // Chequeo explícito de versión ANTES de tocar nada
        if (!ticket.getVersion().equals(request.version())) {
            throw new TicketVersionConflictException(
                "El ticket fue modificado por otro usuario. Recarga la información e intenta de nuevo."
            );
        }

        Estado estadoActual = ticket.getEstado();
        Estado estadoNuevo = request.nuevoEstado();

        Set<Estado> permitidos = TRANSICIONES_VALIDAS.get(estadoActual);
        if (permitidos == null || !permitidos.contains(estadoNuevo)) {
            throw new TransicionInvalidaException(
                "No se puede pasar de " + estadoActual + " a " + estadoNuevo
            );
        }

        Usuario autor = usuarioRepository.findById(autorId)
                .orElseThrow(() -> new TicketNoEncontradoException("Usuario no encontrado: " + autorId));

        ticket.setEstado(estadoNuevo);
        Ticket actualizado = ticketRepository.save(ticket);

        historialEstadoService.registrarCambio(actualizado, estadoActual, estadoNuevo, autor);

        return toResponse(actualizado);
    }

    @Transactional
    public TicketResponse asignarTicket(Long ticketId, AsignarTicketRequest request) {
        Ticket ticket = buscarOLanzar(ticketId);

        Usuario agente = usuarioRepository.findById(request.usuarioAsignadoId())
                .orElseThrow(() -> new TicketNoEncontradoException("Agente no encontrado: " + request.usuarioAsignadoId()));

        ticket.setUsuarioAsignado(agente);
        Ticket actualizado = ticketRepository.save(ticket);

        return toResponse(actualizado);
    }

    private Ticket buscarOLanzar(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNoEncontradoException("Ticket no encontrado: " + id));
    }

    private TicketResponse toResponse(Ticket ticket) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getTitulo(),
                ticket.getDescripcion(),
                ticket.getEstado(),
                ticket.getPrioridad(),
                toUsuarioResponse(ticket.getUsuarioReporta()),
                ticket.getUsuarioAsignado() != null ? toUsuarioResponse(ticket.getUsuarioAsignado()) : null,
                ticket.getVersion(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }

    private UsuarioResponse toUsuarioResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol()
        );
    }
}