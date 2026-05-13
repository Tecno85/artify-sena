# Requerimientos Funcionales de Artify

> **Proyecto:** Artify - Editor de Imagenes Web  
> **Programa:** Analisis y Desarrollo de Software - SENA  
> **Autor:** Ivan Dario Madrid Daza  
> **Fecha:** Mayo 2026

---

## 1. Objetivo del Documento

En este documento identifico los requerimientos funcionales principales de Artify. Estos requerimientos describen las acciones que el sistema debe permitir a los usuarios, administradores y visitantes, de acuerdo con el alcance actual del proyecto.

La finalidad es dejar una base clara para comprender que funcionalidades ofrece Artify, como se relacionan con sus modulos principales y que criterios permiten validar su cumplimiento.

---

## 2. Actores del Sistema

| Actor | Descripcion |
| --- | --- |
| Visitante | Persona que accede a la pagina principal y puede dirigirse al registro o inicio de sesion. |
| Usuario registrado | Persona que tiene una cuenta, inicia sesion y utiliza el editor de imagenes. |
| Administrador | Usuario con rol administrativo que puede gestionar usuarios desde el panel de administracion. |

---

## 3. Requerimientos Funcionales

| Codigo | Requerimiento | Actor | Prioridad |
| --- | --- | --- | --- |
| RF-01 | El sistema debe permitir el registro de nuevos usuarios. | Visitante | Alta |
| RF-02 | El sistema debe permitir el inicio de sesion con correo y contrasena. | Usuario registrado | Alta |
| RF-03 | El sistema debe redirigir al usuario segun su rol despues del inicio de sesion. | Usuario registrado / Administrador | Alta |
| RF-04 | El sistema debe proteger rutas y operaciones mediante token de autenticacion. | Usuario registrado / Administrador | Alta |
| RF-05 | El sistema debe permitir cargar imagenes desde el navegador. | Usuario registrado | Alta |
| RF-06 | El sistema debe permitir recortar imagenes. | Usuario registrado | Media |
| RF-07 | El sistema debe permitir redimensionar imagenes. | Usuario registrado | Media |
| RF-08 | El sistema debe permitir rotar imagenes. | Usuario registrado | Media |
| RF-09 | El sistema debe permitir aplicar filtros visuales. | Usuario registrado | Media |
| RF-10 | El sistema debe permitir convertir imagenes a diferentes formatos. | Usuario registrado | Media |
| RF-11 | El sistema debe permitir descargar la imagen editada. | Usuario registrado | Alta |
| RF-12 | El sistema debe registrar sesiones de edicion. | Usuario registrado | Alta |
| RF-13 | El sistema debe registrar operaciones realizadas sobre imagenes. | Usuario registrado | Media |
| RF-14 | El sistema debe permitir consultar y guardar configuraciones de usuario. | Usuario registrado | Media |
| RF-15 | El sistema debe permitir al administrador listar usuarios. | Administrador | Alta |
| RF-16 | El sistema debe permitir al administrador crear usuarios. | Administrador | Alta |
| RF-17 | El sistema debe permitir al administrador editar usuarios. | Administrador | Alta |
| RF-18 | El sistema debe permitir al administrador eliminar usuarios. | Administrador | Alta |
| RF-19 | El sistema debe exponer informacion de analiticas mediante API REST. | Usuario tecnico / Sistema externo | Baja |

---

## 4. Detalle de Requerimientos

### RF-01 Registro de usuarios

El sistema debe permitir que un visitante cree una cuenta ingresando nombres, apellidos, cedula, fecha de nacimiento, correo electronico y contrasena.

**Criterios de aceptacion:**

- El sistema valida que los datos obligatorios esten completos.
- El sistema rechaza correos o cedulas duplicadas.
- La contrasena se almacena en la base de datos como hash generado con `bcrypt`.
- Al finalizar el registro correctamente, el sistema crea el usuario y permite continuar el flujo autenticado.

### RF-02 Inicio de sesion

El sistema debe permitir que un usuario registrado inicie sesion con correo electronico y contrasena.

**Criterios de aceptacion:**

- El sistema valida el formato del correo.
- El sistema compara la contrasena ingresada contra el hash almacenado.
- Si las credenciales son correctas, el sistema genera un token firmado.
- Si las credenciales son incorrectas, el sistema responde con un mensaje claro.

### RF-03 Redireccion por rol

El sistema debe redirigir al usuario segun el rol asociado a su cuenta.

**Criterios de aceptacion:**

- Un usuario con rol `usuario` accede al editor.
- Un usuario con rol `admin` accede al panel administrativo.
- La informacion de sesion se conserva durante la navegacion mediante `sessionStorage` y token de autenticacion.

### RF-04 Proteccion de rutas

El sistema debe proteger las rutas privadas mediante token de autenticacion y validacion de permisos.

**Criterios de aceptacion:**

- Las rutas protegidas rechazan solicitudes sin token.
- Las rutas protegidas rechazan tokens invalidos o expirados.
- Un usuario no puede acceder o modificar recursos de otro usuario.
- Las acciones administrativas requieren rol `admin`.

### RF-05 Carga de imagenes

El sistema debe permitir cargar imagenes desde el navegador mediante selector de archivos o arrastrar y soltar.

**Criterios de aceptacion:**

- El sistema permite cargar imagenes compatibles.
- El sistema muestra la imagen en el area de edicion.
- Al cargar una imagen se habilitan las herramientas principales del editor.

