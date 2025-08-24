from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user_model import user_schema
from app.extensions import mongo

def get_db():
    return mongo.db


def register_user(full_name, email, phone, password, confirm_password, terms):
    # Check required fields
    db = get_db() 
    if not full_name or not email or not phone or not password or not confirm_password:
        return {"error": "All fields are required"}, 400

    if password != confirm_password:
        return {"error": "Passwords do not match"}, 400

    if not terms:
        return {"error": "You must agree to terms and conditions"}, 400

    # Check if email exists
    if db.users.find_one({"email": email}):
        return {"error": "Email already registered"}, 400

    # Save user
    hashed_pw = generate_password_hash(password)
    new_user = user_schema(full_name, email, phone, hashed_pw)
    db.users.insert_one(new_user)

    return {"message": "User registered successfully"}, 201


def login_user(email, password):
    db = get_db() 
    user = db.users.find_one({"email": email})
    if not user or not check_password_hash(user["password"], password):
        return {"error": "Invalid email or password"}, 401
    
    return user
