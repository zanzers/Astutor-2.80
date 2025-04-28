import os
import jwt
import datetime
from flask import request, jsonify
from functools import wraps
from http import HTTPStatus 
from dotenv import load_dotenv





load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')

def generate_token(username):
    payload = {
        "username": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=10)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token




def is_valid_token(token):
    return token == "valid_tokes"



def requires_auth(f):

    @wraps(f)
    def decorated_function(*args, **kwargs):

        token = request.cookies.get('auth_token')

        if not token:
            return jsonify({
                "error": "Unauthorized access!"
            }),HTTPStatus.UNAUTHORIZED
        
        try:
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.username = decoded["username"]

        except jwt.ExpiredSignatureError:
            return jsonify({
                "error": "Token expired!"
            }), HTTPStatus.UNAUTHORIZED
        
        except jwt.InvalidTokenError:
            return jsonify({
                "error": "Invalid Token"
            }), HTTPStatus.UNAUTHORIZED
        
        return f(*args, **kwargs)
    return decorated_function


def requires_role(role):
    def decorator(f):

        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = request.headers.get('Authorization')

            if not token or not token.startswith("Bearer "):
                return jsonify({
                    "error": "Unauthorized"
                }), HTTPStatus.UNAUTHORIZED
            
            user_role = get_user_role_token(token)
            
            try:
                token = token.split(" ")[1]
                decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                request.username = decoded["username"]
            
            except jwt.ExpiredSignatureError:

                if user_role != role:
                    return jsonify({
                        "error": "Forbidden access!"
                    }), HTTPStatus.FORBIDDEN
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator



def get_user_role_token(token):
    return 'user'