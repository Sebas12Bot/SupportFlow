package com.sebasbotero.supportflow.dto.response;

public record AuthResponse(
    String token,
    UsuarioResponse usuario
) {}