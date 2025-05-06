from flask import Blueprint, render_template, request
from public.libraries.auth.sign import *
from public.libraries.auth.auth_token import *



public_routes = Blueprint("public_routes", __name__)

@public_routes.route("/")
def index():
    return render_template("index.html")

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













# # barba.js route
# @public_routes.route("/getting-started")
# @requires_auth 
# def userinfo():
#     print("Headers:", request.headers) 
#     return render_template("dashboard.html")
