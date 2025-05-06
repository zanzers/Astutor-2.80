from flask import jsonify, request, make_response
from public.libraries.db.conn import db_write
from public.libraries.functions.utility import *
from public.libraries.auth.auth_token import generate_token
from http import HTTPStatus


def user():
 
    try:
        data = request.get_json()
        username = data.get("name", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        confirm = data.get("confirm", "").strip()


        print("input HERE:","Name:", username, "Email:", email,"Password", password, "confirm", confirm)

        errors_found = check_errors(email, password, confirm)

        if errors_found:
            return jsonify({
                "errors": errors_found,
                "success": False
            }), HTTPStatus.BAD_REQUEST
        
        else:

    
            encrypt_password = hash_password(password)
            token = generate_token(email)

            insert_query = """ INSERT INTO user (username, email, password) VALUES(%s, %s, %s)"""
            userId = db_write(insert_query, (username, email, encrypt_password))


            print(f"Generated token for {email}: {token}", "User ID:", userId)

            response = make_response(jsonify({
                 "message": "Registration successful!",
                 "success": True,
                 "token": token,
                 "name": username,
                 "id": userId,
                 "email": email,
                "redirect_url": "/api/getting-Started"
             }))


            response.set_cookie(
                "auth_token",
                  token, 
                  httponly=True,
                  secure=True,
                  samesite='Strict',
                  max_age=3600
                  )
        
            return response



    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), HTTPStatus.INTERNAL_SERVER_ERROR


def login():
    try:
        data = request.get_json()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        confirm = data.get("password", "").strip()


        print("login HERE:", "Email:", email,"Password", password, "confirm", confirm)

        errors_found = check_errors(email, password, confirm)

        if errors_found:
            return jsonify({
                "errors": errors_found,
                "success": False
            }), HTTPStatus.BAD_REQUEST
        
        else:
    
            encrypt_password = hash_password(password)
            token = generate_token(email)

            read_query = """ SELECT id, password FROM user WHERE email = %s AND password = %s"""
            user_info = db_read(read_query, (email, encrypt_password))


            id_result = find_user_id(user_info)



            response = make_response(jsonify({
                 "message": "Login successful!",
                 "success": True,
                 "token": token,
                 "id": user_info,
                 "role": id_result,
                 "email": email,
                "redirect_url": "/api/getting-Started"
             }))


            response.set_cookie(
                "auth_token",
                  token, 
                  httponly=True,
                  secure=True,
                  samesite='Strict',
                  max_age=3600
                  )
        
            return response



    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), HTTPStatus.INTERNAL_SERVER_ERROR
