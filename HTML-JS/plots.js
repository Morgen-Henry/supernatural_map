// From another json file - if not pulling directly from SQL
let bigfoot = Object.values(data.bigfoot);
let ufo = Object.values(data.ufo);
let hauntings = Object.values(data.hauntings);
let weather = Object.values(data.weather);

// Display the default plot
function init() {
  // Plotly map
}

// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", getData);

// Function called by DOM changes
function getData() {
  let dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a letiable
  let dataset = dropdownMenu.property("value");
  // Initialize an empty array for the country's data
  let data = [];

  if (dataset == 'weather') {
      data = weather;
  }
  else if (dataset == 'mystery') {
      // want another condition to add to map?
  }

  // Call function to update the chart
  updatePlotly(data);
}

// Update the restyled plot's values
function updatePlotly(data) {
  // update plot
}

init();