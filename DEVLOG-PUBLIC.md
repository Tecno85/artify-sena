# DEVLOG - Artify

Registro de desarrollo  del Proyecto Artify - Editor de Imágenes Web

---

## 2025-01-17
- Implementé sistema de filtros (brillo, contraste)
- Bug: filtros lagueaban con imágenes grandes → agregué debouncing 300ms
- Aprendí sobre getImageData() y manipulación de píxeles
- Pendiente: implementar filtro sepia, probar en Firefox

## 2025-01-16
- Creé sistema de historial (undo/redo)
- Decisión: límite de 20 operaciones por memoria (~60MB máx)
- Consideré IndexedDB pero muy complejo para v1
- Pendiente: optimizar para imágenes muy grandes

## 2025-01-15
- Implementé carga de imágenes (drag & drop)
- Primera decisión grande: Vanilla JS vs React → elegí Vanilla para aprender fundamentos
- Aprendí FileReader API y eventos de drag & drop
- Pendiente: agregar validación de tamaño de archivo