from flask import jsonify, request, current_app
from public.libraries.db.conn import db_read, db_write
from werkzeug.utils import secure_filename
from public.libraries.functions.utility import *
from public.libraries.functions.global_extend import *
from http import HTTPStatus
import os


# NOTE: handle both about-profile of tutor & student, Subjects
otp_store = {}

def load_user():
    
    try:
        data = request.get_json()
        user_id = data.get("userId")
        account_type = find_user_default(user_id)


        if (account_type == "student"):
                return load_student_user(user_id, account_type)
        else:
             return load_tutor_user(user_id, account_type)

    except Exception as e:
        print("Exception in load_user:", e)
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), 500
       
        


      
def insert_user():
     
     data = request.get_json()
     requested_by = data.get("requested_by")
     userId = data.get("UserID")
     rname = data.get("fname", "").strip()
     rlname = data.get("lname", "").strip()
     email = data.get("email", "").strip()
     subject = data.get("subject", "").strip()

     fname = rname.strip().title()
     lname = rlname.strip().title()

     match requested_by:
          case "tutor":
               print(subject)
               subject_id = check_subject(subject)
               update_user(userId, fname,  email)
               tutor_data = check_tutor_update(userId, fname, lname, subject_id)

               return jsonify({
                    "data": {
                         "fullname": f"{tutor_data['lname']}, {tutor_data['fname']}",
                         "subject": subject,
                         "tutor_id": tutor_data['tutor_id'],
                    },
                    "success": True,
                    "message": "Tutor profile created successfully.",
               }), HTTPStatus.CREATED
          
          case "student":

               print("student")
               update_user(userId, fname,  email)
               student_data = check_student_update(userId, fname, lname)
               
               if student_data.get('lname', "").strip():
                    fullname = f"{student_data['lname']}, {student_data['fname']}"
               else:
                    fullname = student_data['fname']

               return jsonify({
                    "data": {
                         "fullname": fullname,
                         "student_id": student_data['student_id'],
                    },
                    "success": True,
                    "message": "Student profile created successfully.",
               }), HTTPStatus.CREATED
          

