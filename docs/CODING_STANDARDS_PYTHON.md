# Estándares de Codificación Python — Proyecto Artify

> **Versión:** 1.0  
> **Fecha:** Marzo 2026  
> **Autor:** Ivan Dario Madrid Daza  
> **Programa:** Análisis y Desarrollo de Software — SENA  
> **Archivo:** `backend_python/server.py`

---

## Tabla de Contenidos

1. [Estructura y Organización de Archivos](#1-estructura-y-organización-de-archivos)
2. [Nombramiento de Clases](#2-nombramiento-de-clases)
3. [Nombramiento de Métodos](#3-nombramiento-de-métodos)
4. [Nombramiento de Variables y Constantes](#4-nombramiento-de-variables-y-constantes)
5. [Nombramiento de Paquetes e Imports](#5-nombramiento-de-paquetes-e-imports)
6. [Estándares para Métodos HTTP](#6-estándares-para-métodos-http)
7. [Estándares para Consultas SQL](#7-estándares-para-consultas-sql)
8. [Convenciones para Comentarios](#8-convenciones-para-comentarios)
9. [Manejo de Errores](#9-manejo-de-errores)
10. [Convenciones para Commits de Git](#10-convenciones-para-commits-de-git)

---

## 1. Estructura y Organización de Archivos

### Estructura del backend Python

```
📁 Artify/
│
├── 📁 backend_python/
│   ├─ 🐍 server.py                   → Servidor HTTP sin framework
│   ├─ 📖 README.md                   → Documentación e instalación
│   ├─ ⚙️ .env.example                → Ejemplo de variables de entorno
│   └─ 🔒 .env                        → Credenciales (no se sube a GitHub)
│
├── 📁 database/
│   └─ 🗄️ artify_db.sql               → Script SQL de la base de datos
│
├── 📁 docs/
│   ├─ 📄 CODING_STANDARDS.md         → Estándares Node.js
│   └─ 📄 CODING_STANDARDS_PYTHON.md  → Estándares Python
│
└── 🚫 .gitignore                     → Incluye .env y __pycache__
```

### Reglas de organización

- Todo el backend Python vive en la carpeta `backend_python/`.
- Las credenciales de la base de datos siempre van en `.env` y nunca se suben a GitHub.
- Los archivos compilados de Python `__pycache__` se ignoran con `.gitignore`.
- El servidor se inicia desde la carpeta `backend_python/` con `python3 server.py`.

---

## 2. Nombramiento de Clases

### Convención — PascalCase

Las clases en Python siguen la convención **PascalCase** donde cada palabra comienza con mayúscula sin guiones ni espacios.

```python
# ✅ Correcto — tomado de server.py
class ArtifyHandler(BaseHTTPRequestHandler):
    ...

# ❌ Incorrecto
class artify_handler(BaseHTTPRequestHandler):
class artifyHandler(BaseHTTPRequestHandler):
class ARTIFYHANDLER(BaseHTTPRequestHandler):
```

### Nombres descriptivos

El nombre de la clase debe describir claramente su propósito.

```python
# ✅ Correcto
# ArtifyHandler → manejador de peticiones HTTP del servidor Artify
class ArtifyHandler(BaseHTTPRequestHandler):

# ❌ Incorrecto — nombre genérico sin contexto
class Handler(BaseHTTPRequestHandler):
class Server(BaseHTTPRequestHandler):
```

---

## 3. Nombramiento de Métodos

### Convención — snake_case

Los métodos en Python siguen la convención **snake_case** donde las palabras se separan con guiones bajos y todo va en minúsculas.

```python
# ✅ Correcto — tomado de server.py
def handle_login(self, data):
def handle_registro(self, data):
def handle_get_usuarios(self):
def handle_agregar_usuario(self, data):
def handle_editar_usuario(self, usuario_id, data):
def handle_eliminar_usuario(self, usuario_id):
def send_json_response(self, status, data):
def read_body(self):

# ❌ Incorrecto
def handleLogin(self, data):       # camelCase no es estándar en Python
def HandleRegistro(self, data):    # PascalCase es solo para clases
def HANDLE_LOGIN(self, data):      # mayúsculas son para constantes
```

### Métodos HTTP nativos — do_ prefix

Los métodos que manejan peticiones HTTP siguen la convención nativa de `BaseHTTPRequestHandler` con el prefijo `do_` en mayúsculas.

```python
# ✅ Correcto — convención nativa de Python
def do_GET(self):      # Maneja peticiones GET
def do_POST(self):     # Maneja peticiones POST
def do_PUT(self):      # Maneja peticiones PUT
def do_DELETE(self):   # Maneja peticiones DELETE
def do_OPTIONS(self):  # Maneja preflight CORS
```

### Verbos descriptivos en español

Los métodos de lógica de negocio usan verbos en español que describen claramente su acción.

```python
# ✅ Correcto — tomado de server.py
def handle_login(self, data):              # maneja el login
def handle_registro(self, data):           # maneja el registro
def handle_get_usuarios(self):             # obtiene usuarios
def handle_agregar_usuario(self, data):    # agrega un usuario
def handle_editar_usuario(self, id, data): # edita un usuario
def handle_eliminar_usuario(self, id):     # elimina un usuario
```

---

## 4. Nombramiento de Variables y Constantes

### Variables — snake_case

```python
# ✅ Correcto — tomado de server.py
usuario_id    = int(match.group(1))
password_valida = bcrypt.checkpw(...)
fecha_nac     = data.get('fechaNacimiento', None)
nuevo_id      = cursor.lastrowid
content_length = int(self.headers.get('Content-Length', 0))

# ❌ Incorrecto
usuarioId     = int(match.group(1))   # camelCase no es estándar en Python
PasswordValida = bcrypt.checkpw(...)  # PascalCase es solo para clases
FECHANAC      = data.get(...)         # mayúsculas son para constantes
```

### Constantes — UPPER_SNAKE_CASE

```python
# ✅ Correcto — tomado de server.py
PORT = 3001

# ❌ Incorrecto
port = 3001
Port = 3001
```

### Parámetros de métodos — snake_case

```python
# ✅ Correcto — tomado de server.py
def handle_editar_usuario(self, usuario_id, data):
def send_json_response(self, status, data):
def handle_eliminar_usuario(self, usuario_id):

# ❌ Incorrecto
def handle_editar_usuario(self, usuarioId, Data):
def send_json_response(self, Status, Data):
```

### Variables de entorno — os.getenv()

```python
# ✅ Correcto — tomado de server.py
def get_connection():
    return mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )

# ❌ Incorrecto — nunca hardcodear credenciales
def get_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='mi_contrasena',
        database='artify_db'
    )
```

---

## 5. Nombramiento de Paquetes e Imports

### Organización de imports — PEP 8

Siguiendo la guía de estilo oficial de Python **PEP 8**, los imports se organizan en tres grupos separados por una línea en blanco:

1. Módulos Nativos — incluidos en Python, no requieren instalación
2. Módulos Externos — instalados con pip
3. Módulos Propios — archivos del mismo proyecto (no aplica en 
   este proyecto ya que toda la lógica está en server.py)

## ✅ Correcto — tomado de server.py

### Módulos Nativos
import json
import os
import re
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

### Módulos Externos instalados con pip
import bcrypt
import mysql.connector
from dotenv import load_dotenv

### Módulos Propios del proyecto
No aplica en este proyecto ya que toda la lógica está centralizada en server.py

### ❌ Incorrecto — imports mezclados sin organización
import bcrypt
import json
from dotenv import load_dotenv
import os
import mysql.connector
import re
```

### Alias de imports

```python
# ✅ Correcto — solo cuando el alias mejora la legibilidad
import mysql.connector

# ❌ Incorrecto — alias innecesarios que confunden
import json as j
import os as sistema
```

---

## 6. Estándares para Métodos HTTP

### Estructura de do_POST

```python
# ✅ Correcto — tomado de server.py
def do_POST(self):
    path = urlparse(self.path).path
    data = self.read_body()

    if path == '/api/login':
        self.handle_login(data)

    elif path == '/api/registro':
        self.handle_registro(data)

    elif path == '/api/admin/usuario':
        self.handle_agregar_usuario(data)

    else:
        self.send_json_response(404, {'mensaje': 'Ruta no encontrada'})
```

### Estructura de do_PUT y do_DELETE con parámetros en la URL

```python
# ✅ Correcto — tomado de server.py
def do_PUT(self):
    path  = urlparse(self.path).path
    data  = self.read_body()
    match = re.match(r'^/api/admin/usuario/(\d+)$', path)

    if match:
        usuario_id = int(match.group(1))
        self.handle_editar_usuario(usuario_id, data)
    else:
        self.send_json_response(404, {'mensaje': 'Ruta no encontrada'})
```

### Respuestas JSON — send_json_response

```python
# ✅ Correcto — tomado de server.py
self.send_json_response(200, {'mensaje': 'Login exitoso', 'usuario': {...}})
self.send_json_response(200, {'mensaje': 'Registro exitoso', 'usuario': {...}})
self.send_json_response(200, {'mensaje': 'Usuario agregado correctamente'})
self.send_json_response(200, {'mensaje': 'Usuario editado correctamente'})
self.send_json_response(200, {'mensaje': 'Usuario eliminado correctamente'})
self.send_json_response(400, {'mensaje': 'Todos los campos son requeridos'})
self.send_json_response(401, {'mensaje': 'Usuario no encontrado'})
self.send_json_response(404, {'mensaje': 'Ruta no encontrada'})
self.send_json_response(500, {'mensaje': 'Error en el servidor'})
```

---

## 7. Estándares para Consultas SQL

### Consultas multilínea con indentación

```python
# ✅ Correcto — tomado de server.py
cursor.execute('''
    SELECT usr_id_usuario, usr_nombres, usr_apellidos,
           usr_cedula, usr_correo, usr_fecha_nacimiento,
           usr_fecha_registro, usr_estado_usuario, usr_rol
    FROM USUARIO
    ORDER BY usr_fecha_registro DESC
''')

cursor.execute('''
    INSERT INTO USUARIO (
        usr_nombres, usr_apellidos, usr_cedula,
        usr_correo, usr_contrasena, usr_fecha_nacimiento,
        usr_fecha_registro, usr_estado_usuario, usr_rol
    ) VALUES (%s, %s, %s, %s, %s, %s, NOW(), 'activo', 'usuario')
''', (nombres, apellidos, cedula, correo, hashed, fecha_nac))

# ❌ Incorrecto — consulta en una sola línea difícil de leer
cursor.execute('SELECT usr_id_usuario, usr_nombres, usr_apellidos, usr_cedula FROM USUARIO ORDER BY usr_fecha_registro DESC')
```

### Parámetros con %s — nunca concatenar strings

```python
# ✅ Correcto — previene inyección SQL
cursor.execute(
    'SELECT * FROM USUARIO WHERE usr_correo = %s',
    (correo,)
)

# ❌ Incorrecto — vulnerable a inyección SQL
cursor.execute(
    f'SELECT * FROM USUARIO WHERE usr_correo = {correo}'
)
```

### Eliminación en cascada

```python
# ✅ Correcto — tomado de server.py
# Eliminar registros relacionados antes del usuario principal
cursor.execute('DELETE FROM IMAGEN          WHERE img_usr_id_usuario = %s', (usuario_id,))
cursor.execute('DELETE FROM OPERACION       WHERE opr_usr_id_usuario = %s', (usuario_id,))
cursor.execute('DELETE FROM SESION_EDICION  WHERE ses_usr_id_usuario = %s', (usuario_id,))
cursor.execute('DELETE FROM CONFIGURACION   WHERE cfg_usr_id_usuario = %s', (usuario_id,))
cursor.execute('DELETE FROM USUARIO         WHERE usr_id_usuario     = %s', (usuario_id,))
conn.commit()
```

---

## 8. Convenciones para Comentarios

### Comentarios de sección — separadores con =

```python
# ✅ Correcto — tomado de server.py
# ========== DEPENDENCIAS ==========
# ========== CONFIGURACIÓN ==========
# ========== CONEXIÓN A MYSQL ==========
# ========== SERVIDOR HTTP ==========
# ========== CORS Y HEADERS ==========
# ========== ENDPOINT GET ==========
# ========== ENDPOINT POST ==========
# ========== LÓGICA DE LOGIN ==========
# ========== LÓGICA DE REGISTRO ==========
# ========== INICIAR SERVIDOR ==========
```

### Comentarios explicativos — antes del bloque

```python
# ✅ Correcto — tomado de server.py

# Leer el cuerpo de la petición
content_length = int(self.headers.get('Content-Length', 0))

# Verificar si el correo o cédula ya existe
cursor.execute('SELECT usr_id_usuario FROM USUARIO WHERE ...')

# Encriptar contraseña con bcrypt
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Convertir fechas a string para JSON
for u in usuarios:
    for key, value in u.items():
        if hasattr(value, 'isoformat'):
            u[key] = value.isoformat()

# Eliminar registros relacionados primero
cursor.execute('DELETE FROM IMAGEN WHERE img_usr_id_usuario = %s', ...)
```

### Logs en consola — con emojis descriptivos

```python
# ✅ Correcto — tomado de server.py
print(f'📨 Login recibido — Correo: {correo}')
print(f'✅ Login exitoso — {usuario["usr_nombres"]} {usuario["usr_apellidos"]}')
print(f'❌ Usuario no encontrado')
print(f'❌ Contraseña incorrecta')
print(f'📋 Cargando lista de usuarios')
print(f'✅ {len(usuarios)} usuarios encontrados')
print(f'📨 Agregar usuario — Correo: {correo}')
print(f'✅ Usuario agregado — ID: {cursor.lastrowid}')
print(f'📨 Editar usuario — ID: {usuario_id}')
print(f'✅ Usuario editado — ID: {usuario_id}')
print(f'📨 Eliminar usuario — ID: {usuario_id}')
print(f'✅ Usuario eliminado — ID: {usuario_id}')
print(f'❌ Error en login: {e}')
```

---

## 9. Manejo de Errores

### Estructura try/except/finally

```python
# ✅ Correcto — tomado de server.py
try:
    conn   = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Lógica principal
    cursor.execute(...)
    conn.commit()

    self.send_json_response(200, {'mensaje': 'ok'})

except Exception as e:
    print(f'❌ Error: {e}')
    self.send_json_response(500, {'mensaje': 'Error en el servidor'})

finally:
    try:
        cursor.close()
        conn.close()
    except Exception:
        pass
```

### Validación de campos requeridos

```python
# ✅ Correcto — tomado de server.py
if not all([nombres, apellidos, cedula, correo, password]):
    self.send_json_response(400, {'mensaje': 'Todos los campos son requeridos'})
    return

if not correo or not password:
    self.send_json_response(400, {'mensaje': 'Correo y contraseña son requeridos'})
    return
```

---

## 10. Convenciones para Commits de Git

### Formato — tipo(alcance): descripción

```bash
# ✅ Correcto — commit real del proyecto Artify
git commit -m "feat(python): agregar servidor Python sin framework con login, registro y CRUD de usuarios"
```

### Tipos de commit

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de errores |
| `style` | Cambios de formato o estilo |
| `refactor` | Reestructuración sin cambiar funcionalidad |
| `docs` | Cambios en documentación |
| `chore` | Tareas de mantenimiento |

---

## Comparación Node.js vs Python

| Concepto | Node.js (Express) | Python (Sin Framework) |
|----------|-------------------|------------------------|
| Clases | No aplica | `PascalCase` |
| Métodos | `camelCase` | `snake_case` |
| Variables | `camelCase` | `snake_case` |
| Constantes | `UPPER_SNAKE_CASE` | `UPPER_SNAKE_CASE` |
| Servidor | `express()` | `BaseHTTPRequestHandler` |
| Rutas GET | `app.get('/ruta')` | `def do_GET(self)` |
| Rutas POST | `app.post('/ruta')` | `def do_POST(self)` |
| Puerto | `3000` | `3001` |

---

*Documento generado para el proyecto Artify — SENA 2026*
