function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
  }

function makeBasicChart(data) {

    // var xScale = new Plottable.Scales.Linear();
    var yScale = new Plottable.Scales.Linear();
    var xTScale = new Plottable.Scales.Time();

    // var xAxis = new Plottable.Axes.Numeric(xScale, "bottom");
    var yAxis = new Plottable.Axes.Numeric(yScale, "left");
    var xTAxis = new Plottable.Axes.Time(xTScale, "bottom")

    var plot = new Plottable.Plots.Line();
    // plot.x(function(d) { return d.x; }, xScale);
    plot.x(function(d) { return d.x; }, xTScale);
    plot.y(function(d) { return d.y; }, yScale);


    // var data2 = [
    //     { x: parseISOString("2018-09-09T15:58:59.768Z"), y: 1 },
    //     { x: parseISOString("2018-09-09T16:28:59.334Z"), y: 2 },
    //     { x: parseISOString("2018-09-09T16:29:59.364Z"), y: 4 },
    //     { x: parseISOString("2018-09-09T16:30:59.394Z"), y: 8 }        
    // ];

    var dataset = new Plottable.Dataset(data);
    plot.addDataset(dataset);

    // var dataset2 = new Plottable.Dataset(data2);
    // plot.addDataset(dataset2);

    var chart = new Plottable.Components.Table([
        [yAxis, plot],
        [null, xTAxis]
    ]);

    chart.renderTo("div#chart");

    return plot;
}

var myplot = null;

var data = [
    { x: parseISOString("2018-09-09T15:50:59.768Z"), y: 1 },
    { x: parseISOString("2018-09-09T16:20:59.334Z"), y: 2 },
    { x: parseISOString("2018-09-09T16:22:59.364Z"), y: 4 },
    { x: parseISOString("2018-09-09T16:32:59.394Z"), y: 8 }        
];


function fetchData() {
    DatahubClient.getMetrics2().then(function(data) {
	console.log(data)
    }).catch(function(err) {console.log(err)})
}


function updateData() {
    let n = data.length
    for(var i = 0; i < n-1; i++) {
        data[i] = data[i+1]
    }
    data[n-1] = { x: parseISOString("2018-09-09T16:42:59.394Z"), y: 12 }
    myplot.datasets()[0].data(data);
}

window.onload = function() {
    myplot = makeBasicChart(data);
    fetchData();
};
