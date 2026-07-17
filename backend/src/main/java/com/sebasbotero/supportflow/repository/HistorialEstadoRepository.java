package com.sebasbotero.supportflow.repository;

import com.sebasbotero.supportflow.entity.HistorialEstado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistorialEstadoRepository extends JpaRepository<HistorialEstado, Long> {

    List<HistorialEstado> findByTicketIdOrderByFechaCambioAsc(Long ticketId);
}