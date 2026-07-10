from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

from api.models import db, User


auth = Blueprint("auth", __name__)


# ======================================
# PRUEBA DEL BLUEPRINT
# ======================================

@auth.route("/test", methods=["GET"])
def test():
    return jsonify({
        "message": "Auth funcionando"
    }), 200


# ======================================
# REGISTRO
# ======================================

@auth.route("/register", methods=["POST"])
def register():
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({
            "message": "Debes enviar los datos en formato JSON"
        }), 400

    first_name = body.get("first_name", "").strip()
    last_name = body.get("last_name", "").strip()
    email = body.get("email", "").strip().lower()
    password = body.get("password", "")
    phone = body.get("phone", "").strip()
    address = body.get("address", "").strip()

    if not first_name:
        return jsonify({
            "message": "El nombre es obligatorio"
        }), 400

    if not last_name:
        return jsonify({
            "message": "El apellido es obligatorio"
        }), 400

    if not email:
        return jsonify({
            "message": "El correo electrónico es obligatorio"
        }), 400

    if "@" not in email or "." not in email:
        return jsonify({
            "message": "El correo electrónico no es válido"
        }), 400

    if not password:
        return jsonify({
            "message": "La contraseña es obligatoria"
        }), 400

    if len(password) < 6:
        return jsonify({
            "message": "La contraseña debe tener al menos 6 caracteres"
        }), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "message": "Ese correo electrónico ya está registrado"
        }), 409

    encrypted_password = generate_password_hash(password)

    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=encrypted_password,
        phone=phone or None,
        address=address or None,
        is_active=True
    )

    try:
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "message": "Usuario registrado correctamente",
            "user": new_user.serialize()
        }), 201

    except Exception as error:
        db.session.rollback()
        print(f"Error al registrar el usuario: {error}")

        return jsonify({
            "message": "No se pudo registrar el usuario"
        }), 500


# ======================================
# LOGIN
# ======================================

@auth.route("/login", methods=["POST"])
def login():
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({
            "message": "Debes enviar los datos en formato JSON"
        }), 400

    email = body.get("email", "").strip().lower()
    password = body.get("password", "")

    if not email:
        return jsonify({
            "message": "El correo electrónico es obligatorio"
        }), 400

    if not password:
        return jsonify({
            "message": "La contraseña es obligatoria"
        }), 400

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({
            "message": "Correo o contraseña incorrectos"
        }), 401

    password_is_correct = check_password_hash(
        user.password,
        password
    )

    if not password_is_correct:
        return jsonify({
            "message": "Correo o contraseña incorrectos"
        }), 401

    if not user.is_active:
        return jsonify({
            "message": "La cuenta está desactivada"
        }), 403

    access_token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "message": "Inicio de sesión correcto",
        "access_token": access_token,
        "user": user.serialize()
    }), 200
