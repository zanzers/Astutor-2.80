from flask import jsonify, request, make_response
from public.libraries.db.conn import db_write
from public.libraries.functions.utility import *
from public.libraries.auth.auth_token import generate_token
from public.libraries.functions.global_extend import *
from http import HTTPStatus
import hmac



def login_student_user():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        print(f"Received login attempt: email={email}")

        errorList, user  = check_login_errors(email, password)

        print("ERRORS:", errorList)
        if errorList:
            return jsonify({
                "errors": errorList,
                "success": False
            })
        
        userId = user["id"]
        role = find_user_default(userId)

        if(role == "student"):
            redirect_url = "/api/Astutor|home"
        else:
            redirect_url =  "/api/dashboard/Astutor-tutor"
        
        print("Login successful for user ID:", role, "userId", userId)
        return jsonify({
            "message": "Login successful",
            "success": True,
            "role": role,
            "redirect_url": redirect_url,
            "userId": userId,
             "email": user["email"]
            
        }), HTTPStatus.OK

    except Exception as e:
        print(f"Exception occurred: {e}")
        return jsonify({"error": "Internal server error"}), HTTPStatus.INTERNAL_SERVER_ERROR
