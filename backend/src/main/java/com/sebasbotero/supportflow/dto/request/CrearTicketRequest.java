package com.sebasbotero.supportflow.dto.request;

import com.sebasbotero.supportflow.entity.enums.Prioridad;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CrearTicketRequest(
    @NotBlank(message = "El título es obligatorio")
    String titulo,

    String descripcion,

    @NotNull(message = "La prioridad es obligatoria")
    Prioridad prioridad
) {}