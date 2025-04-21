from flask import Blueprint, render_template, request, send_from_directory
from public.tutor_Dashboard.tutor import *
from public.libraries.functions.global_fucntions import *
from public.tutor_Dashboard.tutor_utility import *
from public.libraries.auth.auth_token import *



tutor_routes = Blueprint("tutor_routes", __name__)


# TUTOR ROUTES AND OTHER PARTS:
@tutor_routes.route("/api/getting-started/tutor", methods=["GET", "POST"])
@requires_auth
def tutorProfile():    
    return render_template("tutor_profile.html")


@tutor_routes.route("/api/getting-started/about", methods=['GET', 'POST'])
def about_info():
    
    response, status_code = insert_user()
    result = response.get_json()
    return result


@tutor_routes.route("/api/getting-started/education", methods=['GET', 'POST'])
def education_info():
    
    print("Education")
    response, status_code = tutor_education()
    result = response.get_json()
    return result





# GLOBAL FUNCTION and GLOBAL ROUTES NOTE: DONT TOUCH ask the project manager!!!!!!

@tutor_routes.route("/api/getting-started/subjects", methods = ["GET"])
def get_subjects():
    subjects = fetch_subjects()
    return subjects
    
@tutor_routes.route("/api/getting-started/photo", methods=["GET", "POST"])
def upload_photo():
    response, status_code = save_photo()
    image_path = response.get_json()
    print("Image Path:", image_path, status_code)
    return image_path


@tutor_routes.route("/user_uploads/<user_id>/<filename>")
def serve_userImage(user_id, filename):
    user_folder = os.path.join("backend", "user", user_id)
    return send_from_directory(user_folder, filename)






# @tutor_routes.route("/api/getting-started/student", methods=["GET"])
# @requires_auth
# def studentProfile():
#     return render_template("student_profile.html")    

