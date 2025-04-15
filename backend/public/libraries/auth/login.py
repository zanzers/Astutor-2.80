from flask import jsonify, request
from public.libraries.db import db_read
from public.libraries.functions import hash_password
from http import HTTPStatus





def login_student():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        print(f"Received: username={username}, password={password}")

        if not username or not password:
            print("Missing username or password")
            return jsonify({
                "error": "Username and password are required",
                "success": False,
                }), HTTPStatus.BAD_REQUEST

        query = """SELECT id, username, password FROM USER WHERE username = %s"""
        print(f"Executing query: {query} with username={username}")
        result = db_read(query, (username,))


        if not result:
            print("No user found, returning error.")
            return jsonify({
                "error": "Username not found",
                 "success": False,
                }), HTTPStatus.BAD_REQUEST
        
        student = result[0]

        if not hmac.compare_digest(student["password"], hash_password(password)):
            print("Password does not match, returning error.")
            return jsonify({
                "error": "Invalid username or password",
                "success": False,
            }), HTTPStatus.BAD_REQUEST


        print("Login successful!")
        return jsonify({
            "message": "Login successful",
            "success": True,
            "redirect_url": "/api/index",
            "user": {"id": student["id"], "username": student["username"]}
        }), HTTPStatus.OK

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": "Internal server error"}), HTTPStatus.BAD_REQUEST
