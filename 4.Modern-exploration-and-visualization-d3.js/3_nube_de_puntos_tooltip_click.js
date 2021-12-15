var data = [{
            area: 800, //area en square feets
            precio: 350 //K USD
        },
        {
            area: 900,
            precio: 450
        },
        {
            area: 850,
            precio: 450
        },
        {
            area: 1250,
            precio: 700
        },
        {
            area: 1100,
            precio: 650
        },
        {
            area: 1350,
            precio: 850
        },
        {
            area: 1200,
            precio: 900
        },
        {
            area: 1410,
            precio: 1250
        },
        {
            area: 1250,
            precio: 1100
        },
        {
            area: 1400,
            precio: 1150
        },
        {
            area: 1500,
            precio: 1050
        },
        {
            area: 1330,
            precio: 1120
        },
        {
            area: 1580,
            precio: 1220
        },
        {
            area: 1620,
            precio: 1400
        },
        {
            area: 1250,
            precio: 1450
        },
        {
            area: 1350,
            precio: 1600
        },
        {
            area: 1650,
            precio: 1300
        },
        {
            area: 1700,
            precio: 1620
        },
        {
            area: 1750,
            precio: 1700
        },
        {
            area: 1830,
            precio: 1800
        },
        {
            area: 1900,
            precio: 2000
        },
        {
            area: 2050,
            precio: 2200
        },
        {
            area: 2150,
            precio: 1960
        },
        {
            area: 2250,
            precio: 1990
        }
    ]
    //Formateando USD a Eur y sqt a m2
var f = d3.format(".1f");
data.forEach((d) => {
    d.area = +f(d.area * 0.092903)
    d.precio = +f(d.precio * 0.87)
})
console.log(data)
var ratio = 5;
var width = 650;
var height = 600;


var svg = d3.select('div')
    .append('svg')
    .attr('width', width + 200)
    .attr('height', height + 80)
    .append("g")
    .attr("transform", "translate(" + 50 + ", " + 50 + ")");

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

var xmax = d3.max(data, (d) => d.area);
var xmin = d3.min(data, (d) => d.area);
var ymax = d3.max(data, (d) => d.precio);
var ymin = d3.min(data, (d) => d.precio);

var scaleX = d3.scaleLinear()
    .domain([xmin, xmax])
    .range([0, width]);

var scaleY = d3.scaleLinear()
    .domain([ymin, ymax])
    .range([height / 2, 0]);

var x_axis = d3.axisBottom(scaleX)
var y_axis = d3.axisLeft(scaleY)


var circle =
    svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => scaleX(d.area))
    .attr('cy', (d) => scaleY(d.precio))
    .attr('r', ratio)
    .attr("fill", function(d, i) {
        if (d.precio > 1200) {
            return "#FF5F48"
        } else {
            return "#84F141"
        }

    })
    .on("click", handleClick)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

var line = svg.append("line")
    .attr("x1", scaleX(xmin))
    .attr("x2", scaleX(xmax))
    .attr("y1", scaleY(1200))
    .attr("y2", scaleY(1200))
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", 5)

/*var text = svg.selectAll("text")
    .data(data)
    .enter()
    .append('text')
    .attr("id", (d, i) => "text" + i)
    .attr('x', d => scaleX(d.area) + 10)
    .attr('y', d => scaleY(d.precio))
    .text(d => `[${d.area}m2, ${d.precio}k Eur]`)
    .attr("font-size", 15)
    .style("opacity", 0);*/

//Función para gestionar eventos de Mouse Over un elemento sobre un elemento.
function handleMouseOver(event, d) {
    d3.select(this)
        .transition("transOver")
        .duration(1000)
        .attr("fill", "#FFF273")
        .attr("r", ratio * 2)

    /*console.log(("#text" + d.idx))
    d3.select(("#text" + d.idx)).style(
        "opacity", 1);
    console.log(d);*/

    tooltip.transition()
        .duration(200)
        .style("visibility", "visible")
        // .style("opacity", .9)
        .style("left", (event.pageX + 20) + "px")
        .style("top", (event.pageY - 30) + "px")
        .text(`Area: ${d.area}m2, Price: ${d.precio}k Eur`)

}

//Función para gestionar eventos de Mouse Out un elemento sobre un elemento.
function handleMouseOut() {
    d3.select(this)
        .transition("transOver") //Para aplicar  diferentes transicciones 
        //al mismo elemento debemos asignar un nombre distinto a cada transiccion. Así seran excluyentes.
        .duration(200)
        .attr("fill", function(d, i) {
            if (d.precio > 1200) {
                return "#FF5F48"
            } else {
                return "#84F141"
            }

        })
        .attr("r", ratio)

    /* console.log(("#text" + d.idx))
     d3.select(("#text" + d.idx)).style(
         "opacity", 0);
     console.log(d);*/

    tooltip.transition()
        .duration(200)
        .style("visibility", "hidden")
        // .style("opacity", .9)

}

//Función para gestionar eventos de Click sobre un elemento.
function handleClick(event, d) {
    d.aux_cx = (d.aux_cx == scaleX(xmax)) ? scaleX(d.area) : scaleX(xmax); //if else statement
    d.aux_r = (d.aux_r == ratio * 2) ? ratio : ratio * 2; //if else statement

    d3.select(this)
        .transition("transClick") //Para aplicar  diferentes transicciones 
        //al mismo elemento debemos asignar un nombre distinto a cada transiccion. Así seran excluyentes unas de otras.
        .ease(d3.easeBounce)
        .duration(1000)
        // .delay(1200)
        .attr("cx", d.aux_cx)
        .transition("transClick").duration(1000)
        .attr("r", d.aux_r)

}

//Añadimos eje X
svg.append("g")
    .attr("transform", "translate(0, " + height / 2 + ")")
    .call(x_axis)
    /* .selectAll("text")
     .attr("transform", "translate(-10,10)rotate(-45)")
     .style("text-anchor", "end")
     .style("font-size", 20)
     .style("fill", "green")*/
;

//Añadimos eje Y
svg.append("g")
    .attr("transform", "translate(0, 0)")
    .call(y_axis)

// Titulo  x axis
svg.append("text")
    .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height / 2 + 60) + ")")
    .style("text-anchor", "middle")
    .text("Area (m2)");

// Titulo y axis
svg.append("text")
    //.attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 50)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Precio (Eur)");