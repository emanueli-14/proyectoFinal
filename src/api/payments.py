import os
import stripe

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from api.models import db, User, Order


payments = Blueprint("payments_api", __name__)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


# ======================================
# CREAR SESIÓN DE CHECKOUT
# ======================================

@payments.route(
    "/create-checkout-session/<int:order_id>",
    methods=["POST"]
)
@jwt_required()
def create_checkout_session(order_id):
    current_user_id = int(get_jwt_identity())

    user = db.session.get(User, current_user_id)

    if user is None:
        return jsonify({
            "message": "Usuario no encontrado"
        }), 404

    order = Order.query.filter_by(
        id=order_id,
        user_id=current_user_id
    ).first()

    if order is None:
        return jsonify({
            "message": "Pedido no encontrado"
        }), 404

    if order.status == "paid":
        return jsonify({
            "message": "Este pedido ya está pagado"
        }), 409

    if not order.items:
        return jsonify({
            "message": "El pedido no tiene productos"
        }), 400

    if not stripe.api_key:
        return jsonify({
            "message": "Stripe no está configurado"
        }), 500

    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://localhost:3000"
    )

    line_items = []

    for item in order.items:
        product_name = (
            item.product.name
            if item.product
            else f"Producto #{item.product_id}"
        )

        line_items.append({
            "price_data": {
                "currency": "eur",
                "product_data": {
                    "name": product_name
                },
                "unit_amount": int(round(item.price * 100))
            },
            "quantity": item.quantity
        })

    try:
        checkout_session = stripe.checkout.Session.create(
            mode="payment",
            line_items=line_items,
            customer_email=user.email,
            client_reference_id=str(order.id),
            metadata={
                "order_id": str(order.id),
                "user_id": str(user.id)
            },
            success_url=(
                f"{frontend_url}/payment-success"
                "?session_id={CHECKOUT_SESSION_ID}"
            ),
            cancel_url=f"{frontend_url}/payment-cancel"
        )

        return jsonify({
            "checkout_url": checkout_session.url,
            "session_id": checkout_session.id
        }), 200

    except stripe.StripeError as error:
        print(f"Error de Stripe: {error}")

        return jsonify({
            "message": "No se pudo iniciar el pago"
        }), 502

    except Exception as error:
        print(f"Error general al iniciar el pago: {error}")

        return jsonify({
            "message": "Ocurrió un error al iniciar el pago"
        }), 500


# ======================================
# WEBHOOK DE STRIPE
# ======================================

@payments.route("/webhook", methods=["POST"])
def stripe_webhook():
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    if not webhook_secret:
        return jsonify({
            "message": "Webhook de Stripe no configurado"
        }), 500

    payload = request.get_data()
    signature = request.headers.get("Stripe-Signature")

    if not signature:
        return jsonify({
            "message": "Falta la firma de Stripe"
        }), 400

    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=signature,
            secret=webhook_secret
        )

    except ValueError:
        return jsonify({
            "message": "Contenido del webhook no válido"
        }), 400

    except stripe.SignatureVerificationError:
        return jsonify({
            "message": "Firma del webhook no válida"
        }), 400

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

    order_id = None

    if session.metadata:
        order_id = session.metadata.order_id

    if order_id:
        order = db.session.get(Order, int(order_id))

        if order and order.status != "paid":
            order.status = "paid"
            db.session.commit()

            print(
                f"Pedido #{order.id} actualizado a paid"
            )

    return jsonify({
        "received": True
    }), 200
