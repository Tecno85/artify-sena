# Arquitectura Tecnica de Artify

> **Proyecto:** Artify - Editor de Imagenes Web  
> **Programa:** Analisis y Desarrollo de Software - SENA  
> **Autor:** Ivan Dario Madrid Daza  
> **Fecha:** Mayo 2026

---

## 1. Objetivo del Documento

Este documento describe la arquitectura tecnica de Artify, explicando como se organizan sus capas principales, que responsabilidades tiene cada componente y como se comunican el frontend, el backend y la base de datos.

La finalidad es dejar una referencia clara para comprender, mantener y ampliar el proyecto sin perder la separacion de responsabilidades.

---

## 2. Vista General

Artify utiliza una arquitectura web full stack organizada en tres capas principales:

```text
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│  HTML + CSS + JavaScript Vanilla + Canvas API   │
│  Paginas: index, login, registro, editor, admin │
└────────────────────┬────────────────────────────┘
                     │ HTTP / REST API
┌────────────────────▼────────────────────────────┐
│                    BACKEND                       │
│  Node.js + Express modularizado                 │
│  Rutas, controladores, middlewares y utilidades │
└────────────────────┬────────────────────────────┘
                     │ mysql2
┌────────────────────▼────────────────────────────┐
│                 BASE DE DATOS                    │
│                 MySQL - artify_db                │
│  USUARIO, SESION_EDICION, OPERACION,            │
│  CONFIGURACION, IMAGEN                          │
└─────────────────────────────────────────────────┘
```

---

## 3. Capa Frontend

El frontend se encuentra en la carpeta `frontend/` y esta construido con HTML, CSS y JavaScript Vanilla. Su responsabilidad es presentar la interfaz visual, capturar las acciones del usuario y comunicarse con el backend mediante peticiones HTTP.

### Componentes principales

| Archivo o carpeta | Responsabilidad |
| --- | --- |
| `frontend/index.html` | Pagina principal del proyecto. |
| `frontend/pages/login.html` | Pantalla de inicio de sesion. |
| `frontend/pages/registro.html` | Pantalla de registro de usuarios. |
| `frontend/pages/editor.html` | Editor de imagenes. |
| `frontend/pages/admin.html` | Panel administrativo. |
| `frontend/assets/css/` | Estilos visuales de cada pantalla. |
| `frontend/assets/js/` | Logica del frontend y consumo de API. |

### Responsabilidades

- Mostrar formularios de registro e inicio de sesion.
- Guardar informacion de sesion en `sessionStorage`.
- Enviar el token de autenticacion a rutas protegidas.
- Manipular imagenes en el navegador mediante Canvas API.
- Presentar el panel administrativo para usuarios con rol `admin`.

---

## 4. Capa Backend

El backend se encuentra en la carpeta `backend/` y esta construido con Node.js y Express. Su responsabilidad es recibir solicitudes del frontend, validar datos, aplicar reglas de negocio, proteger rutas y comunicarse con MySQL.

### Componentes principales

| Carpeta o archivo | Responsabilidad |
| --- | --- |
| `backend/server.js` | Punto de entrada, middlewares globales, montaje de rutas y limpieza de sesiones. |
| `backend/config/` | Conexion a la base de datos. |
| `backend/routes/` | Definicion de endpoints por modulo. |
| `backend/controllers/` | Logica de negocio de cada recurso. |
| `backend/middlewares/` | Autenticacion, autorizacion y control de acceso. |
| `backend/utils/` | Funciones reutilizables para token, validacion y configuracion. |
| `backend/tests/` | Pruebas automatizadas de integracion. |

### Rutas principales

