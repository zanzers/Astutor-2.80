from flask import jsonify, request, current_app
from public.libraries.db.conn import db_read, db_write
from werkzeug.utils import secure_filename
from public.libraries.functions.utility import *
from http import HTTPStatus
import os


# NOTE: handle both about-profile of tutor & student, Subjects
# video upload, profile image and diploma storing.

otp_store = {}

def insert_user():
     
     data = request.get_json()
     requested_by = data.get("requested_by")
     userId = data.get("UserID")
     fname = data.get("fname", "").strip()
     lname = data.get("lname", "").strip()
     email = data.get("email", "").strip()
     subject = data.get("subject", "").strip()

     match requested_by:
          case "tutor":
               print(subject)
               update_user(userId, fname,  email)
               tutor_data = check_tutor_update(userId, fname, lname, subject)

               return jsonify({
                    "data": {
                         "fullname": f"{tutor_data['lname']}, {tutor_data['fname']}",
                         "subject": tutor_data['subject'],
                         "tutor_id": tutor_data['tutor_id'],
                    },
                    "success": True,
                    "message": "Tutor profile created successfully.",
               }), HTTPStatus.CREATED



# NOTE: handle diploma upload and profile
def fetch_subjects():
    
#     return one for each subjects!
    try:
        query = "SELECT subjects FROM subject"
        results = db_read(query)

        if results is None:
            raise ValueError("Database read failed")

        subjects = list(set(row['subjects'] for row in results))
        print("Subjects fetched:", subjects)

        return jsonify({
             "subjects": subjects
             })

    except Exception as e:
        print("Error fetching subjects:", e)
        return jsonify({
            "error": str(e)
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

def upload(userId, file):

    if not file or file.filename == "":
        print("No file recived by the backend")

    print("Photo", file.filename, userId)

    safe_filename = secure_filename(file.filename)
    ext = safe_filename.rsplit('.', 1)[-1].lower()
    filename = f"{userId}_profile.{ext}"

    user_folder = os.path.join(current_app.root_path, 'backend', 'user', str(userId))
    os.makedirs(user_folder, exist_ok=True)

    save_path = os.path.join(user_folder, filename)
    file.save(save_path)

    image_url = f"/user_uploads/{userId}/{filename}"

    print("SAVE PATH", save_path)

    return save_path, image_url


def update_user(userID, fname, email):
     
     print("update:", userID, fname, email)
     update_user = """ UPDATE user SET username = %s, email = %s  WHERE id = %s"""
     db_write(update_user, (fname, email, userID))



def check_tutor_update(userId, fname, lname, subject):
     
     print(userId, fname, lname, subject)
     check_query = """SELECT tutor_id FROM tutor WHERE user_id = %s"""
     result = db_read(check_query, (userId, ))
    
     print("result", result)

     if result:
          tutor_Id = result[0]['tutor_id']
          print("tutor_Id", tutor_Id)
          update_query = "UPDATE tutor SET firstName = %s, lastName = %s WHERE user_id = %s"
          db_write(update_query, (fname, lname, userId))

          insert_subject = """ UPDATE subject SET subjects = %s WHERE tutor_id = %s"""
          db_write(insert_subject, (subject, tutor_Id))
     
     else:
          
          insert_tutor = """ INSERT INTO tutor (user_id, firstName, lastName) VALUES (%s, %s, %s);"""
          tutor_Id = db_write(insert_tutor, (userId, fname, lname))
    

          insert_subject = """ INSERT INTO subject (tutor_id, subjects) VALUES (%s, %s)"""
          db_write(insert_subject, (tutor_Id, subject))

 

     return {
          "fname": fname,
          "lname": lname,
          "subject": subject,
          "tutor_id": tutor_Id
     }
     
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

def confirm():
     data = request.get_json()
     userId = data.get("userId")
     fname = data.get("fname")
     lname = data.get("lname")
     email = data.get("email")
     number = data.get("number")

     print("Confirm ",userId)
     tutorId = getId(userId, 'tutor','tutor_id', 'user_id' )



     try:
          insert_query = """INSERT INTO dmi (user_id, fname, lname, email, user_number) VALUES ( %s ,%s, %s , %s, %s)"""
          db_write (insert_query,(tutorId, fname, lname, email, number))

          insert_request = """INSERT INTO request (tutor_id) VALUES(%s)"""
          db_write(insert_request, (tutorId, ))


          print("confirm")

          return  jsonify({
               "message": "user Confirm",
               "success": True
          })

     except Exception as e:
          print("Error: {e}")
          return jsonify({
               "error": "Internal server error",
               "success": False
          })
     
def without_account():
          data = request.get_json()
          userId = data.get("userId")
          pricing = data.get("pricing")

          tutorId = getId(userId, 'tutor','tutor_id', 'user_id' )

          try:
               insert_query = """INSERT INTO rate(tutor_id, per_rate) VALUES (%s, %s)"""
               db_write (insert_query,(tutorId, pricing))
               return  jsonify({
                    "success": True
          })

          except Exception as e:
               print("Error: {e}")
               return jsonify({
                    "error": "Internal server error",
                    "success": False
          })

def load_user():
    try:
        data = request.get_json()
        userId = data.get("userId")
        
        read_query = """SELECT
          CONCAT(t.lastname, ', ' , t.firstName) AS full_name,
            u.image_path FROM user u JOIN tutor t ON t.user_id = u.id WHERE u.id = %s"""
        load_result = db_read(read_query, (userId,))
        
        if not load_result:
            return jsonify({"error": "User not found", "success": False}), 404
        
        first_result = load_result[0]
     
        print("first_result", first_result)
        return jsonify({
            "name": first_result['full_name'],   
            "img_url": first_result['image_path']
        })
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            "error": "Internal server error",
            "success": False
        }), 500

def getId(id, table_name, column_name, pk_id):

     print(id, table_name, column_name, pk_id)

     if not table_name.isidentifier() or not column_name.isidentifier() or not pk_id.isidentifier():
          raise ValueError("Invalid Table or column name")

     
     query = f"SELECT {column_name} FROM {table_name} WHERE {pk_id} = %s"
     result = db_read(query, (id,))
     
     print("Get ID:", result)
     if result:
          return result[0][column_name]
     return None
    
