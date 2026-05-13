# Guia de Despliegue y Ejecucion Local

> **Proyecto:** Artify - Editor de Imagenes Web  
> **Entorno principal:** Local / desarrollo  
> **Backend:** Node.js + Express  
> **Frontend:** HTML, CSS y JavaScript Vanilla  
> **Base de datos:** MySQL  
> **Fecha:** Mayo 2026

---

## 1. Objetivo del Documento

Este documento describe los pasos tecnicos necesarios para preparar, ejecutar y verificar Artify en un entorno local. Hace parte del manual tecnico y complementa el `README.md`, evitando repetir la descripcion general del proyecto.

---

## 2. Requisitos Previos

Antes de ejecutar el proyecto se requiere tener instalado:

| Herramienta | Version recomendada | Uso |
| --- | --- | --- |
| Node.js | 22.13 o superior | Ejecutar el backend. |
| pnpm | 11.1.1 | Instalar dependencias y ejecutar scripts del backend. |
| MySQL | 8.0 o superior | Base de datos relacional. |
| Git | Version estable | Clonar y versionar el proyecto. |
| Navegador moderno | Chrome, Edge, Firefox, Safari u Opera | Usar el frontend. |

---

## 3. Clonar el Proyecto

```bash
git clone https://github.com/Tecno85/artify-sena.git
cd artify-sena
```

---

## 4. Instalar Dependencias del Backend

Las dependencias se instalan dentro de la carpeta `backend/`.

```bash
cd backend
pnpm install
```

El proyecto usa `pnpm` como gestor oficial. No se debe mezclar con `npm install` ni generar `package-lock.json`.

---

## 5. Configurar Variables de Entorno

El backend necesita un archivo `.env` dentro de `backend/`. Se puede crear a partir de `.env.example`.

```bash
cp ../.env.example .env
```

Variables principales:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contrasena_mysql
DB_NAME=artify_db

ADMIN_USER=admin@artify.com
ADMIN_PASSWORD=tu_contrasena_admin

TOKEN_SECRET=un_secreto_largo_y_aleatorio
PORT=3000
NODE_ENV=development
```

### Consideraciones

- `backend/.env` no debe subirse al repositorio.
- `TOKEN_SECRET` debe ser largo y dificil de adivinar.
- `ADMIN_PASSWORD` debe cambiarse por una contrasena segura en cada entorno.

---

## 6. Crear la Base de Datos

El script principal de base de datos se encuentra en:

```text
database/artify_db.sql
```

Desde la raiz del proyecto se puede importar con:

```bash
mysql -u root -p < database/artify_db.sql
```

Tambien se puede ejecutar el script desde MySQL Workbench u otra herramienta compatible.

Al finalizar, debe existir la base de datos:

```text
artify_db
```

---

## 7. Ejecutar el Backend

Desde la carpeta `backend/`:

```bash
pnpm start
```

Salida esperada:

```text
Conectado a MySQL correctamente
Servidor corriendo en http://localhost:3000
```

Para desarrollo con recarga automatica:

```bash
pnpm run dev
```

---

## 8. Ejecutar el Frontend

El frontend es estatico. Para probar rutas y navegacion de forma mas estable se recomienda servir la carpeta `frontend/` por HTTP.

Desde la raiz del proyecto:

```bash
npx http-server frontend -p 8080
```

Luego abrir:

```text
http://127.0.0.1:8080
```

Tambien es posible abrir `frontend/index.html` directamente, pero para pruebas completas se recomienda usar servidor local.

---

## 9. Verificar el Funcionamiento

### Verificacion del backend

```bash
cd backend
pnpm run check
```

### Pruebas automatizadas

```bash
cd backend
pnpm test
```

La suite actual valida autenticacion, rutas protegidas, tokens, configuracion basica y limpieza de usuarios temporales.

### Verificacion manual basica

1. Abrir `http://127.0.0.1:8080`.
2. Registrar un usuario de prueba.
3. Iniciar sesion.
4. Confirmar redireccion al editor.
5. Cargar una imagen.
6. Probar una operacion de edicion.
7. Descargar la imagen resultante.

---

## 10. Puertos Utilizados

| Servicio | Puerto | Descripcion |
| --- | --- | --- |
| Backend Express | `3000` | API principal del sistema. |
| Frontend local | `8080` | Servidor estatico recomendado para pruebas. |
| MySQL | `3306` | Puerto habitual de MySQL. |
| Backend de pruebas | `3100` | Puerto usado por la suite automatizada cuando aplica. |

---

## 11. Script de Configuracion Inicial

El proyecto incluye un script de apoyo:

```text
scripts/setup.sh
```

Este script instala dependencias del backend y crea `backend/.env` desde `.env.example` si todavia no existe.

Ejecucion:

```bash
./scripts/setup.sh
```

Despues de ejecutarlo, se debe revisar manualmente `backend/.env` y cargar la base de datos.

---

## 12. Problemas Comunes

| Problema | Posible causa | Solucion |
| --- | --- | --- |
| `Error al conectar a MySQL` | Credenciales incorrectas o MySQL detenido. | Revisar `backend/.env` e iniciar MySQL. |
| `Unknown command: pnpm` | pnpm no esta instalado o no esta en el PATH. | Instalar pnpm y abrir una nueva terminal. |
| API no responde | Backend no iniciado o puerto incorrecto. | Ejecutar `pnpm start` en `backend/`. |
| Login falla aunque el usuario existe | Contrasena incorrecta o hash invalido. | Verificar registro y datos en `USUARIO`. |
| Frontend no consume API | Backend apagado o URL incorrecta. | Confirmar que API este en `http://localhost:3000`. |

---

## 13. Criterios de Mantenimiento

- Mantener `.env.example` actualizado cuando cambien variables requeridas.
- Mantener `backend/package.json` como referencia de scripts oficiales.
- Usar `pnpm-lock.yaml` para reproducibilidad de dependencias.
- Actualizar esta guia cuando cambien puertos, comandos, gestor de paquetes o pasos de instalacion.
- No documentar credenciales reales en archivos versionados.
