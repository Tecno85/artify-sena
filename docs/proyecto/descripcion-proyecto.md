# Descripcion del Proyecto Artify

> **Proyecto:** Artify - Editor de Imagenes Web  
> **Programa:** Analisis y Desarrollo de Software - SENA  
> **Autor:** Ivan Dario Madrid Daza  
> **Fecha:** Mayo 2026

---

## 1. Presentacion del Proyecto

Artify es una aplicacion web full stack orientada a la edicion basica de imagenes desde el navegador. El proyecto integra una interfaz visual construida con HTML, CSS y JavaScript Vanilla, un backend desarrollado con Node.js y Express, y una base de datos MySQL para persistir usuarios, sesiones, configuraciones y operaciones realizadas dentro del sistema.

Desarrollo Artify como proyecto academico del programa Analisis y Desarrollo de Software del SENA, con el proposito de aplicar conocimientos de maquetacion web, programacion frontend, construccion de servicios backend, autenticacion, seguridad basica, persistencia de datos y organizacion profesional de un proyecto de software.

---

## 2. Problema o Necesidad

Muchas tareas de edicion de imagenes no requieren herramientas complejas ni instalacion de software especializado. En contextos academicos, personales o de trabajo ligero, un usuario puede necesitar recortar, redimensionar, rotar, aplicar filtros o convertir formatos de imagen de forma rapida desde el navegador.

Artify busca responder a esta necesidad mediante una solucion web sencilla, accesible y organizada, que permita editar imagenes y, al mismo tiempo, registrar informacion relevante del uso del sistema mediante autenticacion, sesiones y almacenamiento en base de datos.

---

## 3. Objetivo General

Desarrollar una aplicacion web para la edicion de imagenes que permita a los usuarios autenticarse, cargar imagenes, aplicar operaciones basicas de edicion y gestionar su experiencia dentro del sistema mediante configuraciones, sesiones y registro de actividad.

---

## 4. Objetivos Especificos

- Implementar una interfaz web clara para cargar, visualizar y editar imagenes.
- Permitir operaciones como recorte, redimensionamiento, rotacion, filtros, zoom, conversion de formato y descarga.
- Incorporar autenticacion de usuarios con contrasenas protegidas mediante `bcrypt`.
- Gestionar roles de usuario y administrador.
- Registrar sesiones, operaciones y configuraciones en una base de datos MySQL.
- Desarrollar un panel administrativo para consultar, crear, editar y eliminar usuarios.
- Mantener documentacion tecnica y funcional organizada para facilitar la entrega academica y la continuidad del proyecto.

---

## 5. Alcance del Proyecto

El alcance actual de Artify incluye:

- Registro e inicio de sesion de usuarios.
- Autenticacion con token firmado desde el backend.
- Editor de imagenes con herramientas basicas de transformacion.
- Persistencia de usuarios, configuraciones, sesiones, operaciones e imagenes en MySQL.
- Panel de administracion protegido por rol.
- API REST para funcionalidades internas y endpoints de analiticas.
- Pruebas automatizadas para el modulo de autenticacion y rutas protegidas.
- Documentacion del proyecto y documentacion tecnica separadas en la carpeta `docs/`.

No hacen parte del alcance actual funciones avanzadas como edicion colaborativa en tiempo real, almacenamiento de archivos en la nube, inteligencia artificial para imagenes, pagos, integracion con redes sociales o despliegue productivo en infraestructura externa.

---

## 6. Usuarios del Sistema

| Usuario | Descripcion |
| --- | --- |
| Usuario registrado | Persona que crea una cuenta, inicia sesion y utiliza el editor de imagenes. |
| Administrador | Usuario con permisos para acceder al panel administrativo y gestionar registros de la tabla `USUARIO`. |
| Visitante | Persona que puede acceder a la pagina principal, pero debe registrarse o iniciar sesion para usar el editor. |

---

## 7. Modulos Principales

### 7.1 Modulo de autenticacion

Permite registrar usuarios, iniciar sesion, validar credenciales y generar un token firmado para proteger rutas del sistema.

### 7.2 Modulo editor de imagenes

Permite cargar imagenes y aplicar operaciones como recorte, redimensionamiento, rotacion, filtros, conversion de formato, zoom, deshacer, rehacer y descarga.

### 7.3 Modulo de configuracion

Permite guardar preferencias del usuario, como calidad de exportacion, formato por defecto, notificaciones y autoguardado.

### 7.4 Modulo de sesiones y operaciones

Registra sesiones de edicion y operaciones realizadas por los usuarios para conservar trazabilidad dentro de la base de datos.

### 7.5 Modulo administrativo

Permite al administrador gestionar usuarios mediante operaciones CRUD y consultar estadisticas basicas.

### 7.6 Modulo de analiticas

Expone endpoints REST para consultar informacion agregada sobre filtros, horarios, formatos preferidos y tasa de conversion.

---

## 8. Tecnologias Utilizadas

| Capa | Tecnologia |
| --- | --- |
| Frontend | HTML5, CSS3, JavaScript Vanilla |
| Edicion de imagenes | Canvas API |
| Backend | Node.js, Express |
| Base de datos | MySQL |
| Autenticacion | Token firmado propio, `bcryptjs` |
| Gestor de paquetes | pnpm |
| Pruebas | Node Test Runner |
| Control de versiones | Git y GitHub |

---

## 9. Valor del Proyecto

Artify demuestra la integracion de diferentes competencias del desarrollo de software en un producto funcional: interfaz grafica, logica de negocio, seguridad, base de datos, API REST, pruebas y documentacion.

Desde el punto de vista academico, el proyecto permite evidenciar el proceso de analisis, construccion, validacion y organizacion de una solucion web. Desde el punto de vista de portafolio, muestra una aplicacion full stack con funcionalidades reales, estructura clara y buenas practicas progresivas de desarrollo.

---

## 10. Estado Actual

El proyecto se encuentra en estado activo. Actualmente cuenta con frontend funcional, backend modularizado, base de datos MySQL, autenticacion real, panel administrativo, pruebas automatizadas de autenticacion y documentacion organizada en:

- `docs/proyecto/`: documentacion funcional y academica.
- `docs/tecnica/`: documentacion tecnica y manual tecnico.

El desarrollo continua con mejoras orientadas a ampliar pruebas, fortalecer documentacion tecnica, mejorar despliegue y mantener el proyecto listo para entrega academica y portafolio.
