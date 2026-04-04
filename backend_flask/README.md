# Backend Flask — Artify

> Servidor HTTP desarrollado con el framework Flask, conectado a MySQL con encriptación bcrypt.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Endpoints](#-endpoints)
- [Comparación con el Backend Python Puro](#-comparación-con-el-backend-python-puro)

---

## 📖 Descripción

Este backend implementa una API REST usando **Flask**, un microframework ligero de Python. A diferencia del backend Python puro (`backend_python/`), Flask proporciona enrutamiento, manejo de peticiones y utilidades de respuesta integradas, lo que hace el código más limpio y profesional.

Se conecta a una base de datos MySQL y expone endpoints RESTful para el login, registro y CRUD completo sobre la tabla USUARIO.

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Python | 3.13+ | Lenguaje principal |
| Flask | 3.1.3 | Framework web |
| Flask-CORS | 6.0.2 | Peticiones entre orígenes |
| mysql-connector-python | 9.6+ | Conexión a MySQL |
| bcrypt | 5.0+ | Encriptación de contraseñas |
| python-dotenv | 1.2+ | Variables de entorno |

---

## ✅ Requisitos Previos

Antes de instalar asegúrate de tener:

- [Python](https://www.python.org/) 3.13 o superior
- [MySQL](https://dev.mysql.com/downloads/) 8.0 o superior
- [Git](https://git-scm.com/) para clonar el repositorio
- La base de datos `artify_db` creada con todas sus tablas

Verifica tu versión de Python:

```bash
python3 --version
```

---

## 🚀 Instalación

### 1. Navega a la carpeta del backend Flask

```bash
cd backend_flask
```

### 2. Instala las dependencias

```bash
pip3 install -r requirements.txt --break-system-packages
```

---

## ⚙️ Configuración

### 1. Crea el archivo de variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

### 2. Edita el archivo `.env` con tus credenciales

```env
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=artify_db
```

> ⚠️ **Importante:** El archivo `.env` nunca se sube a GitHub.
> Está incluido en el `.gitignore` del proyecto.

### 3. Crear la base de datos

Importa el script SQL incluido en la carpeta `database/`:

```bash
mysql -u root -p < ../database/artify_db.sql
```

O desde MySQL Workbench:

```
Server → Data Import → Import from Self-Contained File
Selecciona: database/artify_db.sql
Clic en: Start Import
```

> ⚠️ **Importante:** El script crea automáticamente la base de datos
> `artify_db` con todas sus tablas.

---

## ▶️ Uso

### Iniciar el servidor

```bash
python3 app.py
```

Debes ver:

```
✅ Flask server running on http://localhost:3002
🚀 Available endpoints:
   POST   http://localhost:3002/api/login
   POST   http://localhost:3002/api/registro
   GET    http://localhost:3002/api/admin/usuarios
   POST   http://localhost:3002/api/admin/usuario
   PUT    http://localhost:3002/api/admin/usuario/<id>
   DELETE http://localhost:3002/api/admin/usuario/<id>
```

### Detener el servidor

```bash
Ctrl + C
```

---

## 🔌 Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/login` | Iniciar sesión con bcrypt |
| `POST` | `/api/registro` | Registrar nuevo usuario |
| `GET` | `/api/admin/usuarios` | Consultar todos los usuarios |
| `POST` | `/api/admin/usuario` | Insertar nuevo usuario |
| `PUT` | `/api/admin/usuario/<id>` | Actualizar usuario por ID |
| `DELETE` | `/api/admin/usuario/<id>` | Eliminar usuario por ID |

---

## 🔄 Comparación con el Backend Python Puro

| Característica | Python Puro (`backend_python/`) | Flask (`backend_flask/`) |
|----------------|--------------------------------|--------------------------|
| Puerto | 3001 | 3002 |
| Enrutamiento | Manual con `urlparse` y `re` | Decorador `@app.route()` |
| Métodos HTTP | `do_GET`, `do_POST`, `do_PUT`, `do_DELETE` | Definidos en `@app.route(methods=[])` |
| CORS | Manejador `do_OPTIONS` manual | Extensión `Flask-CORS` |
| Datos de petición | `self.rfile.read()` + `json.loads()` | `request.get_json()` |
| Respuesta | Headers manuales + `self.wfile.write()` | `jsonify()` |
| Parámetros URL | Regex manual `re.match()` | `<int:usuario_id>` en la ruta |
| Complejidad del código | Mayor | Menor |
| Valor académico | Entender HTTP internamente | Estándar de la industria |

---

*Proyecto Artify — Análisis y Desarrollo de Software — SENA 2026*
