import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from RocketMaven.models import Investor
from flask import request
import time
import hashlib
from RocketMaven.extensions import db

def try_reset():
    email = request.json.get("email")
    print(email)
    user = Investor.query.filter_by(email=email).first()
    if user:
        email_verified_code = hashlib.sha256(str(time.time()).encode()).hexdigest()
        user.email_verified_code = email_verified_code
        db.session.commit()
        send(email, email_verified_code)
        return {"msg":"password reset email has been sent"}, 200
    else:
        return {"msg":"no such email in records"}, 400 #400 for temp



def send(email_to, email_verified_code):
    sender_login = "rocket_maven@yahoo.com"
    sender_email = sender_login

    password = "hnbcwpaijwpxhgct"

    receiver_email = email_to

    message = MIMEMultipart("alternative")
    message["Subject"] = "Password Reset"
    message["From"] = sender_email
    message["To"] = receiver_email

    text ='<a href="http://127.0.0.1:5100/pw_reset?key=' + email_verified_code + '">click here to reset your password</a>'

    part1 = MIMEText(text, "html")
    message.attach(part1)

    print(text)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.mail.yahoo.com", 465, context=context) as server:
        server.login(sender_login, password)
        server.sendmail(sender_email, receiver_email, message.as_string())


def change_password():
    print("-------changing password------")
    # password = request.json.get("password")
    # confirmation = request.json.get("confirmation")
    # eva = request.json.get("challenge_code")

    evc = request.form["evc"]
    if evc == None:
    	return "<h1>password change unsuccessfully page (no verification code) </h1>", 400


    password = request.form["password"]
    confirmation = request.form["confirmation"]

    print("password:", password)
    print("evc:", evc)

    if password == confirmation:
        user = Investor.query.filter_by(email_verified_code = evc).first()
        if user:
            user.password = password
            user.email_verified_code = None
            db.session.commit()
            return "<h1>password change successfully page 111</h1>", 200
        else:
            return "<h1>password change unsuccessfully page 222</h1>", 400

    else:
        return "<h1>password change unsuccessfully page 333 </h1>", 400


