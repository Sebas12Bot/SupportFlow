package com.sebasbotero.supportflow.dto.response;

import com.sebasbotero.supportflow.entity.enums.Estado;
import com.sebasbotero.supportflow.entity.enums.Prioridad;

import java.time.LocalDateTime;

public record TicketResponse(
    Long id,
    String titulo,
    String descripcion,
    Estado estado,
    Prioridad prioridad,
    UsuarioResponse usuarioReporta,
    UsuarioResponse usuarioAsignado,
    Long version,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}