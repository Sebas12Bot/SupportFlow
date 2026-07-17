package com.sebasbotero.supportflow.dto.response;

import com.sebasbotero.supportflow.entity.enums.Estado;

import java.time.LocalDateTime;

public record HistorialEstadoResponse(
    Long id,
    Estado estadoAnterior,
    Estado estadoNuevo,
    String autorNombre,
    LocalDateTime fechaCambio
) {}