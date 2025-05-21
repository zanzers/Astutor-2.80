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

def upload_vid(userId, file):

    if not file or file.filename == "":
        print("No file recived by the backend")

    print("Video", file.filename, userId)

    safe_filename = secure_filename(file.filename)
    ext = safe_filename.rsplit('.', 1)[-1].lower()
    filename = f"{userId}_profile.{ext}"

    user_folder = os.path.join(current_app.root_path, 'backend', 'user', str(userId))
    os.makedirs(user_folder, exist_ok=True)

    save_path = os.path.join(user_folder, filename)
    file.save(save_path)

    video_url = f"/user_uploads/{userId}/{filename}"

    print("SAVE VIDEO PATH", save_path)

    return save_path, video_url


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
          insert_id  = db_write(insert_query, (sub_name,))

          return insert_id
     
def insert_topic():

     data = request.get_json()
     userId = data.get("userId")
     subject = data.get("subject")
     topic = data.get("topic")
     day = data.get("days")
     method = data.get("method")
     time = data.get("range")
     description = data.get("description")
     barter = data.get("barter")


     print("subject", subject, 'userId', userId)

     tutorId = getId(userId, 'tutor','tutor_id', 'user_id')
     subject_id = getId(subject, 'subjects', 'subject_id', "subject_name")
     print(tutorId, subject_id, "dsfsdfj")



     try:
          insert_query = """INSERT INTO schedule (subject_id, tutor_id, topic, day, method, time, description, barter) VALUES ( %s ,%s, %s , %s, %s, %s , %s, %s)"""
          db_write (insert_query,(subject_id, tutorId, topic, day, method, time, description, barter))

          print("confirm", data)

          return  jsonify({
               'return_url': '/api/dashboard/Astutor-tutor',
               'message': 'Save Success',
               "success": True,
          
          })

     except Exception as e:
          print("Error: {e}")
          return jsonify({
               "error": "Internal server error",
               "success": False
          })

def load_content():
     
     
     data = request.get_json()
     userId = data.get("userId")

     tutorID = getId(userId, 'tutor', 'tutor_id', 'user_id')

     print("load", tutorID)

     load_query = """
        SELECT 
          s.schedule_id, 
          s.subject_id, 
          sub.subject_name,
          s.topic, 
          s.day, 
          s.method, 
          s.time, 
          s.description,
          s.barter
          FROM schedule s
          JOIN subjects sub ON s.subject_id = sub.subject_id
          WHERE s.tutor_id = %s """
     
     enrolled_query = """
               SELECT 

                    e.schedule_id,
                    stu.firstName,
                    stu.lastName,
                    u.image_path,
                    u.id AS user_id
               FROM enroll e
               JOIN student stu ON e.student_id = stu.student_id
               JOIN user u ON stu.user_id = u.id
               WHERE e.schedule_id = %s """

     
     lessons = db_read(load_query, (tutorID,))
     for lesson in lessons:
        schedule_id = lesson["schedule_id"]
        student_list = db_read(enrolled_query, (schedule_id,))
        lesson['student_list'] = student_list
        print(f"Lesson {lesson}")

       

     return jsonify({
          "success": True,
          "lessons": lessons,
          "tutorID": tutorID
     })



def load_sub(userId):

     
     gettutor_ID = getId(userId, 'tutor', 'tutor_id', 'user_id');

     top_panel_query = """

               SELECT 
               COUNT(DISTINCT s.schedule_id) AS total_lessons,
               r.per_rate,
               COUNT(DISTINCT e.student_id) AS total_enrolled_students
               FROM tutor t
               LEFT JOIN schedule s ON t.tutor_id = s.tutor_id
               LEFT JOIN rate r ON t.tutor_id = r.tutor_id
               LEFT JOIN enroll e ON s.schedule_id = e.schedule_id AND e.approve = 1
               WHERE t.tutor_id = %s
               GROUP BY r.per_rate
               """
     
     result = db_read(top_panel_query, (gettutor_ID,))

     print("LOAD_SUB", result)
     return result

     
def load_acontact():
     
     contact_query = """

     SELECT 
          u.id AS userId,
          COALESCE(s.firstName, t.firstName) AS firstName,
          COALESCE(s.lastName, t.lastName) AS lastName,
          u.image_path
          FROM user u
          LEFT JOIN student s ON s.user_id = u.id
          LEFT JOIN tutor t ON t.user_id = u.id
          """
     
     contact_user = db_read(contact_query,)

     print("contact_user", contact_user);
     return contact_user

def find_user_default(user_id):
 
    student_query = "SELECT 1 FROM student WHERE user_id = %s AND `default` = 1 LIMIT 1"
    student_result = db_read(student_query, (user_id,))
    if student_result:
        return "student"
    
    tutor_query = "SELECT 1 FROM tutor WHERE user_id = %s AND `default` = 1 LIMIT 1"
    tutor_result = db_read(tutor_query, (user_id,))

    if tutor_result:
        return "tutor"
        
    
    return None 

