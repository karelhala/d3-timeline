import d3 from 'd3';

import configurable from 'configurable.js';
import defaultConfig from './config';
import drawer from './drawer';
import zoom from './zoom';

function eventDrops(config = {}) {
    const finalConfiguration = {...defaultConfig, ...config};

    const yScale = (data) => {
        const scale = d3.scale.ordinal();

        return scale
            .domain(data.map((d) => d.name))
            .range(data.map((d, i) => i * 40));
    };

    const xScale = (width, timeBounds) => {
        return d3.time.scale()
            .range([0, width])
            .domain(timeBounds);
    };

    function eventDropGraph(selection) {
        selection.each(function selector(data) {
            d3.select(this).select('.event-drops-chart').remove();

            const height = data.length * 40;
            const dimensions = {
                width: finalConfiguration.width - finalConfiguration.margin.right - finalConfiguration.margin.left,
                height,
                outer_height: height + finalConfiguration.margin.top + finalConfiguration.margin.bottom,
            };

            const scales = {
                x: xScale(dimensions.width, [finalConfiguration.start, new Date(finalConfiguration.end.getTime() + (3600000 * 7))]),
                y: yScale(data),
            };

            const svg = d3.select(this).append('svg')
                .classed('event-drops-chart', true)
                .attr({
                    width: finalConfiguration.width,
                    height: dimensions.outer_height,
                });
            const draw = drawer(svg, dimensions, scales, finalConfiguration).bind(selection);
            draw(data);

            if (finalConfiguration.zoomable) {
                zoom(d3.select(this), dimensions, scales, finalConfiguration, data, draw);
            }
        });
    }

    configurable(eventDropGraph, finalConfiguration);

    return eventDropGraph;
}

d3.chart = d3.chart || {};
d3.chart.eventDrops = eventDrops;

module.exports = eventDrops;
