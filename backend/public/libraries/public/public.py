from flask import jsonify, request, current_app
from public.libraries.db.conn import db_read, db_write
from werkzeug.utils import secure_filename
from public.libraries.functions.utility import *
from public.libraries.functions.global_extend import *
from http import HTTPStatus
import os


def home_content():
        
    
        data = request.get_json()
        userID = data.get('userId')

        studentId = getId(userID, 'student', 'student_id', 'user_id')
        
        recom_topic = recommended(studentId)

        return jsonify({
                "success": True,
                "recommended": recom_topic
        })
        

def view_tutor():
        data = request.get_json()
        scheduleId = data.get('scheduleId')

        
        view_query = """
                SELECT
                        u.id,
                        s.schedule_id,
                        t.firstName, t.lastName, t.about,
                        u.image_path,
                        s.topic,
                        s.day,
                        s.method, 
                        s.time,
                        s.description,
                        s.barter,
                        subj.subject_name,
                        r.per_rate,
                        COUNT(e.student_id) AS student_count 
                FROM schedule s
                JOIN tutor t ON s.tutor_id = t.tutor_id
                JOIN user u ON t.user_id = u.id
                JOIN subjects subj ON t.subject_id = subj.subject_id
                LEFT JOIN rate r ON t.tutor_id = r.tutor_id
                LEFT JOIN enroll e ON s.schedule_id = e.schedule_id 
                WHERE s.schedule_id = %s
                GROUP BY s.schedule_id, t.firstName, t.lastName, t.about, u.image_path, 
                        s.topic, s.day, s.method, s.time, s.description, s.barter, 
                        subj.subject_name, r.per_rate
                """
        view_result = db_read(view_query, (scheduleId,))

        print("view_result", view_result)

        return view_result
        

def recommended(studentId):
           
        subject_name = "SELECT focus_subjects FROM personalization WHERE student_id = %s"
        subname_result = db_read(subject_name, (studentId,))

        if not subname_result:
                return {"recommendations": [], "others": []}
        
        focus_subjects_str = subname_result[0]['focus_subjects']
        focus_subjects = [s.strip() for s in focus_subjects_str.split(',')]
        placeholders = ','.join(['%s'] * len(focus_subjects))

        subject_id_query = f"SELECT subject_id FROM subjects WHERE subject_name IN ({placeholders})"
        subId_results = db_read(subject_id_query, tuple(focus_subjects))

        subject_ids = [row['subject_id'] for row in subId_results]

        if not subject_ids:
                subject_ids = []

        placeholders_sub = ','.join(['%s'] * len(subject_ids)) if subject_ids else None

        common_select = """
                SELECT 
                u.id,
                s.schedule_id,
                s.subject_id,
                s.tutor_id,
                t.firstName, 
                t.lastName, 
                t.about,
                u.image_path,
                s.topic,
                s.description,
                subj.subject_name
                FROM schedule s
                JOIN tutor t ON s.tutor_id = t.tutor_id
                JOIN user u ON t.user_id = u.id
                JOIN subjects subj ON t.subject_id = subj.subject_id
                WHERE NOT EXISTS (
                SELECT 1
                FROM enroll e
                WHERE e.schedule_id = s.schedule_id
                AND e.student_id = %s
                AND (e.request = 1 OR e.approve = 1)
                )
        """


        recommended_query = common_select + f" AND s.subject_id IN ({placeholders_sub}) GROUP BY s.schedule_id, t.firstName, t.lastName, u.image_path, s.topic, s.description, subj.subject_name" if subject_ids else None
        params_recommended = (studentId,) + tuple(subject_ids) if subject_ids else (studentId,)


        others_query = common_select + f" AND s.subject_id NOT IN ({placeholders_sub}) GROUP BY s.schedule_id, t.firstName, t.lastName, u.image_path, s.topic, s.description, subj.subject_name" if subject_ids else common_select + " GROUP BY s.schedule_id, t.firstName, t.lastName, u.image_path, s.topic, s.description, subj.subject_name"
        params_others = (studentId,) + tuple(subject_ids) if subject_ids else (studentId,)

        recommended = []
        if recommended_query:
                rec_results = db_read(recommended_query, params_recommended)
                print("recommended_query", rec_results)
                for row in rec_results:
                        recommended.append({
                                "userID": row['id'],
                                "schedule_id": row["schedule_id"],
                                "subject_id": row["subject_id"],
                                "tutor_id": row["tutor_id"],
                                "tutor_profile": {
                                "fullname": f"{row['lastName']}, {row['firstName']}",
                                "img_path": row['image_path'],
                                "subjects": [row['subject_name']],
                                },
                                "details": {
                                "topic": row['topic'],
                                "description": row['description']
                                }
                })

        other_schedules = []
        other_results = db_read(others_query, params_others)
        for row in other_results:
                other_schedules.append({
                "userID": row['id'],
                "schedule_id": row["schedule_id"],
                "subject_id": row["subject_id"],
                "tutor_id": row["tutor_id"],
                "tutor_profile": {
                        "fullname": f"{row['lastName']}, {row['firstName']}",
                        "img_path": row['image_path'],
                        "subjects": [row['subject_name']],
                },
                "details": {
                        "topic": row['topic'],
                        "description": row['description']
                }
                })

        # print("[recommended]:", recommended)
        # print("[other_schedules]:", other_schedules)

        return {
        "recommendations": recommended,
        "others": other_schedules
    }

def load_tutor():
    try:
        top_query = """
           WITH tutor_counts AS (
                        SELECT 
                        t.tutor_id,
                        COUNT(e.enroll_id) AS total_students
                        FROM enroll e
                        JOIN schedule s ON e.schedule_id = s.schedule_id
                        JOIN tutor t ON s.tutor_id = t.tutor_id
                        WHERE e.approve = 1
                        GROUP BY t.tutor_id
                        ORDER BY total_students DESC
                        LIMIT 3
                        )

                        SELECT 
                        t.tutor_id,
                                CONCAT(t.lastName, ', ', t.firstName) AS full_name,
                        u.image_path,
                        subj.subject_name,
                        COALESCE(tc.total_students, 0) AS total_students,
                        CASE 
                                WHEN tc.tutor_id IS NOT NULL THEN TRUE
                                ELSE FALSE
                        END AS is_top
                        FROM tutor t
                        JOIN user u ON t.user_id = u.id
                        JOIN subjects subj ON t.subject_id = subj.subject_id
                        LEFT JOIN tutor_counts tc ON t.tutor_id = tc.tutor_id;

        """
        result = db_read(top_query)
        # print("TOP", result)
        return jsonify({
            "success": True,
            "topTutors": result
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


def enrolled_request():
        data = request.get_json()
        userId = data.get('id')
        schedID = data.get('enrolledId') 
        requestVal = 1



        studentId =getId(userId,'student', 'student_id', 'user_id')

        print("enrolled_request", data, studentId)
        try:
                student_request = """
                        INSERT INTO enroll (schedule_id, student_id, request) VALUES(%s, %s, %s) 
                        """
                db_write(student_request, (schedID, studentId, requestVal,))
        
                return jsonify({
                        "success": True,
                        "message": "Request Sent"
                })
        except Exception as e:
               return jsonify({
                       "error": False, 
                       "message": str(e)}), 500



