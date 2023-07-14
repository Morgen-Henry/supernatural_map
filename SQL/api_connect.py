import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from datetime import datetime
import os.path
from flask import Flask, jsonify
from flask_cors import CORS

data_folder = os.path.join("SQL")
file_to_open = os.path.join(data_folder, "Supnatural_Map.sqlite")

engine = create_engine(f"sqlite:///{file_to_open}")


session = Session(engine)
#conn = engine.connect()

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine, reflect = True)

# Save reference to the table
aliens = Base.classes.ufo
haunt =  Base.classes.hauntings
Bigfoot_report = Base.classes.bigfoot

# set up flask
app = Flask(__name__)
CORS(app, origins='*')

@app.route("/")
def welcome():
    """Wlecome to the data"""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/bigfoot<br/>"
        f"/api/v1.0/UFO<br/>"
        f"/api/v1.0/haunting<br/>"
    )

@app.route("/api/v1.0/bigfoot")
def bigfoots():

    session = Session(engine)

    results = session.query(Bigfoot_report.title, Bigfoot_report.timeOfSighting, Bigfoot_report.latitude, Bigfoot_report.longitude, Bigfoot_report.observed, Bigfoot_report.stateName)
    session.close()

    bigfoot_sightings = []
    for title, timeOfSighting, latitude,longitude, observed, stateName in results:
        bf_sight_dict = {}
        bf_sight_dict["latitude"] = latitude
        bf_sight_dict["longitude"] = longitude
        bf_sight_dict["stateName"] = stateName
        bf_sight_dict["observered"] = observed
        formatted_date = timeOfSighting.strftime('%Y-%m-%d %H:%M:%S')
        bf_sight_dict["timeOfSighting"] = formatted_date
        bf_sight_dict["title"] = title
        
        bigfoot_sightings.append(bf_sight_dict)
    
    return jsonify(bigfoot_sightings)

@app.route("/api/v1.0/UFO")
def alienz():
    session = Session(engine)
    results = session.query(aliens.stateCode, aliens.timeOfSighting, aliens.shape, aliens.duration, aliens.summary, aliens.latitude, aliens.longitude)
    session.close()

    alien_sightings = []
    for stateCode, timeOfSighting, shape, duration, summary, latitude, longitude in results:
        alien_sight_dict = {}
        alien_sight_dict["latitude"] = latitude
        alien_sight_dict["longitude"] = longitude
        alien_sight_dict["stateCode"] = stateCode
        alien_sight_dict["summary"] = summary
        formatted_date = timeOfSighting.strftime('%Y-%m-%d %H:%M:%S')
        alien_sight_dict["timeOfSighting"] = formatted_date
        alien_sight_dict["shape"] = shape
        alien_sight_dict["duration"] = duration
        alien_sightings.append(alien_sight_dict)
    
    return jsonify(alien_sightings)

@app.route("/api/v1.0/haunting")
def scaryGhost():
    session = Session(engine)
    results = session.query(haunt.latitude, haunt.longitude, haunt.stateCode, haunt.summary, haunt.locationDetails)
    session.close()

    ghost_sightings = []

    for latitude, longitude, stateCode, summary, locationDetails in results:
        ghost_sight_dict = {}
        ghost_sight_dict["latitude"] = latitude
        ghost_sight_dict["longitude"] = longitude
        ghost_sight_dict["stateCode"] = stateCode
        ghost_sight_dict["summary"] = summary
        ghost_sight_dict["locationDetails"] = locationDetails
        ghost_sightings.append(ghost_sight_dict)
    return jsonify(ghost_sightings)




if __name__ == '__main__':
    app.run(debug=True)