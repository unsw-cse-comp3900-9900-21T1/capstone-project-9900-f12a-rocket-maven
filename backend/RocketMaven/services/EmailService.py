import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from RocketMaven.models import Investor

def try_reset(emailTo):
    user = Investor.query.filter_by(email = emailTo).first()
    if user:
        send()
        return {"msg":"password reset email has been sent"}, 200
    else:
        return {"msg":"no such email in records"}, 400 #400 for temp



def send(emailTo="jfxh@dfg6.kozow.com"):
    sender_login = "rocket_maven@yahoo.com"
    sender_email = sender_login

    password = "hnbcwpaijwpxhgct"

    receiver_email = emailTo

    message = MIMEMultipart("alternative")
    message["Subject"] = "Test Email"
    message["From"] = sender_email
    message["To"] = receiver_email

    text = """
    Rocket Maven test

    """

    part1 = MIMEText(text, "plain")
    message.attach(part1)

    print(text)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.mail.yahoo.com", 465, context=context) as server:
        server.login(sender_login, password)
        server.sendmail(sender_email, receiver_email, message.as_string())
