from flask import Blueprint, render_template, request
from public.libraries.auth.sign import *
from public.libraries.functions.global_fucntions import *
from public.libraries.functions.global_extend import *
from public.libraries.auth.auth_token import *



public_routes = Blueprint("public_routes", __name__)

@public_routes.route("/")
def index():
    return render_template("index.html")

@public_routes.route("/api/getting-started/about", methods=['GET', 'POST'])
def about_info():
    
    response, status_code = insert_user()
    result = response.get_json()
    return result

@public_routes.route("/api/account", methods = ['GET', 'POST'])
def signup():

    print("Signup")
    if request.method == 'POST':
        response = user()
        print("respose of SignIn: ", response)
    
        return response
    
    return render_template("account.html")

@public_routes.route("/api/login-Astutor")
def login():  
    
    if request.method == 'POST':
        response = login()
        return response

    return render_template("login.html")



@public_routes.route("/api/getting-Started")
# @requires_auth
def gettingStarted():
    return render_template("getting-started.html")



@public_routes.route("/api/Astutor|home")

def homePage():
    return render_template("Astutor_home.html")








# # barba.js route
# @public_routes.route("/getting-started")
# @requires_auth 
# def userinfo():
#     print("Headers:", request.headers) 
#     return render_template("dashboard.html")
