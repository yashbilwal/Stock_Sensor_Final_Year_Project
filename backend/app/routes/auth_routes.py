from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.auth_service import register_user, login_user
from app.utils.jwt_utils import generate_token

auth_bp = Blueprint("auth", __name__)

# Signup
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    full_name = data.get("full_name")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")
    confirm_password = data.get("confirm_password")
    terms = data.get("terms", False)

    result = register_user(full_name, email, phone, password, confirm_password, terms)
    return jsonify(result[0]), result[1]

# Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = login_user(email, password)
    if "error" in user:
        return jsonify(user), 401

    token = generate_token(user)
    return jsonify({"token": token, "full_name": user["full_name"], "email": user["email"]}), 200

# Get current user
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    return jsonify({"message": "User authenticated", "user_id": user_id}), 200
