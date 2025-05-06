from public.libraries.db.conn import db_read
import hashlib
import random
import time
import re
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont


def generate_otp() -> tuple[str, int]:
    otp_code = str(random.randint(10000, 99999))
    return otp_code


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def is_valid_password(password):
    return(
        len(password) >= 8 and
        any(char.isupper() for char in password) and
        any(char.isdigit() for char in password)
    )

def is_valid_email(email):
    print("is valid:", email)
    return bool(re.match(r"^[^@]+@[^@]+\.[^@]+$", email))


def check_errors(email, password, confirm):


    # list comprehension
    errors = [
            "Invalid email format!" if email and not is_valid_email(email) else None,
            "User already exists." if db_read("""SELECT * FROM USER WHERE username = %s""", (email,)) else None,
            "Password must be at least 8 characters long, contain one uppercase letter and one number." if password and not is_valid_password(password) else None,
            "Password do not match." if password != confirm else None
        ]
    return [error for error in errors if error is not None]
    
    

def generate_dmi(UID, fname, lname, email, number):

    width, height = 360, 300
    img = Image.new("RGB", (width, height), color = (255,255,255))
    draw = ImageDraw.Draw(img)
    font_path = "Roboto/Roboto-Italic-VariableFont_wdth,wght.ttf"

    try:

        font = ImageFont.truetype(font_path, 20)
    except IOError:
        print("Font not found. Using default.")
        font = ImageFont.load_default()

    y_start = 30
    line_height = 40 

    draw.text((30, y_start), f"UID: {UID}", fill="black", font=font)
    draw.text((30, y_start + line_height * 1), f"Name: {lname}, {fname}", fill="black", font=font)
    draw.text((30, y_start + line_height * 2), f"Email: {email}", fill="black", font=font)
    draw.text((30, y_start + line_height * 3), f"Phone: {number}", fill="black", font=font)
    draw.text((30, y_start + line_height * 4), "Account verified by DMI", fill="green", font=font)


    img_io = BytesIO()
    img.save(img_io, "PNG")
    img_io.seek(0)
    return img_io





def find_user_id(user_info):
        
        user_id = user_info[0]['id'];

        try:
            tutor_query = """ SELECT tutor_id FROM tutor WHERE user_id = %s AND user_state = 1"""
            tutor_result = db_read(tutor_query, (user_id, ))

            if tutor_result:
                return tutor_result[0]['tutor_id']

            student_query = """ SELECT student_id FROM student WHERE user_id = %s AND user_state = 1"""
            student_result = db_read(student_query, (user_id, )) 

            if student_result:
                return student_result[0]['student_id']

            return None
            
        except Exception as e:
            print("Error in Find_user_id():", str(e))
            return None
