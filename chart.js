function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

function prep() {
  var xAxis = new Plottable.Axes.Time(xScale, "bottom");
  var yAxis = new Plottable.Axes.Numeric(yScale, "left");
  var yLabel = new Plottable.Components.AxisLabel("Metric", -90);

  var legend = new Plottable.Components.Legend(colorScale).maxEntriesPerRow(3);
  var table = new Plottable.Components.Table([
    [null, legend],
    [yAxis, plots],
    [null, xAxis]
  ]);

  table.renderTo("div#chart");
}

function makeDatasets(metrics) {
  var ds_array = []
  for(metric in metrics) {
    if(metrics.hasOwnProperty(metric)) {
        ds_array.push(new Plottable.Dataset(metrics[metric], {"name": metric}))
    }
    return ds_array
  }
} 

function updateDatasets(ds_array, metrics) {
  for(metric in metrics) {
    if(metrics.hasOwnProperty(metric)) {
      var ds = ds_array.find(function(el) {return el.metadata().name == metric})
      ds.data(metrics[metric])
    }
  }
  return ds_array
}

function plotDatasets(datasets) {
  datasets.forEach(function(ds) {
    plots.append(new Plottable.Plots.Line()
    .addDataset(new Plottable.Dataset(ds))
    .x(function(d) { return parseISOString(d.x); }, xScale)
    .y(function(d) { return d.y; }, yScale)
    .attr("stroke", colorScale.scale(ds.metadata().name))
    .attr("stroke-width", 1)
  )})
}

function updatePlot() {
  DatahubClient.getMetrics().then(function(data) {
    updateDatasets(datasets, data)
  }).catch(function(err) {console.log(err)})
}


var datasets = []
var xScale = new Plottable.Scales.Time();
var yScale = new Plottable.Scales.Linear();
var colorScale = new Plottable.Scales.Color();
var plots = new Plottable.Components.Group();


window.onload = function() {
  prep()
  DatahubClient.getMetrics().then(function(data) {
    datasets = makeDatasets(data);
    plotDatasets(datasets)
  }).catch(function(err) {console.log(err)})
};
