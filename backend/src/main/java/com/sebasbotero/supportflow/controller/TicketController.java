

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

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
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
    public ResponseEntity<TicketResponse> crearTicket(
            @Valid @RequestBody CrearTicketRequest request,
            Authentication authentication) {
        Long usuarioId = idDelUsuarioAutenticado(authentication);
        TicketResponse response = ticketService.crearTicket(request, usuarioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TicketResponse>> listarTickets() {
        return ResponseEntity.ok(ticketService.listarTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> obtenerTicket(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.obtenerTicket(id));
    }

    @GetMapping("/sin-asignar")
    public ResponseEntity<List<TicketResponse>> ticketsSinAsignar() {
        return ResponseEntity.ok(ticketService.ticketsSinAsignar());
    }

    @GetMapping("/{id}/historial")
    public ResponseEntity<List<HistorialEstadoResponse>> obtenerHistorial(@PathVariable Long id) {
        return ResponseEntity.ok(historialEstadoService.obtenerHistorial(id));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<TicketResponse> cambiarEstado(
            @PathVariable Long id,
            @Valid @RequestBody CambiarEstadoRequest request,
            Authentication authentication) {
        Long autorId = idDelUsuarioAutenticado(authentication);
        TicketResponse response = ticketService.cambiarEstado(id, request, autorId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/asignar")
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