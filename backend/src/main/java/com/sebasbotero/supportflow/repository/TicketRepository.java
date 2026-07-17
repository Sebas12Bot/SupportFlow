package com.sebasbotero.supportflow.repository;

import com.sebasbotero.supportflow.entity.Ticket;
import com.sebasbotero.supportflow.entity.enums.Estado;
import com.sebasbotero.supportflow.entity.enums.Prioridad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByEstado(Estado estado);

    List<Ticket> findByPrioridad(Prioridad prioridad);

    List<Ticket> findByUsuarioAsignadoId(Long usuarioAsignadoId);

    List<Ticket> findByUsuarioReportaId(Long usuarioReportaId);

    List<Ticket> findByUsuarioAsignadoIsNull();
}