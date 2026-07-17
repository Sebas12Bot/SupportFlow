package com.sebasbotero.supportflow.dto.request;

import com.sebasbotero.supportflow.entity.enums.Estado;
import jakarta.validation.constraints.NotNull;

public record CambiarEstadoRequest(
    @NotNull(message = "El nuevo estado es obligatorio")
    Estado nuevoEstado,

    @NotNull(message = "La versión es obligatoria para detectar conflictos")
    Long version
) {}