import re

from marshmallow import ValidationError
from RocketMaven.models import Investor, investor_watches
from RocketMaven.extensions import ma, db


def validate_password(password):
    special_chars = "~`!@#$%^&*()_+-=[]\\{}|:\";\'<>?,./"
    if not password:
        raise ValidationError("Cannot have an empty password")

    if len(password) < 8:
        raise ValidationError("Password cannot be less than 8 characters")

    if re.search("[0-9]", password) is None:
        raise ValidationError("Password must contain at least one digit")
    
    if re.search("[A-Z]", password) is None:
        raise ValidationError("Password must contain at least one capital letter")

    if re.search("[a-z]", password) is None:
        raise ValidationError("Password must contain at least one lowercase letter")

    if not any(x in password for x in special_chars):
       raise ValidationError("Password must contain at least one special character")


class InvestorSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int(dump_only=True)
    join_date = ma.Date(dump_only=True)
    email_verified = ma.Bool(dump_only=True)
    email = ma.Email()

    password = ma.String(load_only=True, required=True, validate=validate_password)

    class Meta:
        model = Investor
        sqla_session = db.session
        load_instance = True
        exclude = (
            "_password",
            "admin_account",
            "email_verified_code",
        )
