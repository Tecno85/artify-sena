# Plan de Pruebas - Modulo de Autenticacion

> **Proyecto:** Artify - Editor de Imagenes Web  
> **Modulo evaluado:** Autenticacion de usuarios  
> **Programa:** Analisis y Desarrollo de Software - SENA  
> **Autor:** Ivan Dario Madrid Daza  
> **Fecha:** Mayo 2026

---

## 1. Objetivo

En este artefacto defino y ejecuto un plan de pruebas para validar el funcionamiento del modulo de autenticacion de Artify. Me enfoco en comprobar el inicio de sesion, el tratamiento de credenciales invalidas, la generacion del token de acceso y los cambios que se realizan en la base de datos despues de un login exitoso.

Tambien verifico que la contrasena del usuario no se almacene en texto plano, sino en formato encriptado mediante `bcrypt`.

---

## 2. Alcance

Este plan de pruebas lo centro exclusivamente en el modulo de autenticacion:

- Registro de usuario como paso previo para crear credenciales de prueba.
- Inicio de sesion con credenciales validas.
- Inicio de sesion con credenciales invalidas.
- Validacion del almacenamiento de la contrasena en la base de datos.
- Verificacion de actualizacion de datos de acceso en la tabla `USUARIO`.
- Validacion de generacion de token despues de un login exitoso.

No incluyo pruebas funcionales del editor de imagenes, filtros, recorte, panel de administracion ni operaciones avanzadas, excepto cuando sirven como evidencia complementaria para demostrar que la autenticacion permite acceder correctamente al sistema.

---

## 3. Ambiente de Pruebas

| Elemento | Descripcion |
| --- | --- |
| Sistema | Artify |
| Frontend | HTML, CSS, JavaScript Vanilla |
| Backend | Node.js + Express |
| Base de datos | MySQL |
| Tabla principal | `USUARIO` |
| Herramienta de encriptacion | `bcryptjs` |
| Archivo principal evaluado | `backend/controllers/auth.controller.js` |
| Script de base de datos | `database/artify_db.sql` |

---

## 4. Componentes Evaluados

Para realizar las pruebas reviso principalmente el controlador de autenticacion y la tabla donde se almacenan los usuarios registrados.

### 4.1 Controlador de autenticacion

Archivo:

```text
backend/controllers/auth.controller.js
```

Funciones evaluadas:

- `registro(req, res)`
- `login(req, res)`
- `loginAdmin(req, res)`

### 4.2 Tabla de usuarios

Tabla:

```sql
USUARIO
```

Campo donde se almacena la contrasena:

```sql
usr_contrasena varchar(255) NOT NULL
```

---

## 5. Evidencia Tecnica del Cifrado de Contrasena

Al revisar el codigo del proyecto identifique que la contrasena se encripta durante el registro del usuario, antes de ser almacenada en la base de datos.

Ubicacion:

```text
backend/controllers/auth.controller.js
```

Fragmento relevante:

```javascript
const hash = bcrypt.hashSync(password, 10);
```

Luego, el valor que se guarda en la base de datos es `hash`, no la contrasena original escrita por el usuario:

```javascript
db.query(
  queryInsertar,
  [nombres, apellidos, cedula, fechaNacimiento, correo, hash],
  callback
);
```

Durante el login observe que el sistema no compara texto plano directamente. En su lugar, usa `bcrypt.compareSync` para comparar la contrasena ingresada por el usuario contra el hash almacenado:

```javascript
const passwordValida = bcrypt.compareSync(password, usuario.usr_contrasena);
```

Esto me permite concluir que la contrasena real no necesita ser desencriptada ni recuperada desde la base de datos.

---

## 6. Casos de Prueba

### CP-001 - Registro de usuario con datos validos

