// ========== FUNCIONES DE VALIDACIÓN ==========
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

// Toggle mostrar/ocultar contraseña
const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.getElementById('password');
const eyeIcon = document.getElementById('eye-icon');

togglePassword.addEventListener('click', () => {
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;

  // Cambiar icono
  const iconSrc =
    type === 'password'
      ? '../assets/icons/eye.svg'
      : '../assets/icons/eye-slash.svg';
  eyeIcon.src = iconSrc;
});

// Validación del formulario
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Limpiar errores previos
  emailError.classList.remove('show');
  passwordError.classList.remove('show');
  emailInput.classList.remove('error');
  passwordInput.classList.remove('error');

  let isValid = true;

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    emailError.textContent = 'Por favor ingresa un correo válido';
    emailError.classList.add('show');
    emailInput.classList.add('error');
    isValid = false;
  }

  // Validar contraseña
  if (passwordInput.value.length < 8) {
    passwordError.textContent =
      'La contraseña debe tener al menos 8 caracteres';
    passwordError.classList.add('show');
    passwordInput.classList.add('error');
    isValid = false;
  }

  if (isValid) {
    // Deshabilitar botón
    const btnLogin = loginForm.querySelector('button[type="submit"]');
    btnLogin.disabled = true;
    btnLogin.textContent = 'Iniciando sesión...';

    // Simular autenticación
    setTimeout(() => {
      // Buscar usuario en LocalStorage (simulado)
      const usuarioGuardado = localStorage.getItem('artifyUser');

      if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);

        // Validar email (simulación básica)
        if (usuario.email === emailInput.value) {
          // Crear token de sesión
          localStorage.setItem('artifyToken', 'token-simulado-' + Date.now());
          usuario.sesionActiva = true;
          localStorage.setItem('artifyUser', JSON.stringify(usuario));

          // Verificar "Recordar sesión"
          const remember = document.getElementById('remember');
          if (remember.checked) {
            localStorage.setItem('artifyRememberSession', 'true');
          }

          // Redirigir al editor
          window.location.href = './editor.html';
        } else {
          // Credenciales incorrectas
          btnLogin.disabled = false;
          btnLogin.textContent = 'Iniciar Sesión';
          mostrarError('email', 'Usuario o contraseña incorrectos');
          mostrarError('password', 'Usuario o contraseña incorrectos');
        }
      } else {
        // Usuario no existe
        btnLogin.disabled = false;
        btnLogin.textContent = 'Iniciar Sesión';
        mostrarError('email', 'Usuario no encontrado. Regístrate primero');
      }
    }, 1000);
  }
});

// Validación en tiempo real del email
emailInput.addEventListener('blur', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailInput.value && !emailRegex.test(emailInput.value)) {
    emailError.textContent = 'Formato de correo inválido';
    emailError.classList.add('show');
    emailInput.classList.add('error');
  } else {
    emailError.classList.remove('show');
    emailInput.classList.remove('error');
  }
});
