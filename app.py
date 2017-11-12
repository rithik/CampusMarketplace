from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
import os
from models import User, Service
import settings
import sys
from database import db_session
import json

app = Flask(__name__)
app.config['APP_SETTINGS'] = 'Config.DevelopmentConfig'
app.config['SQLALCHEMY_DATABASE_URI'] = settings.DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.secret_key = settings.SECRET_KEY


#db.session.add(u)
#db.session.commit()
#filter with .filter_by(univ=univ).all()

# {% for p in picures %}
# set-up
# {% endfor %}


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

@app.route('/signout', methods=["GET"])
def signout():
    session.pop('messages', None)
    flash('You were logged out!')
    return redirect(url_for('home_page'))

@app.route('/service/<id_num>', methods=["GET"])
def service_info(id_num):
    messages = session["messages"]
    service = Service.query.filter_by(id=id_num).first()
    try:
        title = service.title
        desc = service.description
        price = service.price
        user = User.query.filter_by(id=service.requested_by).first()
        name = user.first_name + " " + user.last_name
        return render_template("duty.html", title=title, desc=desc, price=price, full_name=name, rating=0)
    except:
        return redirect(url_for('.account'))

@app.route('/service/add', methods=["GET"])
def service_add():
    messages = session["messages"]
    user_id = messages[messages.index(":")+1:len(messages)-1]
    user = User.query.filter_by(id=user_id).first()
    name = user.first_name + " " + user.last_name
    return render_template("services.html")

@app.route('/service/add/post', methods=["POST"])
def service_add_post():
    from flask import request
    messages = session["messages"]
    user_id = messages[messages.index(":")+1:len(messages)-1]
    user = User.query.filter_by(id=user_id).first()
    name = user.first_name + " " + user.last_name
    title = request.form["title"]
    price = float(request.form["price"])
    desc = request.form["desc"]
    category = request.form["category"]
    address = request.form["address"]
    requested_by = user_id
    request = 0
    s = Service(title, price, desc, category, address, requested_by, request)
    db_session.add(s)
    db_session.commit()
    return redirect(url_for('.account'))

@app.route('/account', methods=["GET"])
def account():
    messages = session["messages"]
    user = User.query.filter_by(id=messages[messages.index(":")+1:len(messages)-1]).first()
    name = user.first_name + " " + user.last_name
    return render_template("account.html", name=name, email=user.email)

@app.route('/')
def home_page():
    data = session.get('messages', {})
    if len(data) == 0:
        return render_template("index.html", logged_in=False)
    else:
        return redirect(url_for('.account'))

@app.route('/home')
def home_page_view():
    data = session.get('messages', {})
    if len(data) == 0:
        return render_template("index.html", logged_in=False)
    else:
        return render_template("index.html", logged_in=True)

@app.route('/login', methods=["POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = encode(request.form["password"])
        u = User.query.filter_by(email=email).count()
        if u == 0:
            flash("No account was created with this email address!")
            return redirect(url_for('.home_page'))
        user = User.query.filter_by(email=email).first()
        if not password == user.password:
            flash("Invalid Password!")
            return redirect(url_for('.home_page'))
        session['messages'] = json.dumps({"user":user.id})
        return redirect(url_for('.account'))


@app.route('/register', methods=["POST"])
def register():
    if request.method == "POST":
        first_name = request.form["first_name"]
        last_name = request.form["last_name"]
        email = request.form["email"]
        password = request.form["password"]
        confirm_password = request.form["confirm_password"]
        if not email.index("@") > 0 and not email.index(".") > email.index("@"):
            flash("Invalid Email Address!")
            return redirect(url_for('.home_page'))
        if not confirm_password == password:
            flash("The two passwords you entered are not the same.")
            return redirect(url_for('.home_page'))
        u = User.query.filter_by(email=email).count()
        if u == 0:
            new_user = User(first_name, last_name, email, encode(password))
            db_session.add(new_user)
            db_session.commit()
            print('Created User', file=sys.stderr)
            flash("Registered successfully!")
            return redirect(url_for('.home_page'))
        flash("There is already a user created with this email address!")
        return redirect(url_for('.home_page'))


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