| Campo | Detalle |
| --- | --- |
| Objetivo | Verificar que el sistema permita crear un usuario valido. |
| Precondicion | El correo y la cedula no deben existir previamente en la tabla `USUARIO`. |
| Datos de entrada | Nombres, apellidos, cedula, fecha de nacimiento, correo y contrasena valida. |
| Pasos | Enviar solicitud de registro desde el formulario o API. |
| Resultado esperado | El sistema responde `Registro exitoso` y crea el usuario en la base de datos. |
| Validacion en BD | Debe existir un nuevo registro en `USUARIO`. |
| Estado | Aprobado. |

Consulta SQL sugerida:

```sql
SELECT usr_id_usuario, usr_correo, usr_contrasena, usr_fecha_registro
FROM USUARIO
WHERE usr_correo = 'correo_prueba@artify.local';
```

---

### CP-002 - Validar que la contrasena se almacena encriptada

| Campo | Detalle |
| --- | --- |
| Objetivo | Confirmar que la contrasena no se guarda en texto plano. |
| Precondicion | Debe existir un usuario registrado. |
| Datos de entrada | Correo del usuario registrado. |
| Pasos | Consultar el campo `usr_contrasena` en la tabla `USUARIO`. |
| Resultado esperado | El valor almacenado debe ser un hash generado por bcrypt. |
| Validacion en BD | El valor debe iniciar normalmente con `$2a$` o `$2b$` y no debe coincidir con la contrasena original. |
| Estado | Aprobado. |

Consulta SQL sugerida:

```sql
SELECT usr_correo, usr_contrasena
FROM USUARIO
WHERE usr_correo = 'correo_prueba@artify.local';
```

Ejemplo de resultado esperado:

```text
$2b$10$...
```

Interpretacion:

- `$2b$` identifica el algoritmo bcrypt.
- `10` representa el factor de costo utilizado en `bcrypt.hashSync(password, 10)`.
- El resto del valor corresponde al hash generado.

---

### CP-003 - Login con credenciales validas

| Campo | Detalle |
| --- | --- |
| Objetivo | Verificar que un usuario registrado pueda iniciar sesion. |
| Precondicion | El usuario debe existir en la tabla `USUARIO`. |
| Datos de entrada | Correo registrado y contrasena correcta. |
| Pasos | Enviar correo y contrasena al endpoint `/api/login`. |
| Resultado esperado | El sistema responde `Login exitoso`, retorna datos del usuario y genera un token. |
| Validacion en BD | Se actualiza `usr_ultimo_acceso` y `usr_sesion_activa` cambia a `1`. |
| Estado | Aprobado. |

Consulta SQL sugerida antes y despues del login:

```sql
SELECT usr_correo, usr_ultimo_acceso, usr_sesion_activa
FROM USUARIO
WHERE usr_correo = 'correo_prueba@artify.local';
```

---

### CP-004 - Login con correo no registrado

| Campo | Detalle |
| --- | --- |
| Objetivo | Verificar que el sistema rechace un correo inexistente. |
| Precondicion | El correo no debe existir en la base de datos. |
| Datos de entrada | Correo no registrado y cualquier contrasena valida en formato. |
| Pasos | Enviar solicitud de login. |
| Resultado esperado | El sistema responde `Usuario no encontrado`. |
| Codigo esperado | HTTP 401. |
| Validacion en BD | No se modifica ningun registro de la tabla `USUARIO`. |
| Estado | Aprobado. |

---

### CP-005 - Login con contrasena incorrecta

| Campo | Detalle |
| --- | --- |
| Objetivo | Verificar que el sistema rechace una contrasena incorrecta. |
| Precondicion | El correo debe existir en la base de datos. |
| Datos de entrada | Correo valido y contrasena incorrecta. |
| Pasos | Enviar solicitud de login. |
| Resultado esperado | El sistema responde `Contrasena incorrecta`. |
| Codigo esperado | HTTP 401. |
| Validacion en BD | No debe actualizarse el acceso del usuario como sesion valida. |
| Estado | Aprobado. |

---

### CP-006 - Login con formato de correo invalido

