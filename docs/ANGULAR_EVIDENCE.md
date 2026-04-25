# Evidencia Angular - Artify

## Objetivo academico

Esta evidencia agrega una aplicacion Angular independiente al repositorio Artify. Su objetivo es demostrar autenticacion, proteccion de rutas y consumo de una API REST real sin alterar el proyecto original desarrollado con HTML, CSS, JavaScript vanilla, Node.js, Express y MySQL.

## Independencia frente a Artify original

La aplicacion vive en la carpeta `artify-angular/` y funciona como un cliente separado. No reemplaza el login existente ni modifica el editor, el panel administrativo o el backend.

Archivos y carpetas que permanecen sin cambios por esta evidencia:

- `backend/`
- `frontend/`
- `frontend/pages/login.html`

## Estructura principal

```text
artify-angular/
├── angular.json
├── package.json
├── src/
│   ├── main.ts
│   ├── styles.css
│   └── app/
│       ├── app.component.*
│       ├── app.routes.ts
│       ├── core/
│       │   ├── guards/
│       │   └── services/
│       └── features/
│           ├── login/
│           ├── dashboard/
│           └── analytics/
```

## Flujo de autenticacion

El componente `LoginComponent` recibe correo y contrasena, y consume el endpoint real:

```http
POST http://localhost:3000/api/login
```

El cuerpo enviado al backend es:

```json
{
  "correo": "usuario@artify.com",
  "password": "contrasena"
}
```

Cuando el backend responde correctamente, Angular guarda el token en `sessionStorage` con una llave propia de esta evidencia:

```text
artifyAngularToken
```

Tambien guarda datos basicos del usuario en:

```text
artifyAngularUser
```

Estas llaves son independientes de las usadas por el frontend original.

## Rutas protegidas

La app define estas rutas:

- `/login`: acceso publico.
- `/dashboard`: protegido con `AuthGuard`.
- `/analytics`: protegido con `AuthGuard`.
- `/`: redirecciona a `/dashboard` si hay token o a `/login` si no existe sesion.

`AuthGuard` valida la existencia del token de la evidencia Angular en `sessionStorage`. Si no existe, redirige al login Angular.

## Navegacion

Despues del login, la aplicacion muestra un menu con:

- Dashboard
- Analytics
- Logout

La opcion Logout elimina `artifyAngularToken` y `artifyAngularUser`, y devuelve al usuario a `/login`.

## Endpoints de analytics consumidos

La vista `AnalyticsComponent` consume los endpoints reales documentados en Artify:

```http
GET http://localhost:3000/api/v1/analytics/filtros-populares
GET http://localhost:3000/api/v1/analytics/horarios-edicion
GET http://localhost:3000/api/v1/analytics/formatos-preferidos
GET http://localhost:3000/api/v1/analytics/tasa-conversion
```

La aplicacion no usa datos demo. Si el backend o MySQL no estan activos, se muestra un mensaje de error.

## Ejecucion

Primero se debe ejecutar el backend oficial de Artify:

```bash
cd backend
npm install
npm start
```

Luego se ejecuta la evidencia Angular:

```bash
cd artify-angular
npm install
npm start
```

La app Angular queda disponible en:

```text
http://localhost:4200
```

## Verificacion esperada

- Sin token, `/dashboard` y `/analytics` redirigen a `/login`.
- Con credenciales validas del backend, Angular guarda el token y permite navegar.
- Dashboard y Analytics se visualizan despues del login.
- Logout limpia la sesion y bloquea de nuevo las rutas protegidas.
- `backend/`, `frontend/` y `frontend/pages/login.html` no se modifican.
