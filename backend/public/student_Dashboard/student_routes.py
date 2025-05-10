from flask import Blueprint, render_template, request
from public.libraries.auth.auth_token import *
from public.student_Dashboard.student import *


student_routes = Blueprint("student_routes", __name__)


# TUTOR ROUTES AND OTHER PARTS:
@student_routes.route("/api/getting-started/student", methods=["GET"])
# @requires_auth
def studentProfile():
    return render_template("student_profile.html")    


@student_routes.route("/api/dashboard/focus", methods=["GET"])
# @requires_auth
def studentfocus():

    print("studentfocus")
    response = fecth_focus()
    return response


@student_routes.route("/api/dashboard/student_submit", methods=["POST"])
# @requires_auth
def submit_focus():

    print("studentfocus")
    response = student_submit()
    return response