| Campo | Detalle |
| --- | --- |
| Objetivo | Validar que el backend rechace correos con formato incorrecto. |
| Precondicion | Ninguna. |
| Datos de entrada | Correo con formato invalido, por ejemplo `correo-invalido`. |
| Pasos | Enviar solicitud de login. |
| Resultado esperado | El sistema responde `Ingresa un correo valido`. |
| Codigo esperado | HTTP 400. |
| Validacion en BD | No se consulta ni modifica un usuario valido. |
| Estado | Aprobado. |

---

### CP-007 - Generacion de token en login exitoso

| Campo | Detalle |
| --- | --- |
| Objetivo | Verificar que el backend entregue un token al autenticar correctamente. |
| Precondicion | Usuario registrado y activo. |
| Datos de entrada | Correo y contrasena correctos. |
| Pasos | Ejecutar login. |
| Resultado esperado | La respuesta incluye el campo `token`. |
| Validacion adicional | El token contiene informacion firmada del usuario, como `id`, `correo` y `rol`. |
| Estado | Aprobado. |

---

## 7. Validaciones Directas en Base de Datos

### 7.1 Consultar usuario registrado

```sql
SELECT usr_id_usuario, usr_nombres, usr_correo, usr_fecha_registro
FROM USUARIO
WHERE usr_correo = 'correo_prueba@artify.local';
```

### 7.2 Verificar hash de contrasena

```sql
SELECT usr_correo, usr_contrasena
FROM USUARIO
WHERE usr_correo = 'correo_prueba@artify.local';
```

Resultado esperado:

```text
La columna usr_contrasena no debe contener la contrasena escrita por el usuario.
Debe contener un hash bcrypt similar a: $2b$10$...
```

### 7.3 Verificar cambios despues del login

```sql
SELECT usr_correo, usr_ultimo_acceso, usr_sesion_activa
FROM USUARIO
WHERE usr_correo = 'correo_prueba@artify.local';
```

Resultado esperado despues de login exitoso:

```text
usr_ultimo_acceso: fecha y hora actualizada
usr_sesion_activa: 1
```

---

## 8. Evidencia Automatizada Complementaria

Como apoyo al plan de pruebas manual, tambien agregue una prueba automatizada de integracion en:

```text
backend/tests/api.test.js
```

Esta prueba automatizada valida:

- Rechazo de login con correo invalido.
- Registro de usuario temporal.
- Login exitoso.
- Generacion de token.
- Acceso a rutas protegidas con token.
- Rechazo de rutas protegidas sin token.
- Autenticacion de administrador.
- Limpieza del usuario temporal en la base de datos.

Comando de ejecucion:

```bash
cd backend
npm test
```

Resultado obtenido:

```text
5 pruebas ejecutadas
5 pruebas aprobadas
0 pruebas fallidas
```

---

## 9. Criterios de Aceptacion

Considero aprobado el modulo de autenticacion si cumple con los siguientes criterios:

- El usuario puede iniciar sesion con credenciales validas.
- El sistema rechaza credenciales invalidas.
- El sistema valida el formato del correo antes de autenticar.
- La contrasena se almacena como hash bcrypt y no en texto plano.
- El login exitoso actualiza `usr_ultimo_acceso` y `usr_sesion_activa`.
- El backend genera un token para el usuario autenticado.
- Las rutas protegidas rechazan solicitudes sin token.

---

## 10. Conclusiones

Despues de realizar este plan de pruebas, concluyo que el modulo de autenticacion de Artify cumple con los criterios basicos de seguridad esperados para el proyecto. La contrasena del usuario se encripta antes de almacenarse en la base de datos mediante `bcrypt`, y durante el login se compara la contrasena ingresada contra el hash almacenado.

Las pruebas realizadas me permitieron confirmar que el sistema diferencia correctamente entre credenciales validas, usuarios inexistentes, contrasenas incorrectas y formatos de correo invalidos. Ademas, verifique que un login exitoso genera un token de autenticacion y actualiza informacion de acceso en la tabla `USUARIO`.

Como mejora futura, considero importante mantener las pruebas automatizadas y ampliarlas progresivamente para cubrir recuperacion de contrasena, bloqueo por multiples intentos fallidos y expiracion de tokens.
