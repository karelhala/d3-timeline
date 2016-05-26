$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
        'container': 'body',
        'placement': 'top',
        'delay': {"show": 500, "hide": 100}
    });
});



var data = [];
var start = new Date('2016-04-14T04:25:27.663Z');
var today = new Date('2016-05-02T13:59:06.818Z');
var one_hour = 60 * 60 * 1000;
var one_day = 24 * 60 * 60 * 1000;
var one_week = one_day * 7;
var one_month = one_day * 30;


for (var x in json) { //json lives in external file for testing
    data[x] = {};
    data[x].name = json[x].name;
    data[x].data = [];
    for (var y in json[x].data) {
        data[x].data.push(new Object());
        data[x].data[y].date = new Date(json[x].data[y].date);
        data[x].data[y].details = json[x].data[y].details;
    }
}


var timeline = d3.chart.eventDrops()
    .end(today)
    .start(today - one_week)
/*
    .minScale(0.05)
    .maxScale(1000)
*/
    .width(1200)
    .margin({
        top: 100,
        left: 200,
        bottom: 10,
        right: 50,
    })
    .hasTopAxis(false)
    .eventLineColor(function (data, index) {
        switch (index) {
        case 0:
            return "#0088ce";
        case 1:
            return "#00659c";
        case 2:
            return "#3f9c35";
        case 3:
            return "#ec7a08";
        case 4:
            return "#cc0000";
        case 5:
            return "#007a87";
        case 6:
            return "#3b0083";
        }
    })

    .eventColor(function (data, index) {
        if(data.details.event === "vmPowerOff") {
            return "#4B0082";
        }
    })

    .eventShape(function (data, index) {
        if(data.details.object === "vmName") {
            return '\uf05d';
        }
        return '\uf05c';
    })

    .eventZoom(function (data, index) {
        $('.btn').removeClass('active');
    })

    .eventClick(function (el) {
        $('#legend').html('Clicked on ' + el.details.object);
    })
    .eventTooltip(function (d) {

        return "Object name: " + d.details.object +
               "\nEvent type: " + d.details.event +
               "\nTime: " + d.date;
    })
    .hasBottomAxis(true);

var element = d3.select(chart_placeholder).append('div').datum(data);
timeline(element);

var addLine = function () {
    var data = element.datum();
    var i = data.length;
    data.push(createEvent(names[i]));
    element = element.datum(data);
    timeline(element);
};

var removeLine = function (name) {
    console.log('removed line' + name);
    var data = element.datum();
    data.pop();
    element = element.datum(data);
    timeline(element);
};

var changeZoom = function (time, button) {
  time = time || (today - start);
  timeline.start(today - time);
  timeline(element);
  $('[data-toggle="tooltip"]').tooltip({
        'container': 'body',
        'placement': 'top'
  });
/*
  $('.btn').removeClass('active');
  $(button).addClass('active');
*/
}

