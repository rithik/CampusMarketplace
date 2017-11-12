from flask import Flask
from sqlalchemy import Column, Integer, String, Float
from database import Base
import settings

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = settings.DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    first_name = Column(String(length=50))
    last_name = Column(String(length=50))
    email = Column(String(length=120), unique=True)
    password = Column(String(length=50))
    university = Column(String(length=20))

    def __init__(self, first_name, last_name, email, password):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password
        self.university = email[email.index("@")+1:email.index(".")].lower()

    def __repr__(self):
        return '<email {}>'.format(self.email)

class Service(Base):
    __tablename__ = 'services'

    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    price = Column(Float())
    description = Column(String(100))
    category = Column(String(100))
    address = Column(String(200))
    requested_by = Column(Integer) # ID of the request user
    completed_by = Column(Integer) # ID of the completed user
    request = Column(Integer) # 0 = request - i want this done # 1 - i will do this
    university = Column(String(length=20))

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