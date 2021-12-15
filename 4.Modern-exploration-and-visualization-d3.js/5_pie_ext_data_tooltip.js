var width = 500;
var height = 500;
var ratio = d3.min([width, height]) / 2
var outerR = 10;

var svg = d3.select('div')
    .append('svg')
    .attr('width', width + 50)
    .attr('height', height + 50)
    .append("g")
    .attr('transform', `translate(${ratio+outerR}, ${ratio+outerR})`);


// Ejemplo de como funciona el metodo pie(). Transforma datos de entrada en angulos.
/*var data = [2, 4, 8, 10];
var pie = d3.pie()
console.log(pie(data))*/

d3.json("pie-data.json").then((dataInput) => {

    //------ Manipulacion de datos---------
    var f = d3.format(".1f"); //Para formatear.nos devuelve un string
    //Calculo de la suma de d.value
    var total = d3.sum(dataInput, function(d) {
        return d.value;
    });

    //Creacion de  de la variable percentage
    dataInput.forEach((d) => {
            d.percentage = +f(100 * (d.value / total))
        })
        //console.log(input)
        //-----------------------------
    console.log(dataInput)
    var pie = d3.pie().value(d => d.percentage);
    var dataPie = pie(dataInput);
    console.log(dataPie)


    var tooltip = d3.select("div")
        .append('div')
        .attr('class', 'tooltip')
        .style('visibility', 'hidden')
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px");


    //Crea elementos graficos path con forma de arco.
    var arc = d3.arc()
        .innerRadius(35)
        .outerRadius(ratio);

    //Arc created to handle the transition
    var arcmouse = d3.arc()
        .innerRadius(60)
        .padAngle(0.03)
        .outerRadius(ratio + outerR);


    var pathPie = svg
        .selectAll('path')
        .data(dataPie)
        .enter()
        .append('path')
        .attr('d', arc);

    // Crea una escala de 10 colores.
    var scaleColor = d3.scaleOrdinal(d3.schemeTableau10) // schemeCategory10
    console.log(scaleColor(1))

    pathPie.attr('fill', (d, i) => {
            return scaleColor(i);
        })
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('d', arcmouse)

            tooltip
                .style("left", (event.pageX + 20) + "px")
                .style("top", (event.pageY - 30) + "px")
                .style("visibility", "visible")
                .text(d.data.platform + ": " +
                    d.data.percentage + " %")
        })

    .on("mouseout", function() {
        d3.select(this).transition()
            .duration(0).attr('d', arc)

        tooltip.style("visibility", "hidden")

    });


    /*var text = svg.selectAll('text')
        .data(dataPie)
        .enter()
        .append('text')
        .attr('x', (d) => {
            d.center = arc.centroid(d);
            console.log(d.center)
            return d.center[0];
        })
        .attr('y', (d) => {
            return d.center[1];
        })
        .text(d => d.data.platform + ": " +
            d.data.percentage + " %")*/

});