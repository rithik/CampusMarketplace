from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import settings

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = settings.DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(length=50))
    last_name = db.Column(db.String(length=50))
    email = db.Column(db.String(length=120), nullable=False)
    password = db.Column(db.String(length=50))
    university = db.Column(db.String(length=20))

    def __init__(self, first_name, last_name, email, password):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password
        self.university = email[email.index("@")+1:email.index(".")].lower()

    def __repr__(self):
        return '<email {}>'.format(self.email)

class Service(db.Model):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    price = db.Column(db.Float())
    description = db.Column(db.String(100))
    category = db.Column(db.String(100))
    address = db.Column(db.String(200))
    requested_by = db.Column(db.Integer) # ID of the request user
    completed_by = db.Column(db.Integer) # ID of the completed user
    request = db.Column(db.Boolean()) # True = request - i want this done # false - i will do this
    university = db.Column(db.String(length=20))

    def __init__(self, title, price, desc, category, address, requested_by, request):
        self.title = title
        self.price = float(price)
        self.description = desc
        self.category = category
        self.address = address
        self.requested_by = requested_by
        self.request = request
        self.university = self.requested_by.university

    def __repr__(self):
        return '<title {}>'.format(self.title)