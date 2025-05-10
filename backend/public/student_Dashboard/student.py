from flask import jsonify, request
from public.libraries.db.conn import db_read, db_write
from public.libraries.functions.utility import *
from http import HTTPStatus
from public.libraries.functions.global_extend import *



def fecth_focus():



    query_subjects = "SELECT subject_id, subject_name FROM subjects"
    subjects = db_read(query_subjects)

    focus_data = []

    for subj in subjects:
        subject_id = subj["subject_id"]
        subject_name = subj["subject_name"]

        query_topics = """
            SELECT DISTINCT topic 
            FROM schedule 
            WHERE subject_id = %s AND topic IS NOT NULL AND topic != ''
        """

        topics = db_read(query_topics, (subject_id,))
        topic_list = [t["topic"] for t in topics]

        focus_data.append({
            "subject_id": subject_id,
            "subject_name": subject_name,
            "topics": topic_list
        })

    print("fecth_focus", focus_data) 
    return jsonify(focus_data)


def student_submit():
    data = request.get_json()
    budget = data.get("sentBudget", {})
    selected = data.get("selected", {})
    avail_form = data.get("avail_form", {})
    budgetValue = budget.get("budgetValue")
    
    userID = selected.get("userID") or avail_form.get("userID") or budget.get("userID")
    selectedSubjects = selected.get("selectedSubjects")

    student_id = getId(userID, 'student', 'student_id', 'user_id')
    availability = avail_form.get("availability", [])
    if availability:
        avail_entry = availability[0]
        days = ",".join(avail_entry.get("days", []))
        method = avail_entry.get("pref")
        time = avail_entry.get("time")
    else:
        days = method = time = None


    print("student_submit:", data, "student_id:", student_id)

    try:
        if selectedSubjects: 
            focus_subjects = ",".join(selectedSubjects)

            check_existing = """
                        SELECT personalization_id FROM personalization WHERE student_id = %s
                        """
            existing = db_read(check_existing, (student_id,))
            
            if existing:
                update_query = """
                UPDATE personalization SET focus_subjects = %s WHERE student_id = %s
                """
                db_write(update_query, (focus_subjects, student_id))
            else:
                insert_query = """
                    INSERT INTO personalization (student_id, focus_subjects) VALUES (%s, %s)
                    """
                db_write(insert_query, (student_id, focus_subjects))

            return jsonify({
                "success": True,
                "message": "Focus subjects saved."})

        elif days and method and time:

            print("AVAIL", days, method, time, student_id)
            update_query = """
                UPDATE personalization
                SET days = %s, method = %s, time = %s
                WHERE student_id = %s
            """
            db_write(update_query, (days, method, time, student_id, ))
            return jsonify({
                "success": True,
                "message": "Availability updated."
                })
        elif budget:
            
            print("BUDGET", budgetValue)
            update_query = """
                UPDATE personalization SET budget = %s WHERE student_id = %s
                """
            db_write(update_query, (budgetValue, student_id))
            return jsonify({
                "success": True,
                "home_url": '/api/Astutor|home',
                "message": "Budget saved."
            })


        else:
            return jsonify({
                "success": False, 
                "message": "Invalid data."
                })

    except Exception as e:
        print("Error in student_submit:", e)
        return jsonify({"success": False, "message": "Internal error."})
