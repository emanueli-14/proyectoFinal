from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from api.models import (
    db,
    User,
    Cart,
    CartItem,
    Order,
    OrderItem
)


orders = Blueprint("orders_api", __name__)


# ======================================
# OBTENER PEDIDOS DEL USUARIO
# ======================================

@orders.route("/", methods=["GET"])
@jwt_required()
def get_orders():
    current_user_id = int(get_jwt_identity())

    user = db.session.get(User, current_user_id)

    if user is None:
        return jsonify({
            "message": "Usuario no encontrado"
        }), 404

    user_orders = Order.query.filter_by(
        user_id=current_user_id
    ).order_by(
        Order.created_at.desc()
    ).all()

    return jsonify({
        "orders": [
            order.serialize()
            for order in user_orders
        ]
    }), 200


# ======================================
# OBTENER UN PEDIDO
# ======================================

@orders.route("/<int:order_id>", methods=["GET"])
@jwt_required()
def get_order(order_id):
    current_user_id = int(get_jwt_identity())

    order = Order.query.filter_by(
        id=order_id,
        user_id=current_user_id
    ).first()

    if order is None:
        return jsonify({
            "message": "Pedido no encontrado"
        }), 404

    return jsonify({
        "order": order.serialize()
    }), 200


# ======================================
# CREAR PEDIDO DESDE EL CARRITO
# ======================================

@orders.route("/", methods=["POST"])
@jwt_required()
def create_order():
    current_user_id = int(get_jwt_identity())

    user = db.session.get(User, current_user_id)

    if user is None:
        return jsonify({
            "message": "Usuario no encontrado"
        }), 404

    user_cart = Cart.query.filter_by(
        user_id=current_user_id
    ).first()

    if user_cart is None or len(user_cart.items) == 0:
        return jsonify({
            "message": "El carrito está vacío"
        }), 400

    total = 0

    # Primero comprobamos todo el stock.
    for cart_item in user_cart.items:
        product = cart_item.product

        if product is None:
            return jsonify({
                "message": (
                    "Uno de los productos del carrito "
                    "ya no está disponible"
                )
            }), 404

        if cart_item.quantity > product.stock:
            return jsonify({
                "message": (
                    f"No hay suficiente stock de "
                    f"{product.name}"
                )
            }), 409

        total += product.price * cart_item.quantity

    try:
        new_order = Order(
            user_id=current_user_id,
            total=round(total, 2),
            status="pending"
        )

        db.session.add(new_order)

        # Necesitamos el ID del pedido antes de crear sus items.
        db.session.flush()

        cart_items = list(user_cart.items)

        for cart_item in cart_items:
            product = cart_item.product

            order_item = OrderItem(
                order_id=new_order.id,
                product_id=product.id,
                quantity=cart_item.quantity,
                price=product.price
            )

            db.session.add(order_item)

            # Reducimos las unidades disponibles.
            product.stock -= cart_item.quantity

            # Quitamos el producto del carrito.
            db.session.delete(cart_item)

        db.session.commit()

        return jsonify({
            "message": "Pedido creado correctamente",
            "order": new_order.serialize(),
            "cart": user_cart.serialize()
        }), 201

    except Exception as error:
        db.session.rollback()

        print(f"Error al crear el pedido: {error}")

        return jsonify({
            "message": "No se pudo crear el pedido"
        }), 500
