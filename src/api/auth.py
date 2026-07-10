from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)

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

    if not check_password_hash(user.password, password):
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


# ======================================
# OBTENER PERFIL
# ======================================

@auth.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()

    user = db.session.get(User, int(current_user_id))

    if user is None:
        return jsonify({
            "message": "Usuario no encontrado"
        }), 404

    if not user.is_active:
        return jsonify({
            "message": "La cuenta está desactivada"
        }), 403

    return jsonify({
        "user": user.serialize()
    }), 200


# ======================================
# EDITAR PERFIL
# ======================================

@auth.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()

    user = db.session.get(User, int(current_user_id))

    if user is None:
        return jsonify({
            "message": "Usuario no encontrado"
        }), 404

    body = request.get_json(silent=True)

    if body is None:
        return jsonify({
            "message": "Debes enviar los datos en formato JSON"
        }), 400

    first_name = body.get("first_name", user.first_name)
    last_name = body.get("last_name", user.last_name)
    email = body.get("email", user.email)
    phone = body.get("phone", user.phone)
    address = body.get("address", user.address)
    password = body.get("password")

    first_name = first_name.strip() if first_name else ""
    last_name = last_name.strip() if last_name else ""
    email = email.strip().lower() if email else ""
    phone = phone.strip() if phone else None
    address = address.strip() if address else None

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

    user_with_same_email = User.query.filter(
        User.email == email,
        User.id != user.id
    ).first()

    if user_with_same_email:
        return jsonify({
            "message": "Ese correo electrónico ya pertenece a otra cuenta"
        }), 409

    if password is not None:
        if len(password) < 6:
            return jsonify({
                "message": "La contraseña debe tener al menos 6 caracteres"
            }), 400

        user.password = generate_password_hash(password)

    user.first_name = first_name
    user.last_name = last_name
    user.email = email
    user.phone = phone
    user.address = address

    try:
        db.session.commit()

        return jsonify({
            "message": "Perfil actualizado correctamente",
            "user": user.serialize()
        }), 200

    except Exception as error:
        db.session.rollback()
        print(f"Error al actualizar el perfil: {error}")

        return jsonify({
            "message": "No se pudo actualizar el perfil"
        }), 500


# ======================================
# ELIMINAR CUENTA
# ======================================

@auth.route("/profile", methods=["DELETE"])
@jwt_required()
def delete_profile():
    current_user_id = get_jwt_identity()

    user = db.session.get(User, int(current_user_id))

    if user is None:
        return jsonify({
            "message": "Usuario no encontrado"
        }), 404

    try:
        db.session.delete(user)
        db.session.commit()

        return jsonify({
            "message": "Cuenta eliminada correctamente"
        }), 200

    except Exception as error:
        db.session.rollback()
        print(f"Error al eliminar la cuenta: {error}")

        return jsonify({
            "message": "No se pudo eliminar la cuenta"
        }), 500
