from public.libraries.db.conn import db_read
import hashlib
import random
import time
import re



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


def check_errors(email, password):


    # list comprehension
    errors = [
            "Invalid email format!" if email and not is_valid_email(email) else None,
            "User already exists." if db_read("""SELECT * FROM USER WHERE username = %s""", (email,)) else None,
            "Password must be at least 8 characters long, contain one uppercase letter and one number." if password and not is_valid_password(password) else None,
        ]
    return [error for error in errors if error is not None]
    
    
