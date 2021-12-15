/*Aqui introduzco como hacer una grafica responsive a los 
cambios de tamaño en el navegador.
 Podeis leer una introduccion al tema aquí: 
 https://chartio.com/resources/tutorials/how-to-resize-an-svg-when-the-window-is-resized-in-d3-js/
*/

var height = 500;
var width = 800;
var marginbottom = 100;
var margintop = 50;
var marginright = 100;

var svg = d3
  .select("div")
  .attr("class", "svg-container")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr(
    "viewBox",
    `0 0 ${width + marginright} ${height + marginbottom + margintop}`
  )
  .attr("class", " svg-content")
  //.attr('width', width)
  //.attr('height', height + marginbottom + margintop)
  .append("g")
  .attr("transform", "translate(" + marginright + "," + margintop + ")");

var tooltip = d3
  .select("div")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute") //Para obtener la posicion correcta sobre los circulos
  .style("pointer-events", "none") //Para evitar el flicker
  //.style("opacity", 0)
  .style("visibility", "hidden")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px");

//Si quisiesemos añadir un svg con algo dentro
/*tooltip  
    .append("svg")
    .attr("width", 200)
    .attr("height", 200);*/

d3.json("heatmap-data.json").then((input) => {
  //añado el indice como variable en cada objeto.
  input.forEach((d, i) => {
    d.idx = i;
  });

  //Creacion de escalas
  var xscale = d3
    .scaleBand()
    .domain(
      input.map(function (d) {
        return d.platform;
      })
    )
    .range([0, width - 200])
    .padding(0.1);

  var yscale = d3
    .scaleBand()
    .domain(
      input.map(function (d) {
        return d.department;
      })
    )
    .range([height / 1.5, 0])
    .padding(0.1);

  //Creación de eje X
  var xaxis = d3.axisBottom(xscale);
  //Creación eje Y.
  var yaxis = d3.axisLeft(yscale);

  var domainColor = d3.extent(input, function (d) {
    return d.value;
  });

  var scaleColor = d3
    .scaleSequential()
    .domain(domainColor)
    .range(["#fcd8b1", "#f28a18"]);

  var mousemargin = 10;
  //Creacion de los rectangulos
  var rect = svg
    .selectAll("rect")
    .data(input)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return xscale(d.platform);
    })
    .attr("y", (d) => {
      return yscale(d.department);
    })
    .attr("width", xscale.bandwidth())
    .attr("height", yscale.bandwidth())
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("fill", (d) => scaleColor(d.value));

  rect.on("mouseover", handleMouseOver).on("mouseout", handleMouseOut);

  function handleMouseOver(event, d) {
    //Cambio opacidad y color de todos los rectangulos
    d3.selectAll("rect")
      .transition()
      .delay(function (d, i) {
        return i * 20;
      })
      .duration(1000)
      .attr("opacity", 0.2)
      .attr("fill", "blue");

    //Selecciono el rectangulo actual y lo "resalto"
    d3.select(this)
      .transition()
      .duration(1000)
      .attr("x", function (d) {
        return xscale(d.platform) - 5;
      })
      .attr("y", function (d) {
        return yscale(d.department) - 5;
      })
      .attr("width", xscale.bandwidth() + mousemargin)
      .attr("height", yscale.bandwidth() + mousemargin)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", scaleColor(d.value))
      .attr("opacity", 1);

    /*d3.select("#text-" + d.idx)
            .transition()
            .duration(1000)
            .attr("opacity", 1);*/

    /*tooltip*/
    tooltip
      .style("visibility", "visible")
      .style("left", event.pageX + 20 + "px")
      .style("top", event.pageY - 30 + "px")
      .html("<b>Usuarios:</b> " + d.value + "");
  }

  function handleMouseOut(event, d) {
    d3.selectAll("rect")
      .transition()
      .duration(1000)
      .attr("opacity", 1)
      .attr("fill", function (d) {
        return scaleColor(d.value);
      });
    //Cambio al color original.

    d3.select(this)
      .transition("t2")
      .duration(1000)
      .attr("x", function (d) {
        return xscale(d.platform);
      })
      .attr("y", function (d) {
        return yscale(d.department);
      })
      .attr("width", xscale.bandwidth())
      .attr("height", yscale.bandwidth())
      .attr("rx", 5)
      .attr("ry", 5);

    /* d3.select("#text-" + d.idx)
             .transition()
             .duration(1000)
             .attr("opacity", 0)*/

    tooltip.style("visibility", "hidden");
  }

  //Texto centrado en los rectangulos.
  /*var text = svg
        .selectAll('text')
        .data(input)
        .enter()
        .append('text')
        .attr("id", function(d, i) { return "text-" + i })
        .attr("x", function(d) {
            return xscale(d.platform) + xscale.bandwidth() / 2;
        })
        .attr('y', d => {
            return yscale(d.department) + yscale.bandwidth() / 2;
        })
        .text(function(d) { return d.value })
        .attr("opacity", 0)*/

  //Añadimos el eje X
  svg
    .append("g")
    .attr("transform", "translate(0," + height / 1.5 + ")")
    .call(xaxis);

  //Añadimos el eje Y
  svg.append("g").call(yaxis);

  //Cambiamos la visibilidad de la linea de los ejes.
  d3.selectAll("path").style("visibility", "hidden");
});
