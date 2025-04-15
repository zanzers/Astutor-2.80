from flask import Blueprint, render_template, request
from public.libraries.auth.auth_token import *




dashboard_routes = Blueprint("dashboard_routes", __name__)


@dashboard_routes.route("/api/getting-Started")
@requires_auth
def gettingStarteed():

    return render_template("tutor_profile.html")



@dashboard_routes.route("/api/student")
def studentProfile():
    pass

@dashboard_routes.route("/api/tutor")
def tutorProfile():
    pass
