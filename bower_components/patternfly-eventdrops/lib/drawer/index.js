import d3 from 'd3';
import { delimiters } from './delimiters';
import filterData from '../filterData';
import { metaballs } from '../metaballs';
import axesFactory from './axes';
import dropsFactory from './drops';
import labelsFactory from './labels';
import lineSeparatorFactory from './lineSeparator';
import markerFactory from './marker';

export default (svg, dimensions, scales, configuration) => {
    const defs = svg.append('defs');
    defs.append('clipPath')
        .attr('id', 'drops-container-clipper')
        .append('rect')
            .attr('id', 'drops-container-rect')
            .attr('x', configuration.margin.left)
            .attr('y', 0)
            .attr('width', dimensions.width)
            .attr('height', dimensions.outer_height);

    defs.append('pattern')
        .attr('id', 'gridStripes')
        .attr('width', dimensions.width)
        .attr('height', 80)
        .attr('patternUnits', 'userSpaceOnUse')
        .append('rect')
            .attr('width', dimensions.width)
            .attr('height', 40)
            .attr('fill', '#fafafa');

    const gridContainer = svg.append('g')
        .classed('grid', true)
        .attr('transform', `translate(${configuration.margin.left}, ${configuration.margin.top - (configuration.lineHeight - 5)})`);



    const labelsContainer = svg
        .append('g')
        .classed('labels', true)
        .attr('transform', 'translate(0, 45)');

    const axesContainer = svg.append('g')
        .classed('axes', true)
        .attr('transform', `translate(${configuration.margin.left}, 55)`);

    const dropsContainer = svg.append('g')
        .classed('drops-container', true)
        .attr('clip-path', 'url(#drops-container-clipper)')
        .style('filter', 'url(#metaballs)');

    const stampContainer = svg.append('g')
        .classed('timestamp', true)
        .attr('width', dimensions.width)
        .attr('height', 30)
        .attr('transform', `translate(${configuration.margin.left}, ${configuration.margin.top - 45})`);

    configuration.metaballs && metaballs(defs);

    const marker = markerFactory(gridContainer, stampContainer, scales, dimensions, configuration.dateFormat)
    const lineSeparator = lineSeparatorFactory(axesContainer, scales, configuration, dimensions);
    const axes = axesFactory(axesContainer, scales, configuration, dimensions);
    const labels = labelsFactory(labelsContainer, scales, configuration);
    const drops = dropsFactory(dropsContainer, scales, configuration);

    return data => {
        lineSeparator(data);
        drops(data);
        labels(data);
        axes(data);
    };
};
