function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h5").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
      let samples = data.samples;
      
    // 4. Create a variable that filters the samples for the object with the desired sample number.
      let filterSamples = samples.filter(obj => obj.id === sample);
      

    //  5. Create a variable that holds the first sample in the array.
      let filteredSamples = filterSamples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      let filteredOTUids = filteredSamples.otu_ids;
      let filteredOTUlables = filteredSamples.otu_labels;
      let filteredOTUvalues = filteredSamples.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    let resultotu_ids = filteredOTUids.map(element => 'OTU '+ element);
    let top10otu_ids= resultotu_ids.slice(0,10).reverse();
    let top10otu_lables = filteredOTUlables.slice(0,10).reverse();
    let top10otu_sample_values = filteredOTUvalues.slice(0,10).reverse();

    var yticks = top10otu_ids; 

    // 8. Create the trace for the bar chart. 
    var barData = [ {
      x: top10otu_sample_values,
      y:yticks,
      type: 'bar',
      orientation: 'h',
      text: top10otu_lables
    } 
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      font: { color: "black", family: "Arial",size: 16, align: 'center' },
      title: '<b>Top 10 Bacteria Cultures Found</b>',
      xaxis: {title:'OTU Sample Values'}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

    //Deliverable 2:
    // 1. Create the trace for the bubble chart.
    var bubbleData = [ {
       x: filteredOTUids,
       y: filteredOTUvalues,
       text: filteredOTUlables,
       mode: 'markers',
       marker: {
         size: filteredOTUvalues,
         color: filteredOTUvalues,
         colorscale: 'Rainbow',
         opacity: 0.5
       }
    }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      font: { color: "black", family: "Arial",size: 16, align: 'center' },
      title:'<b>Bacteria Cultures Per Sample</b>',
      xaxis: {title:'OTU ID'},
      margin: {
        l:100, r:100,t:100,b:100
      },
      hovermode:'closest'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble',bubbleData ,bubbleLayout);

      //Deliverable 3:
    let gmetadata = data.metadata;
    let gresultArray = gmetadata.filter(sampleObj => sampleObj.id == sample);
    let gresult = gresultArray[0];
    let waFreq = gresult.wfreq;

      // 4. Create the trace for the gauge chart.
    var gaugeData = [ {
          value : waFreq,
          title : {text: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week</br>'},
          type : 'indicator',
          mode : 'gauge+number',
          gauge : {
              bar : {color: 'black'},
              axis :{range: [null,10], tickwidth: 3, color:'black', dtick: 2},
              steps : [
                {range: [0,2], color: 'red'},
                {range: [2,4], color: 'orange'},
                {range: [4,6], color: 'yellow'},
                {range: [6,8], color: 'lightgreen'},
                {range: [8,10], color: 'green'}
                ],
              borderwidth: 2,
              threshold: {
                line: {color: 'black', width: 4},
                thickness: 0.75,
                value: waFreq
                }
              }
  
        }];

        // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
                font: {color:'black'},
                margin: {t:25, b:25, l:25, r:25}
              };

        // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
  };

