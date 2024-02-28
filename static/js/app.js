// Define global functin to hold the data
var data;

// Define a function to initialize the dashboard, 
// includes reading in the JSON file, populating the dropdown
// and creating the first plots.
function init() {
    // Select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    // Fetch the samples.json data from the URL
    const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';
    d3.json(url)
        .then((jsonData) => {
            data = jsonData;
            // Get the sample names from the data
            var sampleNames = data.names;
            // put the sample IDs into the dropdown
            sampleNames.forEach((sample) => {
                dropdownMenu.append("option")
                    .text(sample)
                    .property("value", sample);
            });
            // Use the first sample to build the initial plots
            let firstSample = sampleNames[0];
            buildCharts(firstSample);
            buildMetadata(firstSample);
        });  
    
    // Add event listener to detect dropdown change
    dropdownMenu.on("change", function() {
        // Get the new sample ID
        let newSample = dropdownMenu.property("value");
        // Call the update function
        optionChanged(newSample);
    });
   
}    

// Define a function to build the charts
function buildCharts(sample) {
    let samples = data.samples;
    let result = samples.find(sampleObj => sampleObj.id === sample);

    // Extract the necessary data for the charts
    let otuIds = result.otu_ids;
    let sampleValues = result.sample_values;
    let otuLabels = result.otu_labels;

    // Create the horizontal bar chart
    let barTrace = {
        x: sampleValues.slice(0, 10).reverse(),
        y: otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    };

    let barData = [barTrace];

    let barLayout = {
        title: "Top 10 OTUs Found",
        margin: { t: 30, l: 150 },
        width: 600,
        height: 400
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Create the bubble chart
    let bubbleTrace = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            color: otuIds,
            size: sampleValues,
            colorscale: 'Rainbow'
    }};
    let bubbleData = [bubbleTrace];

    let bubbleLayout = {
        title: 'OTU ID Bubble Chart',
        showlegend: false,
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Value" },
        width: 800, 
        height: 600
    };
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
}

// Define a function to display the metadata
function buildMetadata(sample) {
    let metadata = data.metadata;
    let result = metadata.find(sampleObj => sampleObj.id === parseInt(sample));

    // Select the demographic info panel and clear any existing metadata
    let panel = d3.select("#sample-metadata");
    panel.html("");

    // Use `Object.entries` to add each key-value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
};

// Define a function to update all plots when a new sample is selected.
function optionChanged(newSample){
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialise the dashboard
init();