def fetch_subjects():
    try:
        query = "SELECT subject_id, subject_name FROM subjects"
        results = db_read(query)

        if results is None:
            raise ValueError("Database read failed")

        subjects = sorted([
            {"name": row['subject_name']}
            for row in results
        ], key=lambda x: x['name'])

        print("Subjects fetched:", subjects)

        return jsonify({"subjects": subjects})

    except Exception as e:
        print("Error fetching subjects:", e)
        return jsonify({
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

def fetch_topics():
    data = request.get_json()
    tutorID = data.get("tutorId")

    print("DATA ", data)

    try:
        
        query = """
            SELECT 
                s.subject_name,
                r.per_rate
            FROM 
                tutor t
            JOIN 
                subjects s ON t.subject_id = s.subject_id
            LEFT JOIN 
                rate r ON t.tutor_id = r.tutor_id
            WHERE 
                t.tutor_id = %s
        """
        result = db_read(query, (tutorID,))

        print("RESULT", result)

        if not result:
            raise ValueError("Tutor not found")

        # Get all available subjects (assumes fetch_subjects() returns a list of dicts like {'name': 'Math'})
        all_subjects = fetch_subjects().json.get('subjects', [])

        return jsonify({
            "success": True,
            "default_subject": result[0]['subject_name'],
            "rate": result[0]['per_rate'],
            "subjects": all_subjects
        })

    except Exception as e:
        print("Error in fetch_topics:", e)
        return jsonify({
            "success": False,
            "message": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR


def save_photo():
        
        file = request.files.get('profile-photo')
        userId = request.form.get('userId')
        uploaded, img_url = upload(userId, file)

        try:
            insert_query = """ UPDATE user SET image_path = %s WHERE id =%s """
            db_write(insert_query, (img_url, userId))

        except Exception as e:
                return jsonify({
                'status': 'error',
                'message': f'Database error: {str(e)}'
            }), HTTPStatus.INTERNAL_SERVER_ERROR
                
                
        print("URL-IMG",img_url)
        return jsonify({
             'success': True, 
             'image_url': img_url
             }), HTTPStatus.OK

def request_otp():
     data = request.get_json()
     userId = data.get("userId")

     try:
          read_query = """ SELECT email FROM user WHERE id = %s """
          result = db_read(read_query, (userId,))
          
     except Exception as e:
          return jsonify({
          'status': 'error',
          'message': f'Database error: {str(e)}'
     }), HTTPStatus.INTERNAL_SERVER_ERROR

     otp = generate_otp()
     otp_store['email'] = result[0]['email']
     otp_store['otp'] = otp
     print(otp_store)
     return jsonify({
          'email': result[0]['email'],
          'otp': otp
     })

def verify_otp():
     data = request.get_json()
     email = data.get("email")
     otp = data.get("otpInput")

     if otp_store["email"] == email and otp_store["otp"] == otp:
          return jsonify({
          'success': True
     }) 
     else:
          return jsonify({
          'success': False 
     }) 
     
def payment():

     data = request.get_json()
     userId = data.get("userId")
     rate = data.get("pricing")
     paymentMethod = data.get("paymentMethod")
     phoneNumber = data.get("phoneNumber")
     tutorId = getId(userId, 'tutor','tutor_id', 'user_id' )

     print(userId, rate, paymentMethod, phoneNumber)

     try:
          print(userId,tutorId, rate, paymentMethod, phoneNumber)

          insert_query = """INSERT INTO payment_method(user_Id, payment_method, phonenumber) VALUES (%s, %s, %s)"""
          db_write(insert_query, (userId, paymentMethod, phoneNumber,))

          insert_query = """INSERT INTO rate(tutor_id, per_rate) VALUES (%s, %s)"""
          db_write(insert_query, (tutorId, rate,))

          read_query = """
               SELECT 
                    t.firstName,
                    t.lastName,
                    u.email,
                    pm.phonenumber  AS number,
                    r.per_rate
               FROM tutor t
               JOIN user u ON t.user_id = u.id
               LEFT JOIN payment_method pm ON t.user_id = pm.user_id
               LEFT JOIN rate r ON t.tutor_id = r.tutor_id
               WHERE t.tutor_id = %s"""
          result = db_read(read_query,(tutorId, ))

          if result:
               data = result[0]

               return jsonify({
                    "firstname": data.get('firstName'),
                    "lastname": data.get('lastName'),
                    "email": data.get('email'),
                    "number": data.get('number'),
                    "rate": data.get('per_rate')
               })
          else:
               return jsonify({
                    "error": "No user data Found!"
               })


     except Exception as e:
          print("Error: {e}")
          return jsonify({
               "error": "Internal server error",
               "success": False
          })

def sent_msg():

     data = request.get_json()
     senderId = data.get("senderId")
     receiverId = data.get("receiverId")
     newMessage = data.get("newMessage")
     dmi_img = data.get("dmi_img")

     # print("SENT MSG", data)

     imagePath = upload_img(dmi_img, senderId, "message") if dmi_img else None


     inser_msg =""" INSERT INTO message (sender_id, reciever_id, message, image_path, is_read) VALUES(%s, %s, %s, %s, %s)"""
     result = db_write(inser_msg, (senderId, receiverId, newMessage, imagePath, 0));
 

     return jsonify({"success": True})




def load_msg_history():
    sender = request.args.get('sender_id')
    receiver = request.args.get('receiver_id')

    if not sender or not receiver:
        return jsonify({"success": False, "error": "Missing sender or receiver ID"}), 400

    print("Sender:", sender)
    print("Receiver:", receiver)

    history_query = """
        SELECT message_id, sender_id, reciever_id, message, image_path, date, is_read
        FROM message
        WHERE (sender_id = %s AND reciever_id = %s)
           OR (sender_id = %s AND reciever_id = %s)
        ORDER BY date ASC
    """
    msg = db_read(history_query, (sender, receiver, receiver, sender))

    print("load_msg_history", msg)
    return jsonify({
        "success": True,
        "messages": msg
    })

def save_video():
        
        file = request.files.get('video')
        userId = request.form.get('userID')
        uploaded, video_url = upload_vid(userId, file)

        print(userId, video_url)

        try:
            insert_query = """ INSERT INTO video(tutor_id, video_path) VALUES (%s, %s) """
            db_write(insert_query, (userId, uploaded))

        except Exception as e:
                return jsonify({
                'status': 'error',
                'message': f'Database error: {str(e)}'
            }), HTTPStatus.INTERNAL_SERVER_ERROR
                
        return jsonify({
             'success': True, 
             'video_url': video_url
             }), HTTPStatus.OK

