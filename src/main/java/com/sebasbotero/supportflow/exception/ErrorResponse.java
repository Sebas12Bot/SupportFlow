package com.sebasbotero.supportflow.exception;

import java.time.LocalDateTime;

public record ErrorResponse(
    LocalDateTime timestamp,
    int status,
    String mensaje
) {}