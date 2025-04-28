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


@tutor_routes.route("/api/getting-started/avail", methods=['GET', 'POST'])
def avail():
    
    print("avail")
    response = avail()
    result = response.get_json()

    print(response)
    return result

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



@tutor_routes.route('/api/dashboard/load_profile', methods = ['GET'])
def load_profile():
    print("LOAD USER")
    response = load_user()
    load_profile = response.get_json()
    return load_profile















# GLOBAL FUNCTION and GLOBAL ROUTES 
# NOTE: DONT TOUCH unless you have permission or ask the project manager!!!!!!

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










# simulation test for Create Lesson

# fecth data
@tutor_routes.route('/api/dashboard/test', methods=['POST'])
# @requires_auth
def simulatuion_test():

    data = request.get_json()
    print("Create fetch Data Recieved:", data)

    return  jsonify({
        'default_subject': 'Computer',
         "subjects": ["English", "Science", "Filipino", "Math", "Computer"],
         "schedule": [
             "Mon, Tue, Wed | online at Morning 6am - 12pm",
             "Sun, Sat | F2F at Afternoon 12pm - 6pm"
         ],
        'rate': '150'
    })

# save data
@tutor_routes.route('/api/dashboard/test1', methods=['POST'])
# @requires_auth
def simulatuion_test1():

    data = request.get_json()
    print("Create Save Data Recieved:", data)
    return  jsonify({
        'return_url': '/api/dashboard/Astutor-tutor',
        'message': 'Save Success',
         "success": True,
    
    })

