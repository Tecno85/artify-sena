# Skill: Artify - Buenas Prácticas del Proyecto

Este documento resume cómo trabajar en Artify sin repetir la documentación técnica del proyecto.

---

## Alcance

Este skill aplica al proyecto completo:
- Backend `Node.js + Express`
- Frontend `HTML + CSS + JavaScript Vanilla`
- Base de datos `MySQL`
- Gestor de paquetes del backend `pnpm`
- Documentación y control de versiones

---

## Fuentes de verdad

- `CONTEXT.md`: estado actual del proyecto, estructura real, endpoints y flujos activos.
- `README.md`: instalación, arranque y uso.
- `docs/README.md`: índice general de documentación.
- `docs/tecnica/coding-standards.md`: normas de código, comentarios y convenciones.

---

## Panorama actual

Artify ya está organizado con:
- `frontend/` para la interfaz visual
- `backend/` modular para rutas, controladores, middlewares y utilidades
- `database/` para el script SQL
- `docs/proyecto/` para documentación funcional y académica
- `docs/tecnica/` para documentación técnica y manual técnico
- `docs/SKILL_ARTIFY.md` como guía auxiliar de trabajo

La autenticación actual usa un token firmado por backend y `sessionStorage` en el frontend.

---

## Buenas prácticas de trabajo

- Mantener secretos y credenciales fuera del repositorio.
- Respetar la separación entre frontend, backend y base de datos.
- Usar `README.md` para instalación y `CONTEXT.md` para el estado real.
- Revisar `docs/tecnica/coding-standards.md` antes de tocar estilo o comentarios.
- Usar `pnpm` para instalar dependencias y ejecutar scripts del backend.
- Usar commits convencionales como `docs:`, `fix:`, `test:`, `chore:` o `feat:`.

---

## Contrato recomendado para API

La API todavía no está completamente unificada. Cuando se creen o ajusten respuestas, priorizar esta estructura como convención futura:

```json
{
  "ok": true,
  "mensaje": "Texto legible",
  "data": {}
}
```

Para errores, seguir el mismo patrón con `ok: false` y `mensaje` claro.

---

## Entorno y seguridad

- El archivo `.env` no se sube.
- `.env.example` debe reflejar las variables mínimas necesarias.
- No hardcodear credenciales, tokens ni cadenas de conexión.
- Validar siempre en backend, aunque el frontend también valide.

---

## Trabajo futuro

La evolución del proyecto debe ir en una sección separada del estado actual.

Prioridades futuras sugeridas:
- ampliar pruebas automatizadas para CRUD administrativo, analytics y flujos frontend
- mantener pruebas de autenticación actualizadas cuando cambie login, registro o tokens
- unificar respuestas API hacia el contrato `{ ok, mensaje, data }`
- mejoras de despliegue y monitoreo

---

## Mantenimiento

- Si cambian rutas, endpoints o estructura real, actualizar `CONTEXT.md` primero.
- Si cambian documentos o carpetas dentro de `docs/`, actualizar `docs/README.md`.
- Si cambian reglas de estilo, actualizar `docs/tecnica/coding-standards.md`.
- Si cambia la forma de trabajar, reflejarlo aquí sin duplicar el árbol completo del proyecto.
