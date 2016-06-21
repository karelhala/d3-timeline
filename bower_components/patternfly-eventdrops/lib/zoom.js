import d3 from 'd3';

export default (container, dimensions, scales, configuration, data, callback) => {
    const zoomButtons = d3.selectAll('.zoombutton')
        .on('click', zoomClick);

    const slider = d3.selectAll('#slider')
        .attr("value", 1)
        .attr("min", .05)
        .attr("max", 100)
        .attr("step", .5)
        .on("input", slided);

    const zoom = d3.behavior.zoom()
        .size([dimensions.width, dimensions.height])
        .scaleExtent([configuration.minScale, configuration.maxScale])
        .x(scales.x)
        .on('zoom', () => {
            requestAnimationFrame(() => callback(data));
            slider.property('value', zoom.scale());
        });

    if (configuration.eventZoom) {
        zoom.on('zoomend', configuration.eventZoom);
    }

    if (configuration.brushZoom) {
        return container.call(zoom)
        .on("dblclick.zoom", null)
        .on('mousemove', () => {
            var m = d3.mouse(container[0][0]);
            var pt=[m[0]-205, m[1]];
            zoom.center(pt);
        })
        .on("mousedown.zoom", null);
    } else {
        return container.call(zoom)
            .on("dblclick.zoom", null)
            .on('mousemove', () => {
                var m = d3.mouse(container[0][0]);
                var pt=[m[0]-205, m[1]];
                zoom.center(pt);
            });
    }

    function slided(d){
        var center = [dimensions.width / 2, dimensions.height / 2],
        extent = zoom.scaleExtent(),
        translate = zoom.translate(),
        translate0 = [],
        l = [],
        view = {x: translate[0], y: translate[1], k: zoom.scale()};

        d3.event.preventDefault();

        translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
//         view.k = d3.select(this).property("value");
        l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

        view.x += center[0] - l[0];
        view.y += center[1] - l[1];
        console.log(view.x + ' ' + view.y + ' ' + view.k);
        interpolateZoom([view.x, view.y], view.k);
    }


    function interpolateZoom(translate, scale) {
        var self = this;
        return d3.transition().duration(75).tween("zoom", function () {
            var iTranslate = d3.interpolate(zoom.translate(), translate),
                iScale = d3.interpolate(zoom.scale(), scale);
            return function (t) {
                zoom
                    .scale(iScale(t))
                    .translate(iTranslate(t));
                zoom.event(container);
            };
        });
    }

    function zoomClick(factor = 0.5) {
        var clicked = d3.event.target,
            direction = 1,
            target_zoom = 1,
            center = [dimensions.width / 2, dimensions.height / 2],
            extent = zoom.scaleExtent(),
            translate = zoom.translate(),
            translate0 = [],
            l = [],
            view = {x: translate[0], y: translate[1], k: zoom.scale()};

        d3.event.preventDefault();
        direction = (this.id === 'zoom_in') ? 1 : -1;
        target_zoom = zoom.scale() * (1 + factor * direction);

        if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

        translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
        view.k = target_zoom;
        l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

        view.x += center[0] - l[0];
        view.y += center[1] - l[1];
        console.log(view.x + ' ' + view.y + ' ' + view.k);
//         d3.select('#slider').property("value", view.k);
        interpolateZoom([view.x, view.y], view.k);
    }
};
