from flask import Flask, jsonify
from flask import render_template
import pandas as pd
import json

app = Flask(__name__)
          
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/data")
def get_data():

	file = open("/Users/mkondeti/Documents/CSE564/final project/data/us_sensus_aggregate.json", "r")
	json_projects = json.load(file)
	return json_projects
	
if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
