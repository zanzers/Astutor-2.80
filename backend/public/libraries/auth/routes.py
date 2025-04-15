from flask import Blueprint, request, jsonify
from http import HTTPStatus 
from public.libraries.auth.auth_token import requires_auth




routes = Blueprint('routes', __name__)

@routes.route('/api/userinfo', methods=['GET'])
@requires_auth
def get_user_info():
     return jsonify({
          "message": "User info retrieved successfully!"
          }), HTTPStatus.OK


@routes.route('/api/settings', methods=['POST'])
@requires_auth  
def update_settings():
    data = request.get_json()
    return jsonify({"message": "Settings updated!", "data": data}), HTTPStatus.OK