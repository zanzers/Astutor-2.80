from flask import jsonify, request, current_app
from public.libraries.db.conn import db_read, db_write
from werkzeug.utils import secure_filename
from http import HTTPStatus
import os


# NOTE: handle both about-profile of tutor & student, Subjects
# video upload, profile image and diploma storing.

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

        subjects = [row['subjects'] for row in results]
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
            db_write(insert_query, (uploaded, userId))

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
     


