package com.sebasbotero.supportflow.dto.request;

import jakarta.validation.constraints.NotNull;

public record AsignarTicketRequest(
    @NotNull(message = "El id del agente es obligatorio")
    Long usuarioAsignadoId
) {}