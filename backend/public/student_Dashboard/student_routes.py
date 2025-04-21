from flask import Blueprint, render_template, request
from public.libraries.auth.auth_token import *


student_routes = Blueprint("student_routes", __name__)


# TUTOR ROUTES AND OTHER PARTS:
@student_routes.route("/api/getting-started/student", methods=["GET"])
@requires_auth
def studentProfile():
    return render_template("student_profile.html")    






