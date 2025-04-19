// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    let samples = data.samples;
    let metadata = data.metadata;
    // Create a variable that filters the samples for the object with the desired sample number.
    let filterSamples = samples.filter(obj => obj.id === sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    
    // Create a variable that holds the first sample in the array.
    let filteredSamples = filterSamples[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    let filteredOTUids = filteredSamples.otu_ids;
    let filteredOTUlables = filteredSamples.otu_labels;
    let filteredOTUvalues = filteredSamples.sample_values;

    // 3. Create a variable that holds the washing frequency.
    let waFreq = result.wfreq;
    // Create the yticks for the bar chart.
    //let yticks = 
    // Use Plotly to plot the bar data and layout.
    //Plotly.newPlot('bar', barData, barLayout);
    
    // Use Plotly to plot the bubble data and layout.
    //Plotly.newPlot('bubble',bubbleData, bubbleLayout);
   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [ {
      
      value: waFreq,
      title: {text: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week</br>'},
      type: 'indicator',
      mode: 'gauge+number',
      gauge: {
          domain: { x: [0, 1], y: [0, 1] },
          bar: {color: 'black'},
          axis:{range: [null,10], tickwidth: 3, color:'black', dtick: 2},
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
      margin: {
        t:25, b:25, l:25, r:25
        }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
