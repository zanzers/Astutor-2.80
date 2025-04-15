from flask import Flask
from jinja2 import ChoiceLoader, FileSystemLoader
from public.libraries.auth.routes import routes
from public.libraries.public.public_routes import public_routes
from public.libraries.dashboard_route.dashboard_routes import dashboard_routes


app = Flask(__name__, static_folder="../frontend/static")


template_loader = ChoiceLoader([
    FileSystemLoader("../frontend/templates/public/"),
    FileSystemLoader("../frontend/templates/dashboard/"),
])

app.jinja_loader = template_loader


app.register_blueprint(public_routes)
app.register_blueprint(dashboard_routes)
app.register_blueprint(routes)




if __name__ == "__main__":
    app.run(debug=True)



 