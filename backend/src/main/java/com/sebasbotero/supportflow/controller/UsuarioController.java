package com.sebasbotero.supportflow.controller;

import com.sebasbotero.supportflow.dto.request.ActualizarPerfilRequest;
import com.sebasbotero.supportflow.dto.request.CambiarPasswordRequest;
import com.sebasbotero.supportflow.dto.response.UsuarioResponse;
import com.sebasbotero.supportflow.entity.Usuario;
import com.sebasbotero.supportflow.exception.TicketNoEncontradoException;
import com.sebasbotero.supportflow.repository.UsuarioRepository;
import com.sebasbotero.supportflow.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> obtenerPerfil(Authentication authentication) {
        return ResponseEntity.ok(usuarioService.obtenerPerfil(idDelUsuarioAutenticado(authentication)));
    }

    @PatchMapping("/me")
    public ResponseEntity<UsuarioResponse> actualizarPerfil(
            @Valid @RequestBody ActualizarPerfilRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(usuarioService.actualizarPerfil(idDelUsuarioAutenticado(authentication), request));
    }

    @PatchMapping("/me/password")
    public ResponseEntity<Void> cambiarPassword(
            @Valid @RequestBody CambiarPasswordRequest request,
            Authentication authentication) {
        usuarioService.cambiarPassword(idDelUsuarioAutenticado(authentication), request);
        return ResponseEntity.noContent().build();
    }

    private Long idDelUsuarioAutenticado(Authentication authentication) {
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new TicketNoEncontradoException("Usuario autenticado no encontrado"));
        return usuario.getId();
    }
}