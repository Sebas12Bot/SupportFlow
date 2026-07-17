package com.sebasbotero.supportflow.service;

import com.sebasbotero.supportflow.dto.request.LoginRequest;
import com.sebasbotero.supportflow.dto.request.RegistroRequest;
import com.sebasbotero.supportflow.dto.response.AuthResponse;
import com.sebasbotero.supportflow.dto.response.UsuarioResponse;
import com.sebasbotero.supportflow.entity.Usuario;
import com.sebasbotero.supportflow.entity.enums.Role;
import com.sebasbotero.supportflow.exception.CredencialesInvalidasException;
import com.sebasbotero.supportflow.exception.EmailYaRegistradoException;
import com.sebasbotero.supportflow.repository.UsuarioRepository;
import com.sebasbotero.supportflow.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final String codigoInvitacionAgente;

    public AuthService(UsuarioRepository usuarioRepository,
                        PasswordEncoder passwordEncoder,
                        JwtUtil jwtUtil,
                        @Value("${app.codigo-invitacion-agente}") String codigoInvitacionAgente) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.codigoInvitacionAgente = codigoInvitacionAgente;
    }

    @Transactional
    public AuthResponse registrar(RegistroRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new EmailYaRegistradoException("Ya existe una cuenta con este email");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.nombre());
        usuario.setEmail(request.email());
        usuario.setPassword(passwordEncoder.encode(request.password()));

        boolean esAgente = StringUtils.hasText(request.codigoInvitacion())
                && request.codigoInvitacion().equals(codigoInvitacionAgente);

        usuario.setRol(esAgente ? Role.AGENTE : Role.USUARIO);

        Usuario guardado = usuarioRepository.save(usuario);

        String token = jwtUtil.generarToken(guardado.getEmail(), guardado.getRol().name());

        return new AuthResponse(token, toUsuarioResponse(guardado));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new CredencialesInvalidasException("Email o contraseña incorrectos"));

        if (!passwordEncoder.matches(request.password(), usuario.getPassword())) {
            throw new CredencialesInvalidasException("Email o contraseña incorrectos");
        }

        String token = jwtUtil.generarToken(usuario.getEmail(), usuario.getRol().name());

        return new AuthResponse(token, toUsuarioResponse(usuario));
    }

    private UsuarioResponse toUsuarioResponse(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol());
    }
}