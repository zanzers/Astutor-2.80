from flask import Blueprint, jsonify
from public.libraries.db.conn import db_read
from http import HTTPStatus
import traceback 

preloader = Blueprint('preloader', __name__)

@preloader.route('/healthcheck')
def healthcheck():
    try:
        query = """SELECT 1"""
        result = db_read(query)

        if result:
            print("Preloader", result)
            return jsonify({
                "status": "ready"
            }), HTTPStatus.OK
        return jsonify({
            "status": "waiting"
        }), HTTPStatus.SERVICE_UNAVAILABLE
    except Exception as e:
        print("Database Healthcheck Error:", e)
        traceback.print_exc()
        return jsonify({
            "status": "error"
        }),HTTPStatus.BAD_REQUEST