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

        print("input HERE:","Name:", username, "Email:", email,"Password", password)

        errors_found = check_errors(email, password)

        if errors_found:
            return jsonify({
                "errors": errors_found,
                "success": False
            }), HTTPStatus.BAD_REQUEST
        
        else:

    
            encrypt_password = hash_password(password)
            token = generate_token(email)

            insert_query = """ INSERT INTO user (username, email, password) VALUES(%s, %s, %s)"""
            db_write(insert_query, (username, email, encrypt_password))

            print(f"Generated token for {email}: {token}")

            response = make_response(jsonify({
                 "message": "Registration successful!",
                 "success": True,
                 "token": token,
                 "name": username,
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







# def verification_otp():
    try:
        
        data = request.get_json()
        email = data.get("email", "").strip()
        otp_input = data.get ("otp", "").strip()

        print("Revice Otp:", otp_input , "email", email);
        print(f"Storing OTP for {email}: {'otp'}, Expires at: {otp_store[email]['generated_exprires']}")



        if email not in otp_store or otp_store[email]['otp'] != otp_input:
            return jsonify({
                "error": "Invalid OTP!",
                "success": False
            }), HTTPStatus.BAD_REQUEST
        
        current_time = int(time.time())

        if current_time > otp_store[email]['generated_exprires']:
            del otp_store[username]
            return jsonify({
                "error": "OTP Expried!",
                "success": False
            }), HTTPStatus.BAD_REQUES
            
        

        del otp_store[username] 

        return jsonify({            
            "message": "OTP successful",
            "success": True,
        }), HTTPStatus.CREATED
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), HTTPStatus.INTERNAL_SERVER_ERROR






    # otp_store = {} global var
    # otp, expiry_time, generated_at = generate_otp()
    # otp_store[username] = {"otp": otp, "expires_at": expiry_time, "generated_exprires": generated_at + expiry_time}
    # print("stored", otp_store)
    # print("input HERE:","Name:", name, "Email:", username,"Password", password, "confimt", confirm)
    # print("erors:", errors_found)