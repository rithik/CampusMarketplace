from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
import os
from models import User, Service
import settings
import sys
from database import db_session
import json
from werkzeug.utils import secure_filename
import smtplib

app = Flask(__name__)
app.config['APP_SETTINGS'] = 'Config.DevelopmentConfig'
app.config['SQLALCHEMY_DATABASE_URI'] = settings.DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.secret_key = settings.SECRET_KEY

# APP_ROOT = os.path.dirname(os.path.abspath(__file__))
# UPLOAD_FOLDER = os.path.join(APP_ROOT, 'static\\uploads')

app.config['UPLOAD_FOLDER'] = "C:/Users/Rithik/CampusMarketplace/static/img/services/"

#db.session.add(u)
#db.session.commit()
#filter with .filter_by(univ=univ).all()

# {% for p in picures %}
# set-up
# {% endfor %}

@app.route('/harrassment', methods=["POST"])
def harassment():
    import harrasement_check as hc
    name = request.form["name"]
    email = request.form["email"]
    phone = request.form["phone"]
    message = request.form["message"]
    if any(word in message for word in hc.arrBad):
        send_message = name + " " + email + " " + phone + " " + message
        print(send_message, file=sys.stderr)
        send("Harassment Check", send_message, "marketplacecampus@gmail.com")
    flash("Thank you for reporting a harassment report. We will review your submission.")
    return redirect("/")

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

@app.route('/signout', methods=["GET"])
def signout():
    session.pop('messages', None)
    flash('You were logged out!')
    return redirect(url_for('home_page'))

@app.route('/buy/<id_num>', methods=["GET"])
def buy(id_num):
    messages = session["messages"]
    service = Service.query.filter_by(id=id_num).first()
    if service.completed_by == -1:
        message = "Please view your order confirmation on our website at: http://localhost:5000/buy/" + id_num
        send("Campus Marketplace Order Confirmation", message, user.email)
        send("Campus Marketplace Order Confirmation", message, me.email)
    service.completed_by = int(messages[messages.index(":")+1:len(messages)-1])
    me = User.query.filter_by(id=int(messages[messages.index(":")+1:len(messages)-1])).first()
    user = User.query.filter_by(id=service.requested_by).first()
    db_session.commit()
    return render_template("success.html", me=me, user=user, s=service)

@app.route('/service/<id_num>', methods=["GET"])
def service_info(id_num):
    messages = session["messages"]
    service = Service.query.filter_by(id=id_num).first()
    user = User.query.filter_by(id=service.requested_by).first()
    related = Service.query.filter_by(university=user.university, completed_by=-1, request=service.request, category=service.category).filter(Service.id != service.id).all()
    me = int(messages[messages.index(":")+1:len(messages)-1])
    return render_template("duty.html", me=me, user=user, s=service, rating=0, related=related)

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
    file = request.files["file"]
    requested_by = user_id
    request = int(request.form["request_service"])
    try:
        id_num = Service.query.all()[-1].id + 1
    except:
        id_num = 0
    ext_index = file.filename.rfind(".")
    ext = file.filename[ext_index:]
    filename = str(str(id_num) + ext).upper()
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    s = Service(title, price, desc, category, address, requested_by, request, filename)
    db_session.add(s)
    db_session.commit()
    return redirect("/home/All")

@app.route('/account', methods=["GET"])
def account():
    messages = session["messages"]
    user = User.query.filter_by(id=messages[messages.index(":")+1:len(messages)-1]).first()
    s = Service.query.filter_by(requested_by=user.id, request=0).count()
    t = Service.query.filter_by(requested_by=user.id, request=1).count()
    name = user.first_name + " " + user.last_name
    return render_template("account.html", name=name, email=user.email, num_requests=s, num_services=t)

@app.route('/home/<filter_category>', methods=["GET"])
def service_listings(filter_category="All"):

    data = session.get('messages', {})
    if len(data) == 0:
        return render_template("index.html", logged_in=False)
    else:
        messages = session["messages"]
        user = User.query.filter_by(id=messages[messages.index(":")+1:len(messages)-1]).first()
        name = user.first_name + " " + user.last_name
        if filter_category == "All":
            service_dict = Service.query.filter_by(university=user.university, completed_by=-1, request=0).all()
            service_dict2 = Service.query.filter_by(university=user.university, completed_by=-1, request=1).all()
        else:
            service_dict = Service.query.filter_by(university=user.university, completed_by=-1, request=0, category=filter_category).all()
            service_dict2 = Service.query.filter_by(university=user.university, completed_by=-1, request=1, category=filter_category).all()
        print(service_dict, service_dict2, file=sys.stderr)
        return render_template("index2.html", name=name, email=user.email, services_req=service_dict, services_pro=service_dict2, value=filter_category)


@app.route('/')
def home_page():
    try:
        data = session.get('messages', {})
        if len(data) == 0:
            return render_template("index.html", logged_in=False)
        else:
            return redirect("/home/All")
    except:
        session.pop('messages', None)
        return render_template("index.html", logged_in=False)

@app.route('/home_page')
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
        return redirect(url_for('.home_page'))


@app.route('/register', methods=["POST"])
def register():
    if request.method == "POST":
        first_name = request.form["first_name"]
        last_name = request.form["last_name"]
        email = request.form["email"]
        password = request.form["password"]
        confirm_password = request.form["confirm_password"]
        address = request.form["address"]
        if not email.index("@") > 0 and not email.index(".") > email.index("@"):
            flash("Invalid Email Address!")
            return redirect(url_for('.home_page'))
        if not confirm_password == password:
            flash("The two passwords you entered are not the same.")
            return redirect(url_for('.home_page'))
        u = User.query.filter_by(email=email).count()
        if u == 0:
            new_user = User(first_name, last_name, email, encode(password), address)
            db_session.add(new_user)
            db_session.commit()
            print('Created User', file=sys.stderr)
            flash("Registered successfully!")
            return redirect(url_for('.home_page'))
        flash("There is already a user created with this email address!")
        return redirect(url_for('.home_page'))


@app.route('/<name>')
def hello_name(name):
    if name == "home":
        return redirect("/home/All")

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

def send(subject, message,recipient):
    smtpObj = smtplib.SMTP('smtp.gmail.com', 587)
    smtpObj.ehlo()
    smtpObj.starttls()
    smtpObj.login('squabbasquanoose@gmail.com', 'tiffin123')
    print("HERE", file=sys.stderr)
    smtpObj.sendmail('squabbasquanoose@gmail.com', recipient, 'Subject: ' + subject + '\n' + message)
    smtpObj.quit()



if __name__ == '__main__':
    app.run()