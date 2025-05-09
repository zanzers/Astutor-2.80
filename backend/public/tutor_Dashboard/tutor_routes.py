from flask import Blueprint, render_template, request, send_from_directory
from public.tutor_Dashboard.tutor import *
from public.libraries.functions.global_fucntions import *
from public.tutor_Dashboard.tutor_utility import *
from public.libraries.auth.auth_token import *



tutor_routes = Blueprint("tutor_routes", __name__)


# TUTOR ROUTES AND OTHER PARTS:
@tutor_routes.route("/api/getting-started/tutor", methods=["GET", "POST"])
# @requires_auth
def tutorProfile():    
    return render_template("tutor_profile.html")

@tutor_routes.route("/api/getting-started/education", methods=['GET', 'POST'])
def education_info():
    
    print("Education")
    response, status_code = tutor_education()
    result = response.get_json()
    return result


# GLOBAL FUNCTION and GLOBAL ROUTES 
# NOTE: DONT TOUCH unless you have permission or ask the project manager!!!!!!

@tutor_routes.route("/api/getting-started/setup", methods=['GET', 'POST'])
def setup():
    response = request_otp()
    result = response.get_json()
    print(result)
    return result
    
@tutor_routes.route("/api/getting-started/verify", methods=['POST'])
def verify():
    response = verify_otp()
    result = response.get_json()
    print(result)
    return result

@tutor_routes.route("/api/getting-started/payment_method", methods=['POST'])
def payment_method():
    response = payment()
    result = response.get_json()
    print("payment",result)
    return result

@tutor_routes.route("/api/getting-started/confirmation", methods=['POST'])
def confirmation_method():
    response = confirm()
    result = response.get_json()
    print(result)
    return result

@tutor_routes.route("/api/getting-started/without_the_account", methods=['POST'])
def without_method():
    response = without_account()
    result = response.get_json()
    print(result)
    return result



@tutor_routes.route('/api/dashboard/load_profile', methods = ['POST'])
def load_profile():
    print("LOAD USER")
    load_profile = load_user()
    print("load", load_profile)
    return load_profile

@tutor_routes.route('/api/dashboard/content', methods = ['POST'])
def load_content_tutor():
    print("LOAD USER")
    content_result = load_content()
    print("load", content_result)
    return content_result


@tutor_routes.route('/api/dashboard/transactions', methods = ['POST'])
def DMI_process():

    transaction_result = transaction()
    return transaction_result




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






@tutor_routes.route("/api/dashboard/Astutor-tutor", methods=["GET"])
# @requires_auth
def tutorDashboard():
    return render_template("tutor_dashboard.html")    


@tutor_routes.route('/api/dashboard/create-lesson', methods=['GET'])
# @requires_auth
def create_lesson():
    return render_template("create_lesson.html")




# fecth data
@tutor_routes.route('/api/dashboard/topics', methods=['POST'])
# @requires_auth
def topics():
    response = fetch_topics()
    return response


@tutor_routes.route('/api/dashboard/create_topic', methods=['POST'])
# @requires_auth
def creating_topic():
    response = insert_topic()
    return response

@tutor_routes.route('/api/dashboard/contact', methods=['POST'])
# @requires_auth
def contact_user():
    response = load_acontact()
    return response

@tutor_routes.route('/api/dashboard/sent', methods=['POST'])
# @requires_auth
def sentding():
    response = sent_msg()
    return response
