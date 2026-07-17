package com.sebasbotero.supportflow.exception;

public class TicketNoEncontradoException extends RuntimeException {
    public TicketNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}