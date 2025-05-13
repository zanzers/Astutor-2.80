from flask import Flask
from jinja2 import ChoiceLoader, FileSystemLoader
from public.libraries.auth.routes import routes
from public.libraries.public.public_routes import public_routes
from public.tutor_Dashboard.tutor_routes import tutor_routes
from public.student_Dashboard.student_routes import student_routes

app = Flask(__name__, static_folder="../frontend/static")


template_loader = ChoiceLoader([
    FileSystemLoader("../frontend/templates/public/"),
    FileSystemLoader("../frontend/templates/dashboard/"),
    FileSystemLoader("../backend/backend/message/"),
])

app.jinja_loader = template_loader


app.register_blueprint(public_routes)
app.register_blueprint(tutor_routes)
app.register_blueprint(student_routes)





if __name__ == "__main__":
    app.run(debug=True)



 