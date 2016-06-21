import d3 from 'd3';

const config = {
    lineHeight: 45,
    start: new Date(0),
    end: new Date(),
    minScale: 0,
    maxScale: Infinity,
    width: 1200,
    margin: {
        top: 100,
        left: 190,
        bottom: 10,
        right: 50,
    },
    locale: null,
    axisFormat: null,
    tickFormat: [
        ['.%L', (d) => d.getMilliseconds()],
        [':%S', (d) => d.getSeconds()],
        ['%I:%M', (d) => d.getMinutes()],
        ['%I %p', (d) => d.getHours()],
        ['%a %d', (d) => d.getDay() && d.getDate() !== 1],
        ['%b %d', (d) => d.getDate() !== 1],
        ['%B', (d) => d.getMonth()],
        ['%Y', () => true],
    ],
    eventHover: null,
    eventZoom: null,
    eventClick: null,
    hasDelimiter: true,
    hasTopAxis: false,
    hasBottomAxis: true,
    eventLineColor: 'black',
    eventColor: null,
    eventShape: '\uf111',
    eventTooltip: null,
    metaballs: false,
    zoomable: true,
    marker: true,
    brushZoom: true
};

config.dateFormat = config.locale ? config.locale.timeFormat('%x %I:%M %p') : d3.time.format('%x %I:%M %p');

module.exports = config;
