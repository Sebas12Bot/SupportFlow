package com.sebasbotero.supportflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CambiarPasswordRequest(
    @NotBlank(message = "Debes ingresar tu contraseña actual")
    String passwordActual,

    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Size(min = 8, message = "La nueva contraseña debe tener al menos 8 caracteres")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
        message = "La nueva contraseña debe incluir mayúscula, minúscula y número"
    )
    String passwordNueva
) {}