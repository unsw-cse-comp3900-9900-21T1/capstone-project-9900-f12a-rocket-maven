import sys
import os

# https://github.com/pallets/werkzeug/issues/1832
if sys.platform.lower() == "win32":
    os.system("color")

from RocketMaven.app import create_app

app = create_app()
