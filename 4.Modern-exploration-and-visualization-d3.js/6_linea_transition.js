//API Datos
var api = 'https://api.coindesk.com/v1/bpi/historical/close.json';

//Funcion para transformar datos de entrada en un diccionario de objetos de la forma:

/* [{"date":Fri Jun 12 2020,value:100},
    {"date":Fri Jun 13 2020,value:200},
      ...]*/

function parserData(data) {
    var bpi = data.bpi;
    var arr = [];
    for (let key in bpi) {
        arr.push({
            date: new Date(key),
            value: bpi[key],
        });
    }
    return arr;
}
//carga de datos de una API.
// d3.csv(url)
d3.json(api)
    .then((data) => {
        console.log(data)
        var parser = parserData(data);
        console.log(parser)
        drawChart(parser);
    })
    .catch((error) => {
        console.log('error', error);
    });

//Almaceno todo la creación de la gráfica en una función.
function drawChart(parser) {
    var width = 600;
    var height = 400;

    var svg = d3.select('div')
        .append('svg')
        .attr('width', width + 100)
        .attr('height', height + 100)
        .append('g')
        .attr('transform', 'translate(40, 20)');

    //Creamos el elemento Tooltip
    var tooltip = d3.select("div").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute") //Para obtener la posicion correcta sobre los circulos
        .style("pointer-events", "none") //Para evitar el flicker
        //.style("opacity", 0)
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px");

    //console.log(d3.extent(parser, (d) => d.value))
    var scaleY = d3.scaleLinear()
        .domain(d3.extent(parser, (d) => d.value)) //Usamos extent para obtener el max y el min de un array de datos
        .range([height, 0]);

    var scaleX = d3.scaleTime()
        .domain(d3.extent(parser, (d) => d.date))
        .range([0, width])

    var line = d3.line()
        .x(d => scaleX(d.date))
        .y(d => scaleY(d.value));

    var pathLine = svg.append('path');

    pathLine
        .attr('fill', 'none')
        .attr('stroke', '#9B5700')
        .attr('stroke-width', 2)
        .attr('d', line(parser));

    var axisX = d3.axisBottom(scaleX).ticks(5);
    var axisY = d3.axisLeft(scaleY).ticks(4);

    //Añadimos el eje Y
    svg.append('g')
        .attr('class', 'axisY')
        //.attr('transform', 'translate(40, 0)')
        .call(axisY)

    //Añadimos el eje X
    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(axisX);

    // Titulo  x axis
    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + 60) + ")")
        .style("text-anchor", "middle")
        .text("Date");

    // Titulo y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("dx", -35)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Precio (USD)");

    var circles = svg.selectAll('circle')
        .data(parser)
        .enter()
        .append('circle')
        .attr('cx', (d) => scaleX(d.date))
        .attr('cy', (d) => scaleY(d.value))
        .attr('r', 4)
        .attr('fill', "#633A06")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", update);



    // EJEMPLO de transicion en el eje. Tan solo actualizamos el eje. 
    // Para realizar esto adecuadamente habria que realizar una tran-
    // sicion a la linea y los puntos consecuentemente al cambio de escala/ejes.
    function update(event, d) {
        scaleY.domain([9000, 9200])
        d3.selectAll(".axisY").transition().duration(1000)
            .call(axisY);
    }

    function handleMouseOver(event, d) {
        d3.select(this)
            .transition()
            .duration(1000)
            .attr("fill", "#F9E254")
            .attr("r", 6)

        //Para formatear DateTimes
        var formatdate = d3.timeFormat("%B %d")

        tooltip.transition()
            .duration(200)
            .style("visibility", "visible")
            // .style("opacity", .9)
            .style("left", (event.pageX + 20) + "px")
            .style("top", (event.pageY - 30) + "px")
            .text(`${formatdate(d.date)}- Price: ${d.value} USD`)

    }

    function handleMouseOut(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", "#633A06")
            .attr("r", 3)


        tooltip.transition()
            .duration(200)
            .style("visibility", "hidden")

    }


};