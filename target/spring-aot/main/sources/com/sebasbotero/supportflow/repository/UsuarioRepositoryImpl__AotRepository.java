package com.sebasbotero.supportflow.repository;

import com.sebasbotero.supportflow.entity.Usuario;
import com.sebasbotero.supportflow.entity.enums.Role;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.lang.String;
import java.util.List;
import java.util.Optional;
import org.springframework.aot.generate.Generated;
import org.springframework.data.jpa.repository.aot.AotRepositoryFragmentSupport;
import org.springframework.data.jpa.repository.query.QueryEnhancerSelector;
import org.springframework.data.repository.core.support.RepositoryFactoryBeanSupport;

/**
 * AOT generated JPA repository implementation for {@link UsuarioRepository}.
 */
@Generated
public class UsuarioRepositoryImpl__AotRepository extends AotRepositoryFragmentSupport {
  private final RepositoryFactoryBeanSupport.FragmentCreationContext context;

  private final EntityManager entityManager;

  public UsuarioRepositoryImpl__AotRepository(EntityManager entityManager,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(QueryEnhancerSelector.DEFAULT_SELECTOR, context);
    this.entityManager = entityManager;
    this.context = context;
  }

  /**
   * AOT generated implementation of {@link UsuarioRepository#existsByEmail(java.lang.String)}.
   */
  public boolean existsByEmail(String email) {
    String queryString = "SELECT u.id FROM Usuario u WHERE u.email = :email";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("email", email);
    query.setMaxResults(1);

    return !query.getResultList().isEmpty();
  }

  /**
   * AOT generated implementation of {@link UsuarioRepository#findByEmail(java.lang.String)}.
   */
  public Optional<Usuario> findByEmail(String email) {
    String queryString = "SELECT u FROM Usuario u WHERE u.email = :email";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("email", email);

    return Optional.ofNullable((Usuario) convertOne(query.getSingleResultOrNull(), false, Usuario.class));
  }

  /**
   * AOT generated implementation of {@link UsuarioRepository#findByRol(com.sebasbotero.supportflow.entity.enums.Role)}.
   */
  public List<Usuario> findByRol(Role rol) {
    String queryString = "SELECT u FROM Usuario u WHERE u.rol = :rol";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("rol", rol);

    return (List<Usuario>) query.getResultList();
  }
}
