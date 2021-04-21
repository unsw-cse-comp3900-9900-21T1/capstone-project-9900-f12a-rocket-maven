import re

from marshmallow import ValidationError
from RocketMaven.api.schemas import AssetSchema
from RocketMaven.extensions import db, ma
from RocketMaven.models import Investor, Watchlist


def validate_password(password: str):
    """Checks password meets requirements as per system design.
    Raises a ValidationError if it fails
    """
    # special_chars = "~`!@#$%^&*()_+-=[]\\{}|:\";\'<>?,./"
    if not password:
        raise ValidationError("Cannot have an empty password")

    if len(password) < 12:
        raise ValidationError("Password cannot be less than 12 characters")

    if re.search("[A-Z]", password) is None:
        raise ValidationError("Password must contain at least one capital letter")

    if re.search("[a-z]", password) is None:
        raise ValidationError("Password must contain at least one lowercase letter")

    # if re.search("[0-9]", password) is None:
    #     raise ValidationError("Password must contain at least one digit")

    # if not any(x in password for x in special_chars):
    #    raise ValidationError("Password must contain at least one special character")


class InvestorSchema(ma.SQLAlchemyAutoSchema):
    """ A schema for the Investor model """

    # The id is a unique identifier, automatically generated
    id = ma.Int(dump_only=True)

    # The date the investor joined, automatically generated
    join_date = ma.Date(dump_only=True)

    # A flag to indicate whether the investor's email has been validated as active and owned
    email_verified = ma.Bool(dump_only=True)

    # The investor's email
    email = ma.Email(dump_only=True)

    # The user's plaintext password
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


class InvestorCreateSchema(InvestorSchema):
    """ A schema for when an Investor is created """

    """ The investor's email """
    email = ma.Email()


class WatchlistSchema(ma.SQLAlchemyAutoSchema):
    """ A schema for an investor's watchlist """

    """ The user's specificied low price """
    price_low = ma.Float()

    """ The user's specified high price """
    price_high = ma.Float()

    """ The asset to be watched """
    asset = ma.Nested(AssetSchema, many=False)

    class Meta:
        model = Watchlist
        sqla_session = db.session
        load_instance = True
