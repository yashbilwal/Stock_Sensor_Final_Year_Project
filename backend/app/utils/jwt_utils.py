from flask_jwt_extended import create_access_token

def generate_token(user):
    token = create_access_token(identity=str(user["_id"]))
    return token
