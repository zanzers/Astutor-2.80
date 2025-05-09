from public.libraries.db.conn import db_read
import hashlib
import random
import time
import re
import base64
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import os

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
    font_path = "Figtree/Figtree-VariableFont_wght.ttf"


    try:

        title_font = ImageFont.truetype(font_path, 24)
        body_font = ImageFont.truetype(font_path, 26)
        verified_font = ImageFont.truetype(font_path, 20)
    except IOError:
        
        print("Font not found. Using default.")
        title_font = body_font = verified_font = ImageFont.load_default()
        
    draw.rectangle([(0, 0), (width, 50)], fill="#FF6500")  
    draw.text((20, 12), "DMI Verification", fill="black", font=title_font)

    x_label = 30
    x_value = 150 
    y_start = 100
    line_spacing = 40 

    draw.text((x_label, y_start), "UID:", fill="black", font=body_font)
    draw.text((x_value, y_start), UID, fill="black", font=body_font)

    draw.text((x_label, y_start + line_spacing), "Name:", fill="black", font=body_font)
    draw.text((x_value, y_start + line_spacing), f"{lname}, {fname}", fill="black", font=body_font)

    draw.text((x_label, y_start + line_spacing * 2), "Phone:", fill="black", font=body_font)
    draw.text((x_value, y_start + line_spacing * 2), number, fill="black", font=body_font)

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


def upload_img(file, user,subfolder):

    print("Utility", file, user)

    if not file or not user:
        return None

    folder = os.path.join("backend", subfolder)
    os.makedirs(folder, exist_ok = True)

    if file.startswith("data:image"):
        file = file.split(",")[1]

    filename = f"msg_{user}.png"
    full_path = os.path.join(folder, filename)

    
    try:
        with open(full_path, "wb") as img_file:
            img_file.write(base64.b64decode(file))
        return full_path
    except Exception as e:
        print("Image upload error:", e)
        return None