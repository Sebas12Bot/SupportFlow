package com.sebasbotero.supportflow.exception;

public class TicketVersionConflictException extends RuntimeException {
    public TicketVersionConflictException(String mensaje) {
        super(mensaje);
    }
}