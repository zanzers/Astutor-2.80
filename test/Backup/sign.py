from flask import jsonify, request, session
from public.libraries.db.conn import db_read, db_write
from public.libraries.functions.utility import *
from public.libraries.auth.auth_token import generate_token
from http import HTTPStatus
import time



otp_store = {}


def sign_student():
 
    try:
        data = request.get_json()
        username = data.get("email", "").strip()
        password = data.get("password", "").strip()
        confirm = data.get("confirm", "").strip()

        print("input HERE:","Email:", username,"Password", password, "confimt", confirm)

        errors_found = check_errors(username, password, confirm)
        print("erors:", errors_found)

        if errors_found:
            return jsonify({
                "errors": errors_found,
                "success": False
            }), HTTPStatus.BAD_REQUEST
        else:
        

            return jsonify({
            "message": "OTP sent!",
            "success": True,
            "username": username,

        }), HTTPStatus.OK


    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), HTTPStatus.INTERNAL_SERVER_ERROR







def verification_otp():
    try:
        
        data = request.get_json()
        username = data.get("email", "").strip()
        otp_input = data.get ("otp", "").strip()

        print("Revice Otp:", otp_input , "Username", username);
        print(f"Storing OTP for {username}: {'otp'}, Expires at: {otp_store[username]['generated_exprires']}")



        if username not in otp_store or otp_store[username]['otp'] != otp_input:
            return jsonify({
                "error": "Invalid OTP!",
                "success": False
            }), HTTPStatus.BAD_REQUEST
        
        current_time = int(time.time())

        if current_time > otp_store[username]['generated_exprires']:
            del otp_store[username]
            return jsonify({
                "error": "OTP Expried!",
                "success": False
            }), HTTPStatus.BAD_REQUES
            
        
        password = data.get("password", "").strip()
        hash_pass = hash_password(password)
        token = generate_token(username)

        insert_query = """INSERT INTO user (username, password, token) VALUES (%s, %s, %s)"""
        db_write(insert_query, (username, hash_pass, token))


        del otp_store[username] 

        return jsonify({            
            "message": "Registration successful",
            "success": True,
            "token": token,
            "redirect_url": "/"
        }), HTTPStatus.CREATED
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), HTTPStatus.INTERNAL_SERVER_ERROR

def resent_otp():
    try: 

        data = request.get_json()
        username = data.get("username", "").strip()

        if not username or username not in otp_store:
            return jsonify({
                "error": "User not found!",
                "success": False
            }), HTTPStatus.BAD_REQUEST

        if "username" in session and session["username"] != username:
            return jsonify({
                "error": "Unauthorized OTP request.",
                "success": False
            }), HTTPStatus.UNAUTHORIZED


        new_otp = generate_otp()
        otp_store[username] = new_otp

        print(f"New OTP for {username}: {new_otp}")

        return jsonify({
            "message": "New OTP generated.",
            "new_otp": new_otp,  # Include OTP in response for testing
            "success": True
        }), HTTPStatus.OK

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    

def check_errors(email, password, confirm):

    print("checks:" , confirm)
        # list comprehension
    errors = [
            "Invalid email format!" if email and not is_valid_email(email) else None,
            "User already exists." if db_read("""SELECT * FROM USER WHERE username = %s""", (email,)) else None,
             "Passwords do not match!" if password and confirm and password != confirm else None,
            "Password must be at least 8 characters long, contain one uppercase letter and one number." if password and not is_valid_password(password) else None,
        ]
    return [error for error in errors if error is not None]
    
    
