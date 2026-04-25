import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
/**
 * Pantalla publica de autenticacion de la evidencia Angular.
 *
 * Usa Reactive Forms para validar datos basicos y envia las credenciales al
 * endpoint real `POST /api/login` del backend de Artify.
 */
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly loginForm = this.formBuilder.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  isSubmitting = false;
  errorMessage = '';

  /**
   * Valida el formulario, ejecuta el login real y redirige al dashboard cuando
   * el backend entrega un token valido.
   */
  submit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      // Marca los controles para que la plantilla muestre errores de validacion.
      this.loginForm.markAllAsTouched();
      return;
    }

    const { correo, password } = this.loginForm.getRawValue();
    this.isSubmitting = true;

    this.authService.login(correo, password).subscribe({
      next: () => {
        void this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        // El backend de Artify responde `mensaje`; si no llega, se informa un fallo de conexion.
        this.errorMessage = error.error?.mensaje ?? 'No se pudo iniciar sesion. Verifica el backend.';
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
}
