"""
Rutas generales de la API:
categorías, productos y comprobación del backend.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from api.models import db, Category, Product


api = Blueprint("api", __name__)


# ======================================
# COMPROBAR BACKEND
# ======================================

@api.route("/hello", methods=["GET"])
def handle_hello():
    return jsonify({
        "message": "El backend está funcionando"
    }), 200


# ======================================
# OBTENER CATEGORÍAS
# ======================================

@api.route("/categories", methods=["GET"])
def get_categories():
    categories = Category.query.order_by(Category.name.asc()).all()

    return jsonify({
        "categories": [
            category.serialize()
            for category in categories
        ]
    }), 200


# ======================================
# CREAR CATEGORÍA
# ======================================

@api.route("/categories", methods=["POST"])
@jwt_required()
def create_category():
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({
            "message": "Debes enviar los datos en formato JSON"
        }), 400

    name = body.get("name", "").strip()
    description = body.get("description", "").strip()

    if not name:
        return jsonify({
            "message": "El nombre de la categoría es obligatorio"
        }), 400

    existing_category = Category.query.filter(
        db.func.lower(Category.name) == name.lower()
    ).first()

    if existing_category:
        return jsonify({
            "message": "Esa categoría ya existe"
        }), 409

    new_category = Category(
        name=name,
        description=description or None
    )

    try:
        db.session.add(new_category)
        db.session.commit()

        return jsonify({
            "message": "Categoría creada correctamente",
            "category": new_category.serialize()
        }), 201

    except Exception as error:
        db.session.rollback()
        print(f"Error al crear la categoría: {error}")

        return jsonify({
            "message": "No se pudo crear la categoría"
        }), 500


# ======================================
# OBTENER TODOS LOS PRODUCTOS
# ======================================

@api.route("/products", methods=["GET"])
def get_products():
    products = Product.query.order_by(Product.id.desc()).all()

    return jsonify({
        "products": [
            product.serialize()
            for product in products
        ]
    }), 200


# ======================================
# OBTENER UN PRODUCTO
# ======================================

@api.route("/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = db.session.get(Product, product_id)

    if product is None:
        return jsonify({
            "message": "Producto no encontrado"
        }), 404

    return jsonify({
        "product": product.serialize()
    }), 200


# ======================================
# CREAR PRODUCTO
# ======================================

@api.route("/products", methods=["POST"])
@jwt_required()
def create_product():
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({
            "message": "Debes enviar los datos en formato JSON"
        }), 400

    name = body.get("name", "").strip()
    description = body.get("description", "").strip()
    image_url = body.get("image_url", "").strip()
    category_id = body.get("category_id")

    try:
        price = float(body.get("price"))
    except (TypeError, ValueError):
        return jsonify({
            "message": "El precio debe ser un número válido"
        }), 400

    try:
        stock = int(body.get("stock"))
    except (TypeError, ValueError):
        return jsonify({
            "message": "El stock debe ser un número entero"
        }), 400

    if not name:
        return jsonify({
            "message": "El nombre del producto es obligatorio"
        }), 400

    if not description:
        return jsonify({
            "message": "La descripción es obligatoria"
        }), 400

    if price < 0:
        return jsonify({
            "message": "El precio no puede ser negativo"
        }), 400

    if stock < 0:
        return jsonify({
            "message": "El stock no puede ser negativo"
        }), 400

    try:
        category_id = int(category_id)
    except (TypeError, ValueError):
        return jsonify({
            "message": "Debes indicar una categoría válida"
        }), 400

    category = db.session.get(Category, category_id)

    if category is None:
        return jsonify({
            "message": "La categoría no existe"
        }), 404

    new_product = Product(
        name=name,
        description=description,
        price=price,
        stock=stock,
        image_url=image_url or None,
        category_id=category.id
    )

    try:
        db.session.add(new_product)
        db.session.commit()

        return jsonify({
            "message": "Producto creado correctamente",
            "product": new_product.serialize()
        }), 201

    except Exception as error:
        db.session.rollback()
        print(f"Error al crear el producto: {error}")

        return jsonify({
            "message": "No se pudo crear el producto"
        }), 500


# ======================================
# EDITAR PRODUCTO
# ======================================

@api.route("/products/<int:product_id>", methods=["PUT"])
@jwt_required()
def update_product(product_id):
    product = db.session.get(Product, product_id)

    if product is None:
        return jsonify({
            "message": "Producto no encontrado"
        }), 404

    body = request.get_json(silent=True)

    if body is None:
        return jsonify({
            "message": "Debes enviar los datos en formato JSON"
        }), 400

    name = body.get("name", product.name)
    description = body.get("description", product.description)
    image_url = body.get("image_url", product.image_url)
    price = body.get("price", product.price)
    stock = body.get("stock", product.stock)
    category_id = body.get("category_id", product.category_id)

    name = name.strip() if isinstance(name, str) else ""
    description = (
        description.strip()
        if isinstance(description, str)
        else ""
    )

    if isinstance(image_url, str):
        image_url = image_url.strip() or None

    if not name:
        return jsonify({
            "message": "El nombre del producto es obligatorio"
        }), 400

    if not description:
        return jsonify({
            "message": "La descripción es obligatoria"
        }), 400

    try:
        price = float(price)
    except (TypeError, ValueError):
        return jsonify({
            "message": "El precio debe ser un número válido"
        }), 400

    try:
        stock = int(stock)
    except (TypeError, ValueError):
        return jsonify({
            "message": "El stock debe ser un número entero"
        }), 400

    try:
        category_id = int(category_id)
    except (TypeError, ValueError):
        return jsonify({
            "message": "Debes indicar una categoría válida"
        }), 400

    if price < 0:
        return jsonify({
            "message": "El precio no puede ser negativo"
        }), 400

    if stock < 0:
        return jsonify({
            "message": "El stock no puede ser negativo"
        }), 400

    category = db.session.get(Category, category_id)

    if category is None:
        return jsonify({
            "message": "La categoría no existe"
        }), 404

    product.name = name
    product.description = description
    product.price = price
    product.stock = stock
    product.image_url = image_url
    product.category_id = category.id

    try:
        db.session.commit()

        return jsonify({
            "message": "Producto actualizado correctamente",
            "product": product.serialize()
        }), 200

    except Exception as error:
        db.session.rollback()
        print(f"Error al actualizar el producto: {error}")

        return jsonify({
            "message": "No se pudo actualizar el producto"
        }), 500


# ======================================
# ELIMINAR PRODUCTO
# ======================================

@api.route("/products/<int:product_id>", methods=["DELETE"])
@jwt_required()
def delete_product(product_id):
    product = db.session.get(Product, product_id)

    if product is None:
        return jsonify({
            "message": "Producto no encontrado"
        }), 404

    try:
        db.session.delete(product)
        db.session.commit()

        return jsonify({
            "message": "Producto eliminado correctamente"
        }), 200

    except Exception as error:
        db.session.rollback()
        print(f"Error al eliminar el producto: {error}")

        return jsonify({
            "message": (
                "No se pudo eliminar el producto porque está "
                "relacionado con otro elemento"
            )
        }), 409