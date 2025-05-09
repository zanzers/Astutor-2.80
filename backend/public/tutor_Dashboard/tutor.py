from flask import Blueprint, render_template, request
from public.tutor_Dashboard.tutor_utility import *
from public.libraries.auth.auth_token import *
from public.libraries.functions.global_fucntions import *
from public.libraries.functions.utility import *
from public.libraries.db.conn import db_read, db_write
from io import BytesIO
import base64
from PIL import Image, ImageDraw, ImageFont


def tutor_education():
    # NOTE: Education need to insert the all except for the diplomas
    # NOTE: after that you need to get the credentialIfo_id, this a automatic 
    # done by the conn you just need to add credential_id = db_write(query, params)
    # use this for each diploma image to get diploma_{credentail_id}.{extension}
    # then pass this in the GLOBAL_Fucntion upload(userId, file) expected file format diploma_{credentail_id}.{extension}
    # after check the folder backend -> user -> userID e.g 75 and look for the diploma file their.


    try:

        userId = request.form.get('userId')
        userId = request.form.get('userId')
        schools = request.form.getlist('school[]')
        degrees = request.form.getlist('degree[]')
        statuses = request.form.getlist('status[]')
        fields = request.form.getlist('field_study[]')
        start_years = request.form.getlist('start_year[]')
        end_years = request.form.getlist('end_year[]')
        diplomas = request.files.getlist('diploma[]')



       


        for i in range(len(schools)):
                print(f"\n📚 Education Entry {i+1}")
                print("User:", userId)
                print("School:", schools[i])
                print("Degree:", degrees[i])
                print("Status:", statuses[i])
                print("Field of Study:", fields[i])
                print("Start Year:", start_years[i])
                print("End Year:", end_years[i])
                print("Received diploma files:", request.files.getlist('diploma[]'))
                print("Form fields:", request.form)

                diploma = diplomas[i] if i < len(diplomas) else None

    

        return jsonify({
             "success": True,
             "message": "education Uploaded",
        }), HTTPStatus.CREATED

    except Exception as e:
        print("Error in tutor_education:", str(e))
        return jsonify({'status': 'error', 'message': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR



def avail():


    data = request.get_json()
    tutorId = data.get("tutorID", "").strip()


    print(tutorId)

def transaction():
    data = request.get_json()
    ttutorID = data.get("ttutorID") 
    tfname = data.get("tfname") 
    tlname = data.get("tlname") 
    temail = data.get("temail") 
    tnumber = data.get("tnumber")

    print("data",ttutorID, tfname, tlname, temail, tnumber) 

    try:
        check_query = """SELECT fname, lname, email, user_number FROM dmi WHERE user_id = %s"""
        result = db_read(check_query, (ttutorID,))

    

        print("Resutl", result)

        if not result:
            return jsonify({
                "success": False, "message": "No DMI record found for this tutor ID"
                })
        else:

            dmi_data = result[0]
            match = (
                dmi_data['fname'] == tfname and
                dmi_data['lname'] == tlname and
                dmi_data['email'] == temail and 
                dmi_data['user_number'] == tnumber
            )

            if match:

                img_io = generate_dmi(ttutorID, tfname, tlname, temail, tnumber)
                img_64 = base64.b64encode(img_io.getvalue()).decode('utf-8')

                print("Match!!!!!!")

                return jsonify({
                    "success": True,
                    "dmi_img": img_64
                })
                

            else:

                print("Not matching!!")
                return  jsonify({
                      "success": False,
                })

        

       


       
    except Exception as e:
        print("DMI check failed:", e)
        return jsonify({"success": False, "error": str(e)}), 500