| Modulo | Archivo | Funcion |
| --- | --- | --- |
| Autenticacion | `auth.routes.js` | Login, registro y login administrativo. |
| Configuracion | `configuracion.routes.js` | Consulta y guardado de preferencias. |
| Sesiones | `sesion.routes.js` | Inicio y cierre de sesiones de edicion. |
| Actividad | `actividad.routes.js` | Estadisticas, operaciones e imagenes. |
| Administracion | `admin.routes.js` | CRUD de usuarios. |
| Analiticas | `analytics.routes.js` | Endpoints publicos de analiticas. |

---

## 5. Capa de Base de Datos

Artify utiliza MySQL como sistema de persistencia. La base de datos principal es `artify_db` y su script se encuentra en:

```text
database/artify_db.sql
```

### Tablas principales

| Tabla | Responsabilidad |
| --- | --- |
| `USUARIO` | Usuarios, credenciales, rol, estado y ultimo acceso. |
| `CONFIGURACION` | Preferencias personalizadas del usuario. |
| `SESION_EDICION` | Sesiones de trabajo dentro del editor. |
| `OPERACION` | Registro de operaciones realizadas por el usuario. |
| `IMAGEN` | Metadatos de imagenes procesadas. |

La tabla `USUARIO` funciona como entidad principal. Las tablas `CONFIGURACION`, `SESION_EDICION`, `OPERACION` e `IMAGEN` dependen de ella mediante claves foraneas.

---

## 6. Seguridad y Autenticacion

La autenticacion de Artify se apoya en correo, contrasena, `bcryptjs` y un token firmado generado por el backend.

### Flujo general

1. El usuario envia correo y contrasena desde el frontend.
2. El backend valida el formato de los datos.
3. El backend busca el usuario en la tabla `USUARIO`.
4. La contrasena ingresada se compara contra el hash almacenado con `bcrypt`.
5. Si las credenciales son validas, el backend genera un token firmado.
6. El frontend guarda el token y lo envia en rutas protegidas.
7. Los middlewares verifican token, rol y pertenencia del recurso solicitado.

### Medidas aplicadas

- Las contrasenas se almacenan como hash, no como texto plano.
- Las rutas privadas requieren encabezado `Authorization: Bearer <token>`.
- El backend valida que un usuario no acceda a recursos de otro usuario.
- Las acciones administrativas requieren rol `admin`.
- Las variables sensibles se cargan desde `.env` y no deben subirse al repositorio.

---

## 7. Flujo de Comunicacion

El flujo normal de comunicacion es:

```text
Usuario
  ↓
Frontend HTML/CSS/JS
  ↓ fetch HTTP
Backend Express
  ↓ mysql2
MySQL
  ↓ respuesta
Backend Express
  ↓ JSON
Frontend
  ↓
Interfaz actualizada
```

El frontend no accede directamente a la base de datos. Todas las operaciones persistentes pasan por el backend.

---

## 8. Gestion de Sesiones y Actividad

Cuando un usuario autenticado utiliza el editor, el sistema puede registrar sesiones de edicion y operaciones realizadas. Esto permite conservar trazabilidad basica del uso del sistema.

Ademas, el backend incluye una tarea periodica que finaliza sesiones activas abandonadas con mas de ocho horas de antiguedad. Esta tarea ayuda a mantener consistencia en la base de datos.

---

## 9. Gestion de Dependencias

El backend utiliza `pnpm` como gestor de paquetes oficial. El archivo de bloqueo principal es:

```text
backend/pnpm-lock.yaml
```

No se debe mezclar con `package-lock.json`, porque el proyecto ya esta migrado a `pnpm`.

---

## 10. Criterios de Mantenimiento

Para mantener la arquitectura clara se deben respetar estas reglas:

- Mantener la separacion entre frontend, backend y base de datos.
- Agregar nuevas rutas dentro de `backend/routes/`.
- Colocar reglas de negocio en `backend/controllers/`.
- Reutilizar validaciones y helpers desde `backend/utils/`.
- Proteger nuevas rutas privadas con los middlewares de autenticacion.
- Actualizar esta documentacion cuando cambien capas, modulos o flujos principales.
