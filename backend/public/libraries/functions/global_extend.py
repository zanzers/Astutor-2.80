from flask import jsonify, request, current_app
from public.libraries.db.conn import db_read, db_write
from werkzeug.utils import secure_filename
from public.libraries.functions.utility import *
from http import HTTPStatus
import os



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
          update_query = "UPDATE tutor SET firstName = %s, lastName = %s, subject_id = %s  WHERE user_id = %s"
          db_write(update_query, (fname, lname, subject ,userId, ))
     
     else:
          
          insert_tutor = """ INSERT INTO tutor (user_id,subject_id, firstName, lastName) VALUES (%s, %s, %s, %s);"""
          tutor_Id = db_write(insert_tutor, (userId, subject, fname, lname, ))

     return {
          "fname": fname,
          "lname": lname,
          "tutor_id": tutor_Id
     }

def check_student_update(userId, fname, lname):
    print(userId, fname, lname)
    check_query = """SELECT student_id FROM student WHERE user_id = %s"""
    result = db_read(check_query, (userId,))
    print("result", result)

    if result:
        student_Id = result[0]['student_id']
        print("student_Id", student_Id)

        if lname.strip():
            update_query = "UPDATE student SET firstName = %s, lastName = %s WHERE user_id = %s"
            db_write(update_query, (fname, lname, userId))
        else:
            update_query = "UPDATE student SET firstName = %s, lastName = NULL WHERE user_id = %s"
            db_write(update_query, (fname, userId))

    else:
        if lname.strip():
            insert_student = """INSERT INTO student (user_id, firstName, lastName) VALUES (%s, %s, %s);"""
            student_Id = db_write(insert_student, (userId, fname, lname))
        else:
            insert_student = """INSERT INTO student (user_id, firstName, lastName) VALUES (%s, %s, NULL);"""
            student_Id = db_write(insert_student, (userId, fname))

    return {
        "fname": fname,
        "lname": lname,
        "student_id": student_Id
    }

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

def getId(id, table_name, column_name, pk_id):

     print("GET ID call()",id, table_name, column_name, pk_id)

     if not table_name.isidentifier() or not column_name.isidentifier() or not pk_id.isidentifier():
          raise ValueError("Invalid Table or column name")

     
     query = f"SELECT {column_name} FROM {table_name} WHERE {pk_id} = %s"
     result = db_read(query, (id,))
     
     print("Get ID:", result)
     if result:
          return result[0][column_name]
     return None

def check_subject(sub_name):

     sub_name = sub_name.strip().title()

     check_query = """ SELECT subject_id FROM subjects WHERE subject_name = %s"""
     result = db_read(check_query, (sub_name,))

     if result:
          return result[0]['subject_id']
     else:
          insert_query ="""INSERT INTO subjects(subject_name) VALUES(%s)"""
          insert_result = db_write(insert_query, (sub_name,))

          return insert_result[0]['subject_id']
     
