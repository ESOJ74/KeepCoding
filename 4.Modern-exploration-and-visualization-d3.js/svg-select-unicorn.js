/*d3.select('#path34')
    .attr("opacity", 0.5);*/


d3.select('#path34')
    .on("mouseover", function(d) {
        d3.select(this).style("cursor", "pointer");

    })
    .on('click', () => {
        d3.select('#path34')
            .transition()
            .duration(3000)
            .attr('transform', 'rotate(130)')
            .transition()
            .duration(3000)
            .attr('transform', 'translate(0, -500)')
    });