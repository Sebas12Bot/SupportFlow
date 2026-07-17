package com.sebasbotero.supportflow.service;

import com.sebasbotero.supportflow.dto.response.HistorialEstadoResponse;
import com.sebasbotero.supportflow.entity.HistorialEstado;
import com.sebasbotero.supportflow.entity.Ticket;
import com.sebasbotero.supportflow.entity.Usuario;
import com.sebasbotero.supportflow.entity.enums.Estado;
import com.sebasbotero.supportflow.repository.HistorialEstadoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HistorialEstadoService {

    private final HistorialEstadoRepository historialEstadoRepository;

    public HistorialEstadoService(HistorialEstadoRepository historialEstadoRepository) {
        this.historialEstadoRepository = historialEstadoRepository;
    }

    @Transactional
    public void registrarCambio(Ticket ticket, Estado estadoAnterior, Estado estadoNuevo, Usuario autor) {
        HistorialEstado registro = new HistorialEstado();
        registro.setTicket(ticket);
        registro.setEstadoAnterior(estadoAnterior);
        registro.setEstadoNuevo(estadoNuevo);
        registro.setAutor(autor);

        historialEstadoRepository.save(registro);
    }

    @Transactional(readOnly = true)
    public List<HistorialEstadoResponse> obtenerHistorial(Long ticketId) {
    return historialEstadoRepository.findByTicketIdOrderByFechaCambioAsc(ticketId)
            .stream()
            .map(h -> new HistorialEstadoResponse(
                    h.getId(),
                    h.getEstadoAnterior(),
                    h.getEstadoNuevo(),
                    h.getAutor().getNombre(),
                    h.getFechaCambio()
            ))
            .toList();
}


}