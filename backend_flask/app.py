# ========== DEPENDENCIAS ==========
# Módulo Nativo
import os

# Módulos Externos instalados con pip
import bcrypt
import mysql.connector
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

# ========== CONFIGURACIÓN ==========´
load_dotenv()

app = Flask(__name__)
CORS(app)

PORT = 3002

# ========== CONEXXIÓN A LA BASE DE DATOS ==========


def get_connection():
    """Crear y devolver una nueva conexión a la base de datos MySQL."""
    return mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )

# ========== ENDPOINT DE LOGIN ==========


@app.route('/api/login', methods=['POST'])
def login():
    """Valida las credenciales del usuario contra la base de datos usando bcrypt."""
    data = request.get_json()
    correo = data.get('correo', '').strip()
    password = data.get('password', '')

    print(f'📨 Login received — Email: {correo}')

    if not correo or not password:
        return jsonify({'mensaje': 'Email and password are required'}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            'SELECT * FROM USUARIO WHERE usr_correo = %s', (correo,))
        usuario = cursor.fetchone()

        if not usuario:
            print('❌ User not found')
            return jsonify({'mensaje': 'Usuario no encontrado'}), 401

        # Validar contraseña con bcrypt
        password_valida = bcrypt.checkpw(
            password.encode('utf-8'),
            usuario['usr_contrasena'].encode('utf-8')
        )

        if not password_valida:
            print('❌ Incorrect password')
            return jsonify({'mensaje': 'Contraseña incorrecta'}), 401

        print(
            f'✅ Login successful — {usuario["usr_nombres"]} {usuario["usr_apellidos"]}')

        return jsonify({
            'mensaje': 'Login exitoso',
            'usuario': {
                'id':        usuario['usr_id_usuario'],
                'nombres':   usuario['usr_nombres'],
                'apellidos': usuario['usr_apellidos'],
                'correo':    usuario['usr_correo'],
                'rol':       usuario['usr_rol'],
            }
        }), 200

    except Exception as e:
        print(f'❌ Login error: {e}')
        return jsonify({'mensaje': 'Error en el servidor'}), 500

    finally:
        try:
            cursor.close()
            conn.close()
        except Exception:
            pass

# ========== ENDPOINT DE REGISTRO ==========


@app.route('/api/registro', methods=['POST'])
def registro():
    """Registra un nuevo usuario con encriptación bcrypt."""
    data = request.get_json()
    nombres = data.get('nombres', '').strip()
    apellidos = data.get('apellidos', '').strip()
    cedula = data.get('cedula', '').strip()
    correo = data.get('correo', '').strip()
    password = data.get('password', '')
    fecha_nac = data.get('fechaNacimiento', None)

    print(f'📨 Registration received — Email: {correo}')

    if not all([nombres, apellidos, cedula, correo, password]):
        return jsonify({'mensaje': 'Todos los campos son requeridos'}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Verificar si el correo o cédula ya existe
        cursor.execute(
            'SELECT usr_id_usuario FROM USUARIO WHERE usr_correo = %s OR usr_cedula = %s',
            (correo, cedula)
        )
        existente = cursor.fetchone()

        if existente:
            print('❌ Email or cedula already registered')
            return jsonify({'mensaje': 'El correo o cédula ya está registrado'}), 400

        # Encriptar contraseña con bcrypt
        hashed = bcrypt.hashpw(password.encode(
            'utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Insertar nuevo usuario
        cursor.execute('''
            INSERT INTO USUARIO (
                usr_nombres, usr_apellidos, usr_cedula,
                usr_correo, usr_contrasena, usr_fecha_nacimiento,
                usr_fecha_registro, usr_estado_usuario, usr_rol
            ) VALUES (%s, %s, %s, %s, %s, %s, NOW(), 'activo', 'usuario')
        ''', (nombres, apellidos, cedula, correo, hashed, fecha_nac))

        conn.commit()
        nuevo_id = cursor.lastrowid

        print(f'✅ User registered successfully — ID: {nuevo_id}')

        return jsonify({
            'mensaje': 'Registro exitoso',
            'usuario': {
                'id':        nuevo_id,
                'nombres':   nombres,
                'apellidos': apellidos,
                'correo':    correo,
            }
        }), 200

    except Exception as e:
        print(f'❌ Registration error: {e}')
        return jsonify({'mensaje': 'Error en el servidor'}), 500

    finally:
        try:
            cursor.close()
            conn.close()
        except Exception:
            pass

# ========== ENDPOINT OBTENER USUARIOS ==========


@app.route('/api/admin/usuarios', methods=['GET'])
def get_usuarios():
    """Obtiene todos los usuarios ordenados por fecha de registro descendente."""
    print('📋 Loading user list')

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute('''
            SELECT usr_id_usuario, usr_nombres, usr_apellidos,
                   usr_cedula, usr_correo, usr_fecha_nacimiento,
                   usr_fecha_registro, usr_estado_usuario, usr_rol
            FROM USUARIO
            ORDER BY usr_fecha_registro DESC
        ''')
        usuarios = cursor.fetchall()

        # Convertir fechas a string para serialización JSON
        for u in usuarios:
            for key, value in u.items():
                if hasattr(value, 'isoformat'):
                    u[key] = value.isoformat()

        print(f'✅ {len(usuarios)} users found')
        return jsonify({'mensaje': 'ok', 'usuarios': usuarios}), 200

    except Exception as e:
        print(f'❌ Error fetching users: {e}')
        return jsonify({'mensaje': 'Error en el servidor'}), 500

    finally:
        try:
            cursor.close()
            conn.close()
        except Exception:
            pass

# ========== ENDPOINT AGREGAR USUARIO ==========


@app.route('/api/admin/usuario', methods=['POST'])
def agregar_usuario():
    """Agrega un nuevo usuario desde el panel de administración."""
    data = request.get_json()
    nombres = data.get('nombres', '').strip()
    apellidos = data.get('apellidos', '').strip()
    cedula = data.get('cedula', '').strip()
    correo = data.get('correo', '').strip()
    password = data.get('password', '')
    fecha_nac = data.get('fechaNacimiento', None)

    print(f'📨 Add user — Email: {correo}')

    if not all([nombres, apellidos, cedula, correo, password]):
        return jsonify({'mensaje': 'Todos los campos son requeridos'}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            'SELECT usr_id_usuario FROM USUARIO WHERE usr_correo = %s OR usr_cedula = %s',
            (correo, cedula)
        )
        existente = cursor.fetchone()

        if existente:
            return jsonify({'mensaje': 'El correo o cédula ya está registrado'}), 400

        hashed = bcrypt.hashpw(password.encode(
            'utf-8'), bcrypt.gensalt()).decode('utf-8')

        cursor.execute('''
            INSERT INTO USUARIO (
                usr_nombres, usr_apellidos, usr_cedula,
                usr_correo, usr_contrasena, usr_fecha_nacimiento,
                usr_fecha_registro, usr_estado_usuario, usr_rol
            ) VALUES (%s, %s, %s, %s, %s, %s, NOW(), 'activo', 'usuario')
        ''', (nombres, apellidos, cedula, correo, hashed, fecha_nac))

        conn.commit()
        print(f'✅ User added — ID: {cursor.lastrowid}')
        return jsonify({'mensaje': 'Usuario agregado correctamente'}), 200

    except Exception as e:
        print(f'❌ Error adding user: {e}')
        return jsonify({'mensaje': 'Error en el servidor'}), 500

    finally:
        try:
            cursor.close()
            conn.close()
        except Exception:
            pass

# ========== ENDPOINT EDITAR USUARIO ==========


@app.route('/api/admin/usuario/<int:usuario_id>', methods=['PUT'])
def editar_usuario(usuario_id):
    """Actualiza los datos de un usuario existente por ID."""
    data = request.get_json()
    nombres = data.get('nombres', '').strip()
    apellidos = data.get('apellidos', '').strip()
    cedula = data.get('cedula', '').strip()
    correo = data.get('correo', '').strip()
    estado = data.get('estado', 'activo')
    fecha_nac = data.get('fechaNacimiento', None)

    print(f'📨 Edit user — ID: {usuario_id}')

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute('''
            UPDATE USUARIO
            SET usr_nombres          = %s,
                usr_apellidos        = %s,
                usr_cedula           = %s,
                usr_correo           = %s,
                usr_fecha_nacimiento = %s,
                usr_estado_usuario   = %s
            WHERE usr_id_usuario = %s
        ''', (nombres, apellidos, cedula, correo, fecha_nac, estado, usuario_id))

        conn.commit()
        print(f'✅ User updated — ID: {usuario_id}')
        return jsonify({'mensaje': 'Usuario editado correctamente'}), 200

    except Exception as e:
        print(f'❌ Error updating user: {e}')
        return jsonify({'mensaje': 'Error en el servidor'}), 500

    finally:
        try:
            cursor.close()
            conn.close()
        except Exception:
            pass

# ========== ENDPOINT ELIMINAR USUARIO ==========


@app.route('/api/admin/usuario/<int:usuario_id>', methods=['DELETE'])
def eliminar_usuario(usuario_id):
    """Elimina un usuario y todos sus registros relacionados (eliminación en cascada)."""
    print(f'📨 Delete user — ID: {usuario_id}')

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Eliminar registros relacionados primero (cascada)
        cursor.execute(
            'DELETE FROM IMAGEN          WHERE img_usr_id_usuario = %s', (usuario_id,))
        cursor.execute(
            'DELETE FROM OPERACION       WHERE opr_usr_id_usuario = %s', (usuario_id,))
        cursor.execute(
            'DELETE FROM SESION_EDICION  WHERE ses_usr_id_usuario = %s', (usuario_id,))
        cursor.execute(
            'DELETE FROM CONFIGURACION   WHERE cfg_usr_id_usuario = %s', (usuario_id,))
        cursor.execute(
            'DELETE FROM USUARIO         WHERE usr_id_usuario     = %s', (usuario_id,))

        conn.commit()
        print(f'✅ User deleted — ID: {usuario_id}')
        return jsonify({'mensaje': 'Usuario eliminado correctamente'}), 200

    except Exception as e:
        print(f'❌ Error deleting user: {e}')
        return jsonify({'mensaje': 'Error en el servidor'}), 500

    finally:
        try:
            cursor.close()
            conn.close()
        except Exception:
            pass


# ========== INICIAR SERVIDOR ==========
if __name__ == '__main__':
    print(f'✅ Flask server running on http://localhost:{PORT}')
    print('🚀 Available endpoints:')
    print(f'   POST   http://localhost:{PORT}/api/login')
    print(f'   POST   http://localhost:{PORT}/api/registro')
    print(f'   GET    http://localhost:{PORT}/api/admin/usuarios')
    print(f'   POST   http://localhost:{PORT}/api/admin/usuario')
    print(f'   PUT    http://localhost:{PORT}/api/admin/usuario/<id>')
    print(f'   DELETE http://localhost:{PORT}/api/admin/usuario/<id>')
    app.run(port=PORT, debug=True)
