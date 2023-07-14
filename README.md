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
   	- Within this folder are all of the cleaned data csv and pkl files. The **uncleaned data** folder within the **resources** folder contains all of the source files pulled directly from the data sites listed above.
  
## HTML-JS Folder
1. index.html
	- This file contains the HTML code for the interactive dashboard.
2. plots.js
   	- This file contains the Javascript code for the interactive dashboard.


