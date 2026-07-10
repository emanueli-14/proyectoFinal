from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from api.models import db, User, Product, Cart, CartItem


cart = Blueprint("shopping_cart", __name__)


def get_or_create_cart(user_id):
    user_cart = Cart.query.filter_by(
        user_id=user_id
    ).first()

    if user_cart:
        return user_cart

    user_cart = Cart(user_id=user_id)

    db.session.add(user_cart)
    db.session.commit()

    return user_cart


# ======================================
# OBTENER CARRITO
# ======================================

@cart.route("/", methods=["GET"])
@jwt_required()
def get_cart():
    current_user_id = int(get_jwt_identity())

    user = db.session.get(User, current_user_id)

    if user is None:
        return jsonify({
            "message": "Usuario no encontrado"
        }), 404

    user_cart = get_or_create_cart(current_user_id)

    return jsonify({
        "cart": user_cart.serialize()
    }), 200


# ======================================
# AGREGAR PRODUCTO
# ======================================

@cart.route("/items", methods=["POST"])
@jwt_required()
def add_cart_item():
    current_user_id = int(get_jwt_identity())
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({
            "message": "Debes enviar datos en formato JSON"
        }), 400

    product_id = body.get("product_id")
    quantity = body.get("quantity", 1)

    try:
        product_id = int(product_id)
    except (TypeError, ValueError):
        return jsonify({
            "message": "El producto indicado no es válido"
        }), 400

    try:
        quantity = int(quantity)
    except (TypeError, ValueError):
        return jsonify({
            "message": "La cantidad debe ser un número entero"
        }), 400

    if quantity < 1:
        return jsonify({
            "message": "La cantidad debe ser mayor que cero"
        }), 400

    product = db.session.get(Product, product_id)

    if product is None:
        return jsonify({
            "message": "Producto no encontrado"
        }), 404

    if product.stock <= 0:
        return jsonify({
            "message": "El producto no tiene stock disponible"
        }), 409

    user_cart = get_or_create_cart(current_user_id)

    existing_item = CartItem.query.filter_by(
        cart_id=user_cart.id,
        product_id=product.id
    ).first()

    if existing_item:
        new_quantity = existing_item.quantity + quantity

        if new_quantity > product.stock:
            return jsonify({
                "message": (
                    "La cantidad solicitada supera "
                    "el stock disponible"
                )
            }), 409

        existing_item.quantity = new_quantity

    else:
        if quantity > product.stock:
            return jsonify({
                "message": (
                    "La cantidad solicitada supera "
                    "el stock disponible"
                )
            }), 409

        new_item = CartItem(
            cart_id=user_cart.id,
            product_id=product.id,
            quantity=quantity
        )

        db.session.add(new_item)

    try:
        db.session.commit()

        return jsonify({
            "message": "Producto añadido al carrito",
            "cart": user_cart.serialize()
        }), 200

    except Exception as error:
        db.session.rollback()
        print(f"Error al añadir al carrito: {error}")

        return jsonify({
            "message": "No se pudo añadir el producto"
        }), 500


# ======================================
# MODIFICAR CANTIDAD
# ======================================

@cart.route("/items/<int:item_id>", methods=["PUT"])
@jwt_required()
def update_cart_item(item_id):
    current_user_id = int(get_jwt_identity())
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({
            "message": "Debes enviar datos en formato JSON"
        }), 400

    quantity = body.get("quantity")

    try:
        quantity = int(quantity)
    except (TypeError, ValueError):
        return jsonify({
            "message": "La cantidad debe ser un número entero"
        }), 400

    if quantity < 1:
        return jsonify({
            "message": "La cantidad debe ser mayor que cero"
        }), 400

    user_cart = Cart.query.filter_by(
        user_id=current_user_id
    ).first()

    if user_cart is None:
        return jsonify({
            "message": "Carrito no encontrado"
        }), 404

    item = CartItem.query.filter_by(
        id=item_id,
        cart_id=user_cart.id
    ).first()

    if item is None:
        return jsonify({
            "message": "Producto del carrito no encontrado"
        }), 404

    if quantity > item.product.stock:
        return jsonify({
            "message": (
                "La cantidad solicitada supera "
                "el stock disponible"
            )
        }), 409

    item.quantity = quantity

    try:
        db.session.commit()

        return jsonify({
            "message": "Cantidad actualizada",
            "cart": user_cart.serialize()
        }), 200

    except Exception as error:
        db.session.rollback()
        print(f"Error al modificar carrito: {error}")

        return jsonify({
            "message": "No se pudo actualizar la cantidad"
        }), 500


# ======================================
# ELIMINAR UN PRODUCTO
# ======================================

@cart.route("/items/<int:item_id>", methods=["DELETE"])
@jwt_required()
def delete_cart_item(item_id):
    current_user_id = int(get_jwt_identity())

    user_cart = Cart.query.filter_by(
        user_id=current_user_id
    ).first()

    if user_cart is None:
        return jsonify({
            "message": "Carrito no encontrado"
        }), 404

    item = CartItem.query.filter_by(
        id=item_id,
        cart_id=user_cart.id
    ).first()

    if item is None:
        return jsonify({
            "message": "Producto del carrito no encontrado"
        }), 404

    try:
        db.session.delete(item)
        db.session.commit()

        return jsonify({
            "message": "Producto eliminado del carrito",
            "cart": user_cart.serialize()
        }), 200

    except Exception as error:
        db.session.rollback()
        print(f"Error al eliminar del carrito: {error}")

        return jsonify({
            "message": "No se pudo eliminar el producto"
        }), 500


# ======================================
# VACIAR CARRITO
# ======================================

@cart.route("/clear", methods=["DELETE"])
@jwt_required()
def clear_cart():
    current_user_id = int(get_jwt_identity())

    user_cart = Cart.query.filter_by(
        user_id=current_user_id
    ).first()

    if user_cart is None:
        return jsonify({
            "message": "Carrito no encontrado"
        }), 404

    try:
        CartItem.query.filter_by(
            cart_id=user_cart.id
        ).delete()

        db.session.commit()

        return jsonify({
            "message": "Carrito vaciado correctamente",
            "cart": user_cart.serialize()
        }), 200

    except Exception as error:
        db.session.rollback()
        print(f"Error al vaciar el carrito: {error}")

        return jsonify({
            "message": "No se pudo vaciar el carrito"
        }), 500
