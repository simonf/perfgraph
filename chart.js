
function makeLabel(string) {
    return new Plottable.Components.Label(string, 0)
    .addClass("selected")
    .xAlignment("left");
  }

function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
  }

function makeDatasets(metrics) {
    var colourList = [
        '#3366CC',
        '#DC3912',
        '#FF9900',
        '#109618',
        '#990099',
        '#3B3EAC',
        '#0099C6',
        '#DD4477',
        '#66AA00',
        '#B82E2E',
        '#316395',
        '#994499',
        '#22AA99',
        '#AAAA11',
        '#6633CC',
        '#E67300',
        '#8B0707',
        '#329262',
        '#5574A6',
        '#3B3EAC',
    ]
    
    var ds_map = {}
    var color_ndx = 0;
    for(metric in metrics) {
        if(metrics.hasOwnProperty(metric)) {
            ds_map[metric] = {
                dataset: new Plottable.Dataset(metrics[metric], {"color": colourList[color_ndx++]}),
                include: true
            }
        }
    }
    return ds_map
}

function updateDatasets(ds_map, metrics) {
    for(metric in metrics) {
        if(metrics.hasOwnProperty(metric)) {
            ds_map[metric].dataset.data(metrics[metric])
        }
    }
}

function showChart(data) {
    var yScale = new Plottable.Scales.Linear();
    var xTScale = new Plottable.Scales.Time();
    
    var yAxis = new Plottable.Axes.Numeric(yScale, "left");
    var xTAxis = new Plottable.Axes.Time(xTScale, "bottom")

    var plot = new Plottable.Plots.Line();
    plot.x(function(d) { return parseISOString(d.x); }, xTScale);
    plot.y(function(d) { return d.y; }, yScale);
    plot.attr("stroke", function(d, i, ds) { return ds.metadata().color; });

    var ds_map = makeDatasets(data)

    var labArray = []
    for (objname in ds_map) {
        if(ds_map.hasOwnProperty(objname)) {
            labArray.push([makeLabel(objname)]);
            if(ds_map[objname].include) 
                plot.addDataset(ds_map[objname].dataset)
        }
    }
    var labels = new Plottable.Components.Table(labArray);
    var chart = new Plottable.Components.Table([
        // [null, labels],
        [yAxis, plot],
        [null, xTAxis]
    ]);

    chart.renderTo("div#chart");

    return ds_map;
}

function loadAndPlot() {
    DatahubClient.getMetrics2().then(function(data) {
        dataset_map = showChart(data);
    }).catch(function(err) {console.log(err)})
}

function updatePlot() {
    DatahubClient.getMetrics2().then(function(data) {
        updateDatasets(dataset_map,data);
    }).catch(function(err) {console.log(err)})
}

var dataset_map = {}

window.onload = function() {
    loadAndPlot()
    // setInterval(loadAndPlot, 30000);
};