def load_tutor_user(userId, account_type):
   

    read_query = """
        SELECT
    CASE 
        WHEN t.lastName IS NULL OR t.lastName = '' 
        THEN t.firstName 
        ELSE CONCAT(t.lastName, ', ', t.firstName) 
          END AS full_name,
          u.image_path,
          v.video_link,
          v.video_path
          FROM user u
          JOIN tutor t ON t.user_id = u.id
          LEFT JOIN video v ON v.tutor_id = t.tutor_id
          WHERE u.id = %s;

    """
 
    load_result = db_read(read_query, (userId,))


    
    if not load_result:
        print("No tutor found for user_id", userId)
        return jsonify({
            "error": "User not found", 
            "success": False
        })

    content = load_sub(userId)
    content_data = content[0]
    print("ratetete", content_data['total_lessons'], content_data['per_rate'], content_data['total_enrolled_students'])

    first_result = load_result[0]
    print("Tutor first_result:", first_result)

    return jsonify({
        "success": True,
        "video_path": first_result['video_path'],
        "account_type": account_type,
        "name": first_result['full_name'],   
        "img_url": first_result['image_path'],
        "total_lessons": content_data['total_lessons'],
        "per_rate": content_data['per_rate'],
        "total_students": content_data['total_enrolled_students']
    })


def load_student_user(userId, account_type):
        
    read_query = """
        SELECT 
            CASE 
                WHEN s.lastname IS NULL OR s.lastname = '' 
                THEN s.firstName 
                ELSE CONCAT(s.lastname, ', ', s.firstName) 
                END AS full_name, 
                u.image_path 
                FROM user u 
                JOIN student s ON s.user_id = u.id 
                WHERE u.id = %s
             """

    load_result = db_read(read_query, (userId,))
    print("Student load_result:", load_result)

    if not load_result:
        print("No student found for user_id", userId)
        return jsonify({
            "error": "User not found", 
            "success": False
        })

    first_result = load_result[0]
    return jsonify({
        "success": True,
        "role": account_type,
        "name": first_result['full_name'],
        "img_url": first_result['image_path']
    })





# ADMIN 


def admin_content_student():     
     feacth_students = """
           SELECT 
          s.student_id,
          s.firstName AS student_first,
          s.lastName AS student_last,
          su.id AS student_user_id,
          su.image_path AS student_image,

          t.tutor_id,
          t.firstName AS tutor_first,
          t.lastName AS tutor_last,
          tu.id AS tutor_user_id,
          tu.image_path AS tutor_image,

          sch.topic

          FROM student s
          JOIN user su ON s.user_id = su.id

          LEFT JOIN enroll e ON e.student_id = s.student_id AND e.approve = 1
          LEFT JOIN schedule sch ON sch.schedule_id = e.schedule_id
          LEFT JOIN tutor t ON sch.tutor_id = t.tutor_id
          LEFT JOIN user tu ON t.user_id = tu.id

          ORDER BY s.student_id, t.tutor_id;
    
     """

     students = db_read(feacth_students)

     feacth_tutors = """
          SELECT 
            u.id AS user_id,
            u.username,
            u.email,
            u.image_path,
            t.firstName,
            t.lastName,
            t.about,
            t.video_url
        FROM user u
        JOIN tutor t ON u.id = t.user_id
     """

     tutors = db_read(feacth_tutors)
     # print("feacth_students", students)
     # print("feacth_tutors", tutors)

     return jsonify({
          "students": students,
          "tutors": tutors
     })


def admin_content_tutor():
     feacth_tutors = """
          SELECT 
               u.id AS user_id,
               u.username,
               u.email,
               u.image_path,
               t.firstName,
               t.lastName,
               t.about,
               t.video_url
          FROM user u
          JOIN tutor t ON u.id = t.user_id
     """
     tutors = db_read(feacth_tutors)

     feacth_students = """
          SELECT 
               t.tutor_id,
               t.firstName AS tutor_first,
               t.lastName AS tutor_last,
               tu.id AS tutor_user_id,
               tu.image_path AS tutor_image,

               s.student_id,
               s.firstName AS student_first,
               s.lastName AS student_last,
               su.id AS student_user_id,
               su.image_path AS student_image,
               sch.topic

          FROM student s
          JOIN user su ON s.user_id = su.id

          LEFT JOIN enroll e ON e.student_id = s.student_id AND e.approve = 1
          LEFT JOIN schedule sch ON sch.schedule_id = e.schedule_id
          LEFT JOIN tutor t ON sch.tutor_id = t.tutor_id
          LEFT JOIN user tu ON t.user_id = tu.id

          WHERE t.tutor_id IS NOT NULL
          ORDER BY t.tutor_id, s.student_id
     """
     students = db_read(feacth_students)
     print("tutors", tutors)
     print("students", students)

     return jsonify({
          "tutors": tutors,
          "students": students
     })


def admin_content_request():
    query = """
        SELECT 
            t.tutor_id,
            t.firstName,
            t.lastName,
            t.about,
            t.video_url,
            t.subject_id,
            t.default,

            u.id AS user_id,
            u.username,
            u.email,
            u.image_path,
            r.date AS request_date

        FROM request r
        JOIN tutor t ON r.tutor_id = t.tutor_id
        JOIN user u ON t.user_id = u.id

        ORDER BY r.date DESC
    """

    requested_tutors = db_read(query)

    return jsonify({
        "requested_tutors": requested_tutors
    })
