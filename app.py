from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
import os
from models import User, Service
import settings

app = Flask(__name__)
app.config['APP_SETTINGS'] = 'Config.DevelopmentConfig'
app.config['SQLALCHEMY_DATABASE_URI'] = settings.DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)

#db.session.add(u)
#db.session.commit()

@app.route('/')
def home_page():
    return render_template("index.html", error="")

@app.route('/login', methods=["POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = encode(request.form["password"])
        u = User.query.filter_by(email=username).first()
        if u == None:
            return render_template("index.html", error="There is no account associated with this email!")
        else:
            if not password == u.password:
                return render_template("index.html", error="Incorrect Password!")


@app.route('/<name>')
def hello_name(name):
    return "Hello {}!".format(name)

def linear_decode(plaintext,a,b,mod,alpha):
    b = -b
    a = inv_mod(a,mod)
    temp = ""
    for x in plaintext:
        temp += i2c(((c2i(x,alpha)+b)*a)%mod,alpha)
    return temp

def linear_encode(plaintext,a,b,mod,alpha):
    temp = ""
    for x in plaintext:
        temp += i2c(((c2i(x,alpha)*a)+b)%mod,alpha)
    return temp

def i2c(i,alphabet):
    return alphabet[i]

def c2i(c,alphabet):
    return alphabet.index(c)

def inv_mod(a, m):
    for x in range(0, m):
        if (a * x) % m == 1:
            return x
    return None

def encode(plaintext):
    alpha = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#$%^&*()-=_+[]\{}|;:,./<>?~`qwertyuiopasdfghjklzxcvbnm "
    return linear_encode(plaintext,5,-14,len(alpha),alpha)

def decode(ciphertext):
    alpha = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#$%^&*()-=_+[]\{}|;:,./<>?~`qwertyuiopasdfghjklzxcvbnm "
    return linear_decode(ciphertext,5,-14,len(alpha),alpha)



if __name__ == '__main__':
    app.run()