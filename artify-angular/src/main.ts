import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

/**
 * Punto de entrada de la aplicacion Angular.
 *
 * Aqui se inicia el componente raiz (`AppComponent`) y se registran los
 * proveedores globales que necesita la evidencia: cliente HTTP para consumir
 * el backend de Artify y router para manejar la navegacion interna.
 */
bootstrapApplication(AppComponent, {
  providers: [
    // Habilita HttpClient para que los servicios puedan llamar a la API REST.
    provideHttpClient(),
    // Registra las rutas protegidas y publicas definidas en app.routes.ts.
    provideRouter(routes, withComponentInputBinding()),
  ],
}).catch((err) => console.error(err));
