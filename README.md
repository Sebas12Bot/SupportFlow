# 🎫 SupportFlow

Sistema de gestión de incidencias desarrollado con Spring Boot y React.

Diseñado para demostrar conocimientos en desarrollo backend, arquitectura REST, autenticación JWT, control de concurrencia y despliegue en la nube.

## Demo

Frontend:
https://support-flow-tawny.vercel.app/login
Backend:
https://supportflow-backend-vn5v.onrender.com

## Sobre el proyecto

SupportFlow nació como un proyecto de portafolio para simular un sistema real de gestión de incidencias.

El objetivo fue desarrollar una aplicación completa siguiendo buenas prácticas de arquitectura, separación de responsabilidades y control de concurrencia, incorporando funcionalidades que suelen encontrarse en plataformas empresariales de soporte técnico.

Login
<img width="1905" height="900" alt="image" src="https://github.com/user-attachments/assets/d09b6fd4-5edf-4965-b193-7c03a622a934" />
Registro
<img width="1906" height="907" alt="image" src="https://github.com/user-attachments/assets/e9509315-edc8-4361-bca3-fbb52e11676a" />
Dashboard usuario
<img width="1863" height="897" alt="image" src="https://github.com/user-attachments/assets/cb577a7e-29d5-48d1-9f9b-8158779098b1" />
Dashboard agente
<img width="1863" height="901" alt="image" src="https://github.com/user-attachments/assets/adee592f-9388-4b1d-a34c-e500998293ab" />
Crear ticket
<img width="1846" height="876" alt="image" src="https://github.com/user-attachments/assets/2966c0bc-6441-4744-a97e-192b97c05456" />
Detalle ticket
<img width="1881" height="881" alt="image" src="https://github.com/user-attachments/assets/45a9b357-a7f0-423c-b799-726c882358cb" />
404
<img width="1896" height="890" alt="image" src="https://github.com/user-attachments/assets/50abd6ea-c379-4504-84a9-adc4cf93efd8" />


| Backend         | Frontend      | Infraestructura                       |
| --------------- | ------------- | ------------------------------------- |
| Spring Boot     | React         | Render                                |
| Spring Security | TypeScript    | Vercel                                |
| JPA             | Tailwind      | Neon                                  |
| Hibernate       | Framer Motion | GitHub Actions (si algún día agregas) |

## Características

- Autenticación JWT
- Roles (Usuario / Agente)
- Sistema de invitación para agentes
- Gestión de tickets
- Historial completo de cambios
- Máquina de estados
- Optimistic Locking con @Version
- Manejo global de excepciones
- Validación de contraseñas seguras
- Dashboard independiente para usuarios y agentes
- Diseño responsive
- Dark / Light Mode
- Manejo visual de estados vacíos y errores
- Swagger/OpenAPI

## Cómo ejecutarlo

## Backend
git clone ...
cd backend
./mvnw spring-boot:run

## Frontend
cd frontend
npm install
npm run dev

## Variables
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
JWT_SECRET
VITE_API_URL

## Decisiones técnicas

Durante el desarrollo se priorizaron características que suelen encontrarse en aplicaciones empresariales:

- Optimistic Locking para evitar sobrescrituras concurrentes.
- Separación por capas Controller → Service → Repository.
- Manejo centralizado de excepciones.
- Validación de reglas de negocio en el backend.
- Máquina de estados para controlar el ciclo de vida de los tickets.
- Swagger/OpenAPI

## Futuras mejoras

- Refresh Tokens
- Notificaciones en tiempo real mediante WebSockets
- Adjuntos en tickets
- Dashboard con métricas
- Docker Compose
- CI/CD
