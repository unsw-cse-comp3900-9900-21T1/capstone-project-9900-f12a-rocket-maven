import sys
from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from RocketMaven.api.schemas import UserSchema
from RocketMaven.models import User
from RocketMaven.extensions import db
from RocketMaven.commons.pagination import paginate
from datetime import datetime

class Time(Resource):
  def get(self):
    print('Passed through the "current-time" endpoint!', file=sys.stderr)
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    return {"currentTime": current_time}

class LoginStub(Resource):
  def get(self):
    print('Passed through the "login" endpoint!', file=sys.stderr)
    return

  def post(self):
    print('Inside the login stub', file=sys.stderr)
    print(f"Values received are {request.json}", file=sys.stderr)
    # TODO(Jude): try creating and passing throgh the authentication tokens
    return {"msg": "Form submission successfull"}