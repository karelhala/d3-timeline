import d3 from 'd3';

export default (container, dimensions, scales, configuration, data, callback) => {
    const zoom = d3.behavior.zoom()
        .size([dimensions.width, dimensions.height])
        .scaleExtent([configuration.minScale, configuration.maxScale])
        .x(scales.x)
        .on('zoom', () => {
            requestAnimationFrame(() => callback(data));
        });

    if (configuration.eventZoom) {
        zoom.on('zoomend', configuration.eventZoom);
    }

    return container.call(zoom)
        .on("dblclick.zoom", null)
        .on('mousemove', () => {
            var m = d3.mouse(container[0][0]);
            var pt=[m[0]-210, m[1]];
            zoom.center(pt);
        });
};
