import d3 from 'd3';

export default (gridContainer, dimensions) => {
    gridContainer.append('rect')
            .attr('width', dimensions.width)
            .attr('height', dimensions.height - 1)
            .on("mouseover", function() { marker.style("display", null); })
            .on("mouseout", function() { marker.style("display", "none"); })
            .on('mousemove', moveMarker);


    var marker = gridContainer.append('line')
            .classed('marker', true)
            .attr('y1', 0)
            .attr('y2', dimensions.height);

function moveMarker() {
    marker.attr('transform', `translate(${d3.mouse(gridContainer[0][0])[0]},0)`);
}

};


