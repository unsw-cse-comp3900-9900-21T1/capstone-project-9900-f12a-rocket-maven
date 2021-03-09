"""Extensions registry

All extensions here are used as singletons and
initialized in application factory
"""
from flask_sqlalchemy import SQLAlchemy
from passlib.context import CryptContext
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate

from RocketMaven.commons.apispec import APISpecExt


db = SQLAlchemy()
jwt = JWTManager()
ma = Marshmallow()
migrate = Migrate()
apispec = APISpecExt()
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# https://stackoverflow.com/questions/31794195/how-to-correctly-add-foreign-key-constraints-to-sqlite-db-using-sqlalchemy
# cursor = db.cursor()
# cursor.execute("PRAGMA foreign_keys=ON")
# cursor.close()
