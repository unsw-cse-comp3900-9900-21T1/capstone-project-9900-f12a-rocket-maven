import hashlib
import smtplib
import ssl
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from flask import request
from RocketMaven.extensions import db
from RocketMaven.models import Investor
import string
import random
import datetime


def try_reset():
    """Initiate a password reset process
    Returns:
        200 - password reset email sent
        400 - Malformed request
        404 - Email not found
    """
    email = request.json.get("email")
    if not email:
        return {"msg": "Malformed request"}, 400

    user = Investor.query.filter_by(email=email).first()
    if user:
        if not user.email_last_reset_attempt or (
            datetime.datetime.now() - user.email_last_reset_attempt
            > datetime.timedelta(minutes=2)
        ):
            try:
                # https://stackoverflow.com/questions/2511222/efficiently-generate-a-16-character-alphanumeric-string
                email_verified_code = "".join(
                    random.choices(string.ascii_letters + string.digits, k=64)
                )
                user.email_last_reset_attempt = datetime.datetime.now()
                user.email_verified_code = email_verified_code
                db.session.commit()
                send(email, email_verified_code)
                return {"msg": "Password reset email has been sent"}, 200
            except Exception as err:
                print(err)
                return {"msg": "Error with password reset"}, 500
        else:
            return {
                "msg": "Password reset email already sent, please try again later"
            }, 400

    else:
        return {"msg": "No such email in records"}, 404


def send(email_to: str, email_verified_code: str):
    """ Composes an email to user containing verification code """
    sender_login = "rocket_maven@yahoo.com"
    sender_email = sender_login

    sender_password = "hnbcwpaijwpxhgct"

    receiver_email = email_to

    message = MIMEMultipart("alternative")
    message["Subject"] = "Rocket Maven Password Reset"
    message["From"] = sender_email
    message["To"] = receiver_email

    text = (
        '<a href="http://127.0.0.1:3000/reset?key='
        + email_verified_code
        + '">Click here to reset your password</a>'
    )

    part1 = MIMEText(text, "html")
    message.attach(part1)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.mail.yahoo.com", 465, context=context) as server:
        server.login(sender_login, sender_password)
        server.sendmail(sender_email, receiver_email, message.as_string())


def change_password():
    """Change a user's password given a valid verification code
    Returns:
        200 - successful password change
        400 - malformed request(no verification code or no user)
        404 - user's email does not exist
        500 - unexpected exception
    """
    # password = request.json.get("password")
    # confirmation = request.json.get("confirmation")
    # eva = request.json.get("challenge_code")
    if request.json is None:
        return {"msg": "Malformed request"}, 400

    evc = request.json.get("evc")
    if evc is None:
        return (
            "<h1>password change unsuccessfully page (no verification code) </h1>",
            400,
        )

    password = request.json.get("password")
    confirmation = request.json.get("confirmation")

    print("password:", password)
    print("evc:", evc)

    if password == confirmation:
        try:
            user = Investor.query.filter_by(email_verified_code=evc).first()
            if user:
                user.password = password
                user.email_verified_code = None
                db.session.commit()
                return {"msg": "Password change successful"}, 200
            else:
                return {"msg": "Password change unsuccessful"}, 404
        except Exception as err:
            print(err)
            return {"msg": "Unexpected error"}, 500
    else:
        return {"msg": "Passwords do not match"}, 400


def update_password():
    pass
