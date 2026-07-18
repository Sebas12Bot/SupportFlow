package com.sebasbotero.supportflow.service;

import com.sebasbotero.supportflow.dto.request.ActualizarPerfilRequest;
import com.sebasbotero.supportflow.dto.request.CambiarPasswordRequest;
import com.sebasbotero.supportflow.dto.response.UsuarioResponse;
import com.sebasbotero.supportflow.entity.Usuario;
import com.sebasbotero.supportflow.exception.PasswordActualIncorrectaException;
import com.sebasbotero.supportflow.exception.TicketNoEncontradoException;
import com.sebasbotero.supportflow.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obtenerPerfil(Long usuarioId) {
        Usuario usuario = buscarOLanzar(usuarioId);
        return toResponse(usuario);
    }

    @Transactional
    public UsuarioResponse actualizarPerfil(Long usuarioId, ActualizarPerfilRequest request) {
        Usuario usuario = buscarOLanzar(usuarioId);
        usuario.setNombre(request.nombre());
        return toResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    public void cambiarPassword(Long usuarioId, CambiarPasswordRequest request) {
        Usuario usuario = buscarOLanzar(usuarioId);

        if (!passwordEncoder.matches(request.passwordActual(), usuario.getPassword())) {
            throw new PasswordActualIncorrectaException("La contraseña actual no es correcta");
        }

        usuario.setPassword(passwordEncoder.encode(request.passwordNueva()));
        usuarioRepository.save(usuario);
    }

    private Usuario buscarOLanzar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new TicketNoEncontradoException("Usuario no encontrado: " + id));
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol());
    }
}