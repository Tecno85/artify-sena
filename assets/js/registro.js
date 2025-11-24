// ========== ESPERAR A QUE EL DOM CARGUE ==========
document.addEventListener('DOMContentLoaded', () => {
  // ========== CONFIGURACIÓN INICIAL ==========
  const registroForm = document.getElementById('registroForm');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const strengthFill = document.getElementById('strength-fill');
  const strengthText = document.getElementById('strength-text');
  const fechaNacimientoInput = document.getElementById('fechaNacimiento');

  // Verificar que existan los elementos
  if (!registroForm) {
    console.error('❌ No se encontró el formulario de registro');
    return;
  }

  // Establecer fecha máxima (18 años atrás desde hoy)
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  fechaNacimientoInput.max = maxDate.toISOString().split('T')[0];

  // ========== TOGGLE MOSTRAR/OCULTAR CONTRASEÑA ==========
  const toggleButtons = document.querySelectorAll('.toggle-password');

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target;
      const input = document.getElementById(targetId);
      const img = button.querySelector('img');

      const type = input.type === 'password' ? 'text' : 'password';
      input.type = type;

      const iconSrc =
        type === 'password'
          ? '../assets/icons/eye.svg'
          : '../assets/icons/eye-slash.svg';
      img.src = iconSrc;
    });
  });

  // ========== INDICADOR DE FORTALEZA DE CONTRASEÑA ==========
  function evaluarFortaleza(password) {
    if (!password) {
      return { strength: 'none', text: 'Sin contraseña' };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return { strength: 'weak', text: 'Débil' };
    } else if (score <= 4) {
      return { strength: 'medium', text: 'Media' };
    } else {
      return { strength: 'strong', text: 'Fuerte' };
    }
  }

  passwordInput.addEventListener('input', () => {
    const result = evaluarFortaleza(passwordInput.value);

    strengthFill.classList.remove('weak', 'medium', 'strong');
    strengthText.classList.remove('weak', 'medium', 'strong');

    if (result.strength !== 'none') {
      strengthFill.classList.add(result.strength);
      strengthText.classList.add(result.strength);
    }

    strengthText.textContent = result.text;
  });

  // ========== VALIDACIONES ==========
  function mostrarError(inputId, mensaje) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(`${inputId}-error`);

    if (input && errorSpan) {
      input.classList.add('error');
      errorSpan.textContent = mensaje;
      errorSpan.classList.add('show');
    }
  }

  function limpiarError(inputId) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(`${inputId}-error`);

    if (input && errorSpan) {
      input.classList.remove('error');
      errorSpan.classList.remove('show');
    }
  }

  function limpiarTodosLosErrores() {
    const inputs = [
      'nombres',
      'apellidos',
      'cedula',
      'fechaNacimiento',
      'email',
      'password',
      'confirmPassword',
      'terminos',
    ];
    inputs.forEach((id) => limpiarError(id));
  }

  function validarSoloLetras(input) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    return regex.test(input.value) && input.value.length >= 2;
  }

  function validarCedula(input) {
    const regex = /^[0-9]{6,10}$/;
    return regex.test(input.value);
  }

  function validarEdad(input) {
    const fechaNac = new Date(input.value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    return edad >= 18;
  }

  function validarEmail(input) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(input.value);
  }

  function validarPassword(input) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(input.value);
  }

  function capitalizarPalabras(input) {
    const palabras = input.value.split(' ');
    const capitalizadas = palabras.map((palabra) => {
      if (palabra.length > 0) {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
      }
      return palabra;
    });
    input.value = capitalizadas.join(' ');
  }

  // ========== VALIDACIONES EN TIEMPO REAL ==========
  document.getElementById('nombres').addEventListener('blur', function () {
    if (!validarSoloLetras(this)) {
      mostrarError('nombres', 'Solo letras, mínimo 2 caracteres');
    } else {
      limpiarError('nombres');
    }
  });

  document.getElementById('apellidos').addEventListener('blur', function () {
    if (!validarSoloLetras(this)) {
      mostrarError('apellidos', 'Solo letras, mínimo 2 caracteres');
    } else {
      limpiarError('apellidos');
    }
  });

  document.getElementById('cedula').addEventListener('blur', function () {
    if (!validarCedula(this)) {
      mostrarError('cedula', 'Cédula debe tener entre 6 y 10 dígitos');
    } else {
      limpiarError('cedula');
    }
  });

  document
    .getElementById('fechaNacimiento')
    .addEventListener('blur', function () {
      if (!this.value) {
        mostrarError(
          'fechaNacimiento',
          'Debes ingresar tu fecha de nacimiento'
        );
      } else if (!validarEdad(this)) {
        mostrarError('fechaNacimiento', 'Debes ser mayor de 18 años');
      } else {
        limpiarError('fechaNacimiento');
      }
    });

  document.getElementById('email').addEventListener('blur', function () {
    if (!validarEmail(this)) {
      mostrarError('email', 'Formato de correo inválido');
    } else {
      limpiarError('email');
    }
  });

  document.getElementById('password').addEventListener('blur', function () {
    if (!validarPassword(this)) {
      mostrarError(
        'password',
        'Mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número'
      );
    } else {
      limpiarError('password');
    }
  });

  confirmPasswordInput.addEventListener('blur', function () {
    if (this.value !== passwordInput.value) {
      mostrarError('confirmPassword', 'Las contraseñas no coinciden');
    } else {
      limpiarError('confirmPassword');
    }
  });

  document.getElementById('nombres').addEventListener('blur', function () {
    capitalizarPalabras(this);
  });

  document.getElementById('apellidos').addEventListener('blur', function () {
    capitalizarPalabras(this);
  });

  document.getElementById('cedula').addEventListener('input', function () {
    this.value = this.value.replace(/\s/g, '');
  });

  // ========== SUBMIT DEL FORMULARIO ==========
  registroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    limpiarTodosLosErrores();

    let isValid = true;

    const nombres = document.getElementById('nombres');
    if (!validarSoloLetras(nombres)) {
      mostrarError('nombres', 'Solo letras, mínimo 2 caracteres');
      isValid = false;
    }

    const apellidos = document.getElementById('apellidos');
    if (!validarSoloLetras(apellidos)) {
      mostrarError('apellidos', 'Solo letras, mínimo 2 caracteres');
      isValid = false;
    }

    const cedula = document.getElementById('cedula');
    if (!validarCedula(cedula)) {
      mostrarError('cedula', 'Cédula debe tener entre 6 y 10 dígitos');
      isValid = false;
    }

    const fechaNacimiento = document.getElementById('fechaNacimiento');
    if (!fechaNacimiento.value) {
      mostrarError('fechaNacimiento', 'Debes ingresar tu fecha de nacimiento');
      isValid = false;
    } else if (!validarEdad(fechaNacimiento)) {
      mostrarError('fechaNacimiento', 'Debes ser mayor de 18 años');
      isValid = false;
    }

    const email = document.getElementById('email');
    if (!validarEmail(email)) {
      mostrarError('email', 'Por favor ingresa un correo válido');
      isValid = false;
    }

    const password = document.getElementById('password');
    if (!validarPassword(password)) {
      mostrarError(
        'password',
        'Mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número'
      );
      isValid = false;
    }

    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword.value !== password.value) {
      mostrarError('confirmPassword', 'Las contraseñas no coinciden');
      isValid = false;
    }

    const terminos = document.getElementById('terminos');
    if (!terminos.checked) {
      mostrarError('terminos', 'Debes aceptar los términos y condiciones');
      isValid = false;
    }

    if (isValid) {
      console.log('✅ Formulario válido, iniciando registro...');

      const btnRegistrarse = registroForm.querySelector(
        'button[type="submit"]'
      );
      btnRegistrarse.disabled = true;
      btnRegistrarse.textContent = 'Registrando...';

      setTimeout(() => {
        const usuario = {
          nombres: nombres.value,
          apellidos: apellidos.value,
          cedula: cedula.value,
          fechaNacimiento: fechaNacimiento.value,
          email: email.value,
          fechaRegistro: new Date().toISOString(),
          sesionActiva: true,
        };

        console.log('💾 Guardando usuario:', usuario);

        localStorage.setItem('artifyUser', JSON.stringify(usuario));
        localStorage.setItem('artifyToken', 'token-simulado-' + Date.now());

        console.log('🚀 Redirigiendo al editor...');

        mostrarNotificacionRegistro(
          'success',
          '¡Registro exitoso! Redirigiendo al editor...'
        );

        setTimeout(() => {
          window.location.href = './editor.html';
        }, 1500);
      }, 1000);
    } else {
      const primerError = document.querySelector('.error-message.show');
      if (primerError) {
        primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  // ========== BOTÓN CANCELAR ==========
  document.getElementById('btnCancelar').addEventListener('click', () => {
    if (confirm('¿Estás seguro de que deseas cancelar el registro?')) {
      window.location.href = '../index.html';
    }
  });

  // ========== FUNCIÓN DE NOTIFICACIÓN ==========
  function mostrarNotificacionRegistro(tipo, mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = `notification-registro notification-${tipo}`;
    notificacion.setAttribute('role', 'alert');
    notificacion.setAttribute('aria-live', 'assertive');

    const iconos = {
      error: '❌',
      warning: '⚠️',
      success: '✓',
      info: 'ℹ️',
    };

    notificacion.innerHTML = `
      <div class="notif-icon">${iconos[tipo]}</div>
      <div class="notif-message">${mensaje}</div>
    `;

    document.body.appendChild(notificacion);

    setTimeout(() => {
      notificacion.classList.add('show');
    }, 10);

    setTimeout(() => {
      notificacion.classList.remove('show');
      setTimeout(() => notificacion.remove(), 300);
    }, 3000);
  }

  console.log('✅ Sistema de registro cargado correctamente');
}); // ⬅️ FIN del DOMContentLoaded
