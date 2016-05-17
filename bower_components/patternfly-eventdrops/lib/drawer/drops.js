export default (svg, scales, configuration) => function dropsSelector(data) {
    const dropLines = svg.selectAll('.drop-line').data(data);

    dropLines.enter()
        .append('g')
        .classed('drop-line', true)
        .attr('transform', (d, idx) => `translate(10, ${40 + configuration.lineHeight + scales.y(idx)})`)
        .attr('fill', configuration.eventLineColor);

    dropLines.each(function dropLineDraw(drop) {
        const drops = d3.select(this).selectAll('.drop').data(drop.data);

        drops.attr("transform", function (d) { return "translate(" + (scales.x(d.date) + 200) + "," + 3 + ")"; });

        const shape = drops.enter()
            .append('text')
            .classed('drop', true)
            .attr("transform", function (d) {return "translate(" + (scales.x(d.date) + 200) + "," + 3 + ")"; })
            .attr('fill', configuration.eventColor)
            .attr('data-toggle', 'tooltip')
            .attr('title', configuration.eventTooltip)
            .text(configuration.eventShape);

/*
            .append('path')
            .classed('drop', true)
            .attr("transform", function (d) {return "translate(" + (scales.x(d.date) + 200) + "," + -5 + ")"; })
            .attr('fill', configuration.eventColor)
            .attr('data-toggle', 'tooltip')
            .attr('title', configuration.eventTooltip)
            .attr('d', d3.svg.symbol()
                      .type(configuration.eventShape)
                      .size(150)
            );
*/


        if (configuration.eventClick) {
            shape.on('click', configuration.eventClick);
        }

        if (configuration.eventHover) {
            shape.on('mouseover', configuration.eventHover);
        }

        // unregister previous event handlers to prevent from memory leaks
        drops.exit()
            .on('click', null)
            .on('mouseover', null);

        drops.exit().remove();
    });

    dropLines.exit().remove();
};


