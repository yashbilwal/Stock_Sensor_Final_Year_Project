from datetime import datetime

def user_schema(full_name, email, phone, hashed_password):
    return {
        "full_name": full_name,
        "email": email,
        "phone": phone,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