### RF-06 Recorte de imagenes

El sistema debe permitir recortar imagenes con diferentes proporciones.

**Criterios de aceptacion:**

- El usuario puede activar el modo de recorte.
- El usuario puede seleccionar proporciones como libre, 1:1, 16:9, 4:3 o 3:2.
- El sistema aplica el recorte sobre la imagen cargada.

### RF-07 Redimensionamiento de imagenes

El sistema debe permitir cambiar el ancho y alto de una imagen.

**Criterios de aceptacion:**

- El usuario puede ingresar nuevas dimensiones.
- El sistema permite mantener la proporcion cuando corresponde.
- La imagen se actualiza con las dimensiones indicadas.

### RF-08 Rotacion de imagenes

El sistema debe permitir rotar la imagen en angulos predefinidos.

**Criterios de aceptacion:**

- El usuario puede aplicar rotaciones de 90, 180 o 270 grados.
- La vista de la imagen se actualiza despues de aplicar la rotacion.

### RF-09 Filtros visuales

El sistema debe permitir aplicar filtros artisticos a la imagen.

**Criterios de aceptacion:**

- El usuario puede aplicar filtros como blanco y negro, sepia, brillo y contraste.
- El sistema permite ajustar la intensidad del filtro cuando aplique.
- El filtro se refleja visualmente sobre la imagen.

### RF-10 Conversion de formato

El sistema debe permitir convertir la imagen a diferentes formatos de salida.

**Criterios de aceptacion:**

- El usuario puede seleccionar formatos como PNG, JPEG o WebP.
- El sistema permite configurar calidad para formatos que lo soporten.
- La imagen puede descargarse en el formato seleccionado.

### RF-11 Descarga de imagen editada

El sistema debe permitir descargar la imagen resultante despues de la edicion.

**Criterios de aceptacion:**

- El boton de descarga se habilita cuando existe una imagen cargada.
- El archivo descargado refleja las operaciones aplicadas.
- El sistema respeta la configuracion de formato y calidad seleccionada.

### RF-12 Registro de sesiones de edicion

El sistema debe registrar sesiones de edicion asociadas al usuario autenticado.

**Criterios de aceptacion:**

- Al iniciar el uso del editor, el sistema registra una sesion.
- Al cerrar o finalizar la sesion, el sistema actualiza su estado.
- El sistema puede cerrar sesiones abandonadas por inactividad.

### RF-13 Registro de operaciones

El sistema debe registrar operaciones realizadas por el usuario durante la edicion.

**Criterios de aceptacion:**

- El sistema registra el tipo de operacion realizada.
- La operacion queda asociada al usuario y a la sesion correspondiente.
- El sistema evita registrar operaciones sobre sesiones que no pertenecen al usuario.

### RF-14 Configuracion personalizada

El sistema debe permitir consultar y guardar preferencias del usuario.

**Criterios de aceptacion:**

- El usuario puede consultar su configuracion guardada.
- El usuario puede guardar preferencias como formato por defecto, calidad, notificaciones y autoguardado.
- El sistema conserva la configuracion en la base de datos.

### RF-15 Listar usuarios

El sistema debe permitir que el administrador consulte los usuarios registrados.

**Criterios de aceptacion:**

- Solo un administrador autenticado puede acceder al listado.
- El sistema muestra informacion relevante de los usuarios.
- El panel permite busqueda en tiempo real.

### RF-16 Crear usuarios desde administracion

El sistema debe permitir que el administrador cree usuarios desde el panel administrativo.

**Criterios de aceptacion:**

- El formulario valida los datos requeridos.
- El sistema evita crear registros duplicados por correo o cedula.
- La contrasena se almacena protegida mediante hash.

### RF-17 Editar usuarios

El sistema debe permitir que el administrador actualice datos de usuarios existentes.

**Criterios de aceptacion:**

- El administrador puede modificar datos personales y estado del usuario.
- El sistema valida los datos antes de guardar.
- Los cambios se reflejan en la tabla `USUARIO`.

### RF-18 Eliminar usuarios

El sistema debe permitir que el administrador elimine usuarios.

**Criterios de aceptacion:**

- El sistema solicita confirmacion antes de eliminar.
- El sistema elimina primero la informacion dependiente para conservar integridad referencial.
- El usuario eliminado deja de aparecer en el listado administrativo.

### RF-19 API de analiticas

El sistema debe exponer endpoints REST para consultar informacion agregada del uso de Artify.

**Criterios de aceptacion:**

- La API permite consultar filtros populares.
- La API permite consultar horarios de edicion.
- La API permite consultar formatos preferidos.
- La API permite consultar tasa de conversion.

---

## 5. Requerimientos Fuera del Alcance Actual

Por ahora no se contemplan como parte del alcance funcional:

- Edicion colaborativa en tiempo real.
- Almacenamiento de imagenes en servicios externos.
- Recuperacion de contrasena por correo electronico.
- Integracion con pagos o suscripciones.
- Publicacion directa en redes sociales.
- Funciones de inteligencia artificial para generacion o mejora de imagenes.

---

## 6. Relacion con las Pruebas

Los requerimientos relacionados con autenticacion, registro, inicio de sesion, tokens, rutas protegidas y acceso a recursos de usuario se validan mediante pruebas automatizadas en el backend.

El plan especifico de pruebas del modulo de autenticacion se encuentra en:

```text
docs/tecnica/plan-pruebas-autenticacion.md
```
