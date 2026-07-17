package com.sebasbotero.supportflow.service;

import com.sebasbotero.supportflow.dto.request.CambiarEstadoRequest;
import com.sebasbotero.supportflow.entity.Ticket;
import com.sebasbotero.supportflow.entity.Usuario;
import com.sebasbotero.supportflow.entity.enums.Estado;
import com.sebasbotero.supportflow.entity.enums.Role;
import com.sebasbotero.supportflow.exception.TicketNoEncontradoException;
import com.sebasbotero.supportflow.exception.TicketVersionConflictException;
import com.sebasbotero.supportflow.exception.TransicionInvalidaException;
import com.sebasbotero.supportflow.repository.TicketRepository;
import com.sebasbotero.supportflow.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private HistorialEstadoService historialEstadoService;

    @InjectMocks
    private TicketService ticketService;

    private Ticket ticketDePrueba;
    private Usuario usuarioDePrueba;

    @BeforeEach
    void setUp() {
        usuarioDePrueba = new Usuario();
        usuarioDePrueba.setId(1L);
        usuarioDePrueba.setNombre("Agente Uno");
        usuarioDePrueba.setEmail("agente1@test.com");
        usuarioDePrueba.setRol(Role.AGENTE);

        ticketDePrueba = new Ticket();
        ticketDePrueba.setId(1L);
        ticketDePrueba.setTitulo("Error de login");
        ticketDePrueba.setEstado(Estado.ABIERTO);
        ticketDePrueba.setVersion(0L);
        ticketDePrueba.setCreatedAt(LocalDateTime.now());
        ticketDePrueba.setUsuarioReporta(usuarioDePrueba);
    }

    @Test
    void deberiaPermitirTransicionDeAbiertoAEnProgreso() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticketDePrueba));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioDePrueba));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticketDePrueba);

        CambiarEstadoRequest request = new CambiarEstadoRequest(Estado.EN_PROGRESO, 0L);

        var response = ticketService.cambiarEstado(1L, request, 1L);

        assertThat(response.estado()).isEqualTo(Estado.EN_PROGRESO);
    }

    @Test
    void deberiaRechazarTransicionDeAbiertoARespuelto() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticketDePrueba));

        CambiarEstadoRequest request = new CambiarEstadoRequest(Estado.RESUELTO, 0L);

        assertThatThrownBy(() -> ticketService.cambiarEstado(1L, request, 1L))
                .isInstanceOf(TransicionInvalidaException.class)
                .hasMessageContaining("No se puede pasar de ABIERTO a RESUELTO");
    }

    @Test
    void deberiaRechazarTransicionDesdeCerrado() {
        ticketDePrueba.setEstado(Estado.CERRADO);
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticketDePrueba));

        CambiarEstadoRequest request = new CambiarEstadoRequest(Estado.EN_PROGRESO, 0L);

        assertThatThrownBy(() -> ticketService.cambiarEstado(1L, request, 1L))
                .isInstanceOf(TransicionInvalidaException.class);
    }

    @Test
    void deberiaRechazarCambioConVersionDesactualizada() {
        ticketDePrueba.setVersion(3L); // la BD "real" ya está en version 3
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticketDePrueba));

        CambiarEstadoRequest request = new CambiarEstadoRequest(Estado.EN_PROGRESO, 0L);

        assertThatThrownBy(() -> ticketService.cambiarEstado(1L, request, 1L))
                .isInstanceOf(TicketVersionConflictException.class)
                .hasMessageContaining("modificado por otro usuario");
    }

    @Test
    void deberiaLanzarExcepcionSiElTicketNoExiste() {
        when(ticketRepository.findById(99L)).thenReturn(Optional.empty());

        CambiarEstadoRequest request = new CambiarEstadoRequest(Estado.EN_PROGRESO, 0L);

        assertThatThrownBy(() -> ticketService.cambiarEstado(99L, request, 1L))
                .isInstanceOf(TicketNoEncontradoException.class);
    }
}