
# For Heroku support deploying the app from a subfolder.
import sys
sys.path.append("/app/backend/")

from RocketMaven.app import create_app

app = create_app()
