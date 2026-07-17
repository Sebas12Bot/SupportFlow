package com.sebasbotero.supportflow.dto.response;

import com.sebasbotero.supportflow.entity.enums.Role;

public record UsuarioResponse(
    Long id,
    String nombre,
    String email,
    Role rol
) {}