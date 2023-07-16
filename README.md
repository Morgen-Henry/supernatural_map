# Project 3 
## An interactive map marking UFO sightings, Bigfoot sightings, and various haunted places in the US.
Link to presentation: https://docs.google.com/presentation/d/1mUf4jQ6KF41G9Ts9xT8VNtGgcsMumkllIyL9-bx45bQ/edit?usp=sharing

- Group Members:
	- Morgen Henry
	- Mark Speers
	- Oliver Einarsson
	- Ryan Krause
	- Gina Fender

## Project Description

- Data Source:
  - Haunted Places: https://data.world/timothyrenner/haunted-places
  - Bigfoot Sightings: https://data.world/timothyrenner/bfro-sightings-data
  - UFO Sightings: https://data.world/timothyrenner/ufo-sightings

# File Structure
There are three folders in this repository which contain the files of primary importance. The Data Cleaning folder contains all jupyter notebooks and data source files used to gather the data sets for this project. The HTML-JS folder contains all code blocks pertaining to the interactive dashboard. The SQL folder contains all files pertaining to the SQL databases. A brief description of each is provided below. 

## Data Cleaning Folder
1. datacleaning.ipynb
	- This notebook contains all of the data cleaning. The original data files are read using ```pd.read_csv```. Unnecessary columns are dropped, null values are dropped, and data types are changed to be consistent throughout. The bigfoot data and ufo data came in multiple csv's, and were merged into one data set each. The cleaned data is then exported as csv and pkl files into the **resources** folder.
2. resources folder
   	- Within this folder are all of the cleaned data csv and pkl files. The **uncleaned data** subfolder contains all of the source files pulled directly from the data sites listed above. The **images** subfolder contains .png files of the visualizations made. 
3. data_stats.ipynb
	- This notebook contains the code to produce the visualizations in the **images** subfolder. 

## HTML-JS Folder
1. app.js
	- This JavaScript file contains all the code to create the interactive dashboard map. More details on getting this to run in the **run sequence** section below. 
2. thing.html
	- This html file structures the webpage and references the necessary scripts and js library. 

## SQL Folder
1. sql_connection.ipynb
	- This jupyter notebook contains code that transfers the cleaned data into an sqlite database. This was done using sqlAlchemy. 
2. api_connect.py
	- This script creates and deploys a Flask API. The app.js file pulls from this API to create the interactive map. 

# Run Sequence 

To deploy the dashboard, one must deploy the API. To deploy the API, one must have an sqlite database for the API to pull from. The following ordered list enumerates the sequence of files & actions that one needs to run/take in order for the dashboard to function. 

1. sql_connection.ipynb
2. api_connect.py
3. open thing.html