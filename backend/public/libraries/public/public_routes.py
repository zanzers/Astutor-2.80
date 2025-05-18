from flask import Blueprint, render_template, request, send_from_directory
from public.libraries.auth.sign import *
from public.libraries.functions.global_fucntions import *
from public.libraries.functions.global_extend import *
from public.libraries.auth.login import *
from public.libraries.auth.auth_token import *
from public.libraries.public.public import *
from public.student_Dashboard.student import *



public_routes = Blueprint("public_routes", __name__)

@public_routes.route("/")
def index():
    return render_template("index.html")
@public_routes.route("/api/admin-dashboard")
def admin():
    return render_template("admin.html")

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

@public_routes.route("/api/login-Astutor", methods = ['GET', 'POST'])
def login():     
    return render_template("login.html")

@public_routes.route("/api/login-Astutor_user", methods = ['GET', 'POST'])
def login_user():
   
   response = login_student_user()
   return response



@public_routes.route("/api/getting-Started")
# @requires_auth
def gettingStarted():
    return render_template("getting-started.html")






# Main Routes

@public_routes.route("/api/Astutor-home")
def homePage():
    return render_template("Astutor_home.html")



@public_routes.route('/api/dashboard/load_userProfile', methods = ['POST'])
def load_profile():

    load_profile = load_user()
    print("load_profile", load_profile)
    return load_profile


@public_routes.route('/api/messages', methods = ['GET'])
def load_msg():
   return load_msg_history()

@public_routes.route('/api/message-images/<filename>')
def serve_userImage(filename):
    user_folder = os.path.join("backend", "message")
    return send_from_directory(user_folder, filename)


@public_routes.route('/api/message-images/<filename>')
def serve_message_image(filename):
    folder_path = os.path.join("backend", "backend", "message")  
    return send_from_directory(folder_path, filename)


@public_routes.route("/api/Astutor/load-content", methods=["POST"])
def homeContent():
  response = home_content()
  return response
@public_routes.route("/api/Astutor/load-top", methods=["POST"])
def topTutor():
  response = load_tutor()
  return response

@public_routes.route("/api/Astutor/view-tutor", methods=["POST"])
def viewBtn():
  response = view_tutor()
  return response


@public_routes.route("/api/Astutor/enrolled-student", methods=["POST"])
def enrolling():
  response = enrolled_request()
  return response

