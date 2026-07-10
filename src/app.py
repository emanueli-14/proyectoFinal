import os
from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_jwt_extended import JWTManager

from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.auth import auth
from api.admin import setup_admin
from api.commands import setup_commands

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"

static_file_dir = os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    "../dist/"
)

app = Flask(__name__)
app.url_map.strict_slashes = False

# ==========================
# DATABASE
# ==========================

db_url = os.getenv("DATABASE_URL")

if db_url is not None:
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url.replace(
        "postgres://",
        "postgresql://"
    )
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/test.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# ==========================
# JWT
# ==========================

app.config["JWT_SECRET_KEY"] = "mi_clave_super_secreta_2026"

jwt = JWTManager(app)

# ==========================
# DATABASE INIT
# ==========================

db.init_app(app)

MIGRATE = Migrate(
    app,
    db,
    compare_type=True
)

# ==========================
# ADMIN
# ==========================

setup_admin(app)

# ==========================
# COMMANDS
# ==========================

setup_commands(app)

# ==========================
# BLUEPRINTS
# ==========================

app.register_blueprint(api, url_prefix="/api")
app.register_blueprint(auth, url_prefix="/api/auth")

# ==========================
# ERROR HANDLER
# ==========================


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


# ==========================
# SWAGGER
# ==========================

@app.route("/swagger")
def swagger_spec():
    return jsonify(swagger(app))


# ==========================
# HOME
# ==========================

@app.route("/")
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)

    return send_from_directory(static_file_dir, "index.html")


# ==========================
# REACT ROUTER
# ==========================

@app.route("/<path:path>", methods=["GET"])
def serve_any_other_file(path):

    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = "index.html"

    response = send_from_directory(
        static_file_dir,
        path
    )

    response.cache_control.max_age = 0

    return response


# ==========================
# MAIN
# ==========================

if __name__ == "__main__":

    PORT = int(os.environ.get("PORT", 3001))

    app.run(
        host="0.0.0.0",
        port=PORT,
        debug=True
    )
