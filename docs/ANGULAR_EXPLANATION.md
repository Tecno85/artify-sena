# Explicacion tecnica de la aplicacion Angular de Artify

## 1. Descripcion general del proyecto

La carpeta `artify-angular/` contiene una aplicacion Angular independiente creada dentro del repositorio de Artify. Esta aplicacion no reemplaza el proyecto original, sino que funciona como una evidencia academica adicional para demostrar el uso de Angular en un escenario real.

Dentro de Artify, esta app sirve como un nuevo cliente web que permite:

- iniciar sesion usando el backend real de Artify;
- proteger pantallas internas con autenticacion;
- mostrar un dashboard basico;
- consultar y visualizar datos de la API REST de analytics.

En palabras sencillas: Artify ya tenia su frontend original en HTML, CSS y JavaScript vanilla. La app Angular es una segunda interfaz, separada, que aprovecha el mismo backend para demostrar una arquitectura moderna basada en componentes, servicios y rutas protegidas.

## 2. Arquitectura de la aplicacion

La aplicacion esta organizada para separar responsabilidades. Esto ayuda a que el codigo sea mas facil de entender, mantener y explicar.

Estructura principal:

```text
artify-angular/
├── angular.json
├── package.json
├── src/
│   ├── index.html
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

La carpeta `core/` contiene elementos centrales que pueden ser usados por varias partes de la aplicacion. Alli estan los servicios y guards:

- `AuthService`: maneja login, token y sesion.
- `AnalyticsService`: consume la API REST de analytics.
- `AuthGuard`: protege rutas privadas.
- `redirectBySessionGuard`: decide si la ruta inicial manda al login o al dashboard.

La carpeta `features/` contiene las pantallas principales de la aplicacion. Cada feature representa una funcionalidad visible para el usuario:

- `login/`: pantalla de inicio de sesion.
- `dashboard/`: pantalla inicial protegida.
- `analytics/`: pantalla de indicadores consumidos desde la API.

Esta separacion es importante porque permite explicar el proyecto por modulos: primero la autenticacion, luego la navegacion, y finalmente el consumo de datos.

## 3. Componentes principales

### LoginComponent

`LoginComponent` es la pantalla publica de inicio de sesion. Su responsabilidad es recibir el correo y la contrasena del usuario, validar que los campos no esten vacios y enviar esos datos al backend real.

Este componente usa formularios reactivos de Angular. Eso significa que el formulario se controla desde TypeScript y no solamente desde el HTML.

Ejemplo de lo que hace:

- el usuario escribe su correo;
- el usuario escribe su contrasena;
- Angular valida el formulario;
- si todo esta correcto, llama a `AuthService.login()`;
- si el backend responde bien, redirige al dashboard.

Si hay un error, por ejemplo una contrasena incorrecta o el backend apagado, se muestra un mensaje en pantalla.

### DashboardComponent

`DashboardComponent` es la primera pantalla protegida despues del login. Su funcion es mostrar que el usuario ya tiene una sesion activa dentro de la app Angular.

En esta vista se presenta informacion como:

- usuario autenticado;
- backend conectado en `localhost:3000`;
- recordatorio de que las rutas internas estan protegidas con `AuthGuard`.

Sirve como una pantalla de entrada antes de consultar los datos de analytics.

### AnalyticsComponent

`AnalyticsComponent` es la pantalla que consume la API REST de analytics de Artify. Esta vista consulta datos reales del backend y los presenta en tarjetas y tablas.

Muestra informacion como:

- filtros mas usados;
- horarios de edicion;
- formatos de imagen preferidos;
- tasa de conversion de sesiones.

Tambien maneja estados importantes para la presentacion:

- estado de carga mientras se consultan los datos;
- estado de error si el backend o la base de datos no estan disponibles;
- visualizacion de datos cuando la API responde correctamente.

## 4. Servicios

### AuthService

`AuthService` es el servicio encargado de la autenticacion dentro de Angular. Su trabajo es centralizar todo lo relacionado con la sesion del usuario.

Sus responsabilidades principales son:

- enviar credenciales al backend;
- guardar el token en `sessionStorage`;
- guardar datos basicos del usuario;
- saber si el usuario esta autenticado;
- cerrar sesion cuando se usa Logout.

El servicio se comunica con el backend usando `HttpClient`, que es la herramienta de Angular para hacer peticiones HTTP.

El endpoint usado para login es:

```http
POST http://localhost:3000/api/login
```

El cuerpo enviado tiene esta forma:

```json
{
  "correo": "usuario@artify.com",
  "password": "contrasena"
}
```

Si el backend valida las credenciales, responde con datos del usuario y un token. Angular guarda ese token para permitir el acceso a las rutas protegidas.

### AnalyticsService

`AnalyticsService` se encarga de consultar la API REST de analytics. En vez de poner las URLs directamente dentro del componente, se centralizan en este servicio.

Esto tiene una ventaja importante: el componente se dedica a mostrar la informacion, mientras el servicio se dedica a obtenerla.

El servicio consulta cuatro endpoints y agrupa sus respuestas:

```http
GET http://localhost:3000/api/v1/analytics/filtros-populares
GET http://localhost:3000/api/v1/analytics/horarios-edicion
GET http://localhost:3000/api/v1/analytics/formatos-preferidos
GET http://localhost:3000/api/v1/analytics/tasa-conversion
```

Para hacer las consultas usa `forkJoin`. Esto permite ejecutar varias peticiones y esperar a que todas terminen antes de mostrar la informacion completa.

## 5. Sistema de autenticacion

El login funciona con el backend real de Artify. La app Angular no inventa usuarios ni usa datos de prueba. Depende de que el servidor Express y MySQL esten funcionando.

Flujo del login:

```text
Usuario escribe correo y contrasena
↓
LoginComponent valida el formulario
↓
AuthService envia POST /api/login
↓
Backend verifica usuario y contrasena
↓
Backend devuelve usuario y token
↓
Angular guarda el token en sessionStorage
↓
Usuario entra al dashboard
```

El token se guarda en:

```text
artifyAngularToken
```

Los datos basicos del usuario se guardan en:

```text
artifyAngularUser
```

Se usa `sessionStorage` porque la informacion dura mientras la pestana del navegador esta abierta. Si el usuario cierra la pestana, la sesion se elimina automaticamente.

## 6. Proteccion de rutas

La proteccion de rutas se realiza con `AuthGuard`.

Un guard en Angular funciona como una revision antes de entrar a una pagina. Si el usuario intenta entrar a `/dashboard` o `/analytics`, Angular pregunta primero:

```text
¿Existe un token guardado?
```

Si la respuesta es si, permite entrar.

Si la respuesta es no, redirige al usuario a:

```text
/login
```

Esto evita que alguien escriba directamente `http://localhost:4200/analytics` en el navegador y vea informacion sin haberse autenticado.

## 7. Navegacion

Las rutas estan definidas en `app.routes.ts`.

Rutas principales:

```text
/login      Pantalla publica de inicio de sesion
/dashboard  Pantalla protegida de bienvenida
/analytics  Pantalla protegida con datos de analytics
/           Redirige segun exista o no sesion
```

Despues del login aparece un menu superior con:

- Dashboard
- Analytics
- Logout

La opcion `Logout` elimina el token y los datos del usuario guardados en `sessionStorage`. Despues redirige nuevamente al login.

## 8. Consumo de APIs

La app Angular consume APIs reales del backend de Artify. No utiliza datos simulados.

En la pantalla `AnalyticsComponent`, los datos se muestran en dos formas:

- tarjetas resumen, para ver indicadores rapidamente;
- tablas, para revisar detalles por categoria.

Por ejemplo, si el endpoint de filtros responde con una lista de filtros usados, Angular muestra:

- nombre del filtro;
- cantidad de usos;
- porcentaje de uso.

Esto facilita explicar en una presentacion como un frontend Angular puede consumir datos generados por un backend Express y mostrarlos de forma organizada.

## 9. Flujo completo del usuario

El recorrido completo dentro de la app es el siguiente:

```text
1. El usuario abre http://localhost:4200
2. Angular revisa si hay una sesion guardada
3. Si no hay token, envia al usuario a /login
4. El usuario ingresa correo y contrasena
5. Angular envia las credenciales al backend de Artify
6. Si el login es correcto, se guarda el token en sessionStorage
7. El usuario entra a /dashboard
8. Desde el menu puede ir a /analytics
9. Angular consulta la API REST de analytics
10. Los datos se muestran en tarjetas y tablas
11. Si el usuario presiona Logout, se borra la sesion y vuelve a /login
```

Este flujo demuestra tres conceptos fundamentales de Angular:

- componentes para construir pantallas;
- servicios para manejar logica y comunicacion con APIs;
- guards para proteger rutas privadas.

## 10. Independencia del proyecto

Un punto importante de esta implementacion es que la app Angular no modifica el proyecto original de Artify.

No se alteran:

- `backend/`
- `frontend/`
- `frontend/pages/login.html`
- `frontend/assets/css/`
- `frontend/assets/js/`

La app Angular vive en:

```text
artify-angular/
```

Esto permite presentar Angular como una evidencia nueva sin dañar ni reemplazar lo que ya funcionaba en Artify.

La relacion entre ambos sistemas puede entenderse asi:

```text
Frontend original     → sigue funcionando como antes
Backend Express       → sigue siendo la API oficial
App Angular nueva     → consume el backend como cliente independiente
```

## 11. Conclusion

Con esta implementacion se logro agregar una aplicacion Angular funcional e independiente dentro de Artify.

La evidencia demuestra:

- uso de componentes Angular;
- formulario de login con validacion;
- consumo de un endpoint real de autenticacion;
- almacenamiento de token en `sessionStorage`;
- proteccion de rutas con `AuthGuard`;
- navegacion interna despues del login;
- consumo de una API REST real;
- presentacion de datos de analytics en tarjetas y tablas;
- separacion clara entre `core` y `features`;
- respeto por el backend y frontend original del proyecto.

En una presentacion o video, esta app puede explicarse como una extension academica de Artify: no cambia el sistema principal, pero demuestra como Angular puede integrarse con una API existente para crear una experiencia moderna, modular y protegida por autenticacion.
