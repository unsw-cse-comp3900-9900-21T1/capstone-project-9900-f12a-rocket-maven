import time
from flask import Flask

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    print("Get_current_time is being called")
    return {'time': time.time()}
