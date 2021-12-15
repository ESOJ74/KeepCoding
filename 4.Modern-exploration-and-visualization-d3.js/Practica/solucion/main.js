//  Con windows.innerWidth obtenemos el ancho interior del area de contenido de la ventana.
var windowWidth = window.innerWidth;
// Con window.innerHeight obtenemos el alto interior del area de contenido de la ventana.
var windowHeight = window.innerHeight;

d3.json("../practica_airbnb.json").then((madrid) => {
  drawMap(madrid);
});

var pathMadrid;

function drawMap(featureCollection) {
  var width = windowWidth / 2;

  // Definimos los bordes
  var borderTop = 20;
  var borderLeft = 20;
  var borderBottom = 20;
  var borderRight = 20;
  var f = d3.format(",.0f");

  // 1. Analizamos los Datos Geo JSON.
  var features = featureCollection.features;
  var barrio = featureCollection.features[0];
  console.log(barrio);
  console.log(
    barrio.properties.avgbedrooms.map(function (d) {
      return d.bedrooms;
    })
  );

  console.log(features);
  // Calculamos el  precio máximo
  var priceMax = d3.max(features, (d) => d.properties.avgprice);

  // Creamos nuestro svg
  var svg = d3
    .select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", windowHeight);

  // 2. Proyeccion.
  // En esta proyección para usarla de forma genérica y no tener que buscar
  // una  coordenada céntrica  en la  que centrar el mapa, voy a usar el centro de
  // la colección y para ello uso el método geoCentroid, podríamos pasar las coordenadas de
  // un barrio en particular como vimos en clase.
  var center = d3.geoCentroid(featureCollection);

  // Con fitsize, le  pasamos el array con el ancho y el alto que  va a usar
  // y la colección y ajustará el tamaño a nuestro mapa. Alternativamente podríamos usar el scale/center/translate como vimos en clase.
  var projection = d3
    .geoMercator()
    .fitSize(
      [
        width - borderLeft - borderRight,
        windowHeight - borderTop - borderBottom,
      ],
      featureCollection
    );
  //.center(center)
  //.translate([(width / 2) + borderLeft, (windowHeight / 2) + borderTop]);

  // 3. Con la proyección ya puedo generar mi path
  var pathFeature = d3.geoPath().projection(projection);

  //Creamos el elemento div donde irá el tooltip
  //con la información al posicionarnos sobre un barrio
  var tooltip = d3.select("#map").append("div").attr("class", "tooltip"); //estilos del tooltip definidos en el main.css

  var numberOfCategories = 6; //elijo 6 rangos de precios = 6 leyendas
  var colourPalette = d3.schemeTableau10.slice(0, numberOfCategories); //Creo un array con tantos colores
  // como numberOfCategories tenga.

  var scaleColorMap = d3
    .scaleQuantize()
    .domain([0, d3.max(features, (d) => d.properties.avgprice)])
    .range(colourPalette);

  // Por cada una de las feature  creo un path
  pathMadrid = svg
    .append("g")
    .selectAll("path")
    .data(features)
    .enter()
    .append("path")
    .attr("d", pathFeature) //o (d)=> pathFeature(d)
    // Relleno el color de mi path en la función fillColor
    .attr("fill", fillColor);

  pathMadrid.on("mouseover", handleMouseOver).on("mouseout", handleMouseOut);

  //Creacion de una leyenda
  var widthRect = width / numberOfCategories - 2;
  var heightRect = 10;
  var marginLeftLeg = 5;
  var scaleLegend = d3
    .scaleLinear()
    .domain([0, numberOfCategories])
    .range([marginLeftLeg, width]);

  //console.log(d3.schemeTableau10)
  var legend = svg
    .append("g")
    .selectAll("rect")
    .data(colourPalette)
    .enter()
    .append("rect")
    .attr("width", widthRect)
    .attr("height", heightRect)
    .attr("x", (d, i) => scaleLegend(i)) // o (i * (widthRect + 2)) //No haria falta scaleLegend
    .attr("fill", (d) => d);

  var text_legend = svg
    .append("g")
    .selectAll("text")
    .data(colourPalette)
    .enter()
    .append("text")
    .attr("x", (d, i) => scaleLegend(i) - marginLeftLeg) // o (i * (widthRect + 2))
    .attr("y", heightRect * 2.5)
    .text((d, i) => "Desde " + f(priceMax * (i / numberOfCategories)) + " Eur.")
    .attr("font-size", 12);

  //Funciones
  function fillColor(d) {
    var price = d.properties.avgprice || 0; //Si no tengo ningun valor en la variable avgprice, asigno un 0
    return scaleColorMap(price);
  }

  function handleMouseOver(event, d) {
    var name = d.properties.name;
    var price = d.properties.avgprice || 0; //Si el barrio no tiene ninguna habitación asignamos un O al precio

    tooltip
      .transition()
      .duration(200)
      .style("visibility", "visible")
      .style("opacity", 0.9)
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 30 + "px")
      .text(` ${name} : ${price} Eur`);
  }

  function handleMouseOut() {
    tooltip.style("visibility", "hidden");
  }
  //Inicializo la gráfica de la derecha con los datos del primer barrio en el diccionario de objetos;

  drawChartBedrooms(features[0].properties.avgbedrooms);
}

function drawChartBedrooms(avgbedrooms) {
  var marginLeft = 30;
  var marginTop = 70;
  var width = windowWidth / 2;
  var height = windowHeight - marginTop;

  var svg = d3
    .select("#chartBedrooms")
    .append("svg")
    .attr("width", width)
    .attr("height", height + marginTop);

  var scaleX = d3
    .scaleBand()
    // ya lo usamos en redraw para no repetir
    // .domain(avgbedrooms.map(d => d.bedrooms))
    .range([marginLeft, width])
    .padding(0.1);

  var scaleY = d3
    .scaleLinear()
    // ya lo usamos en redraw para no repetir
    // .domain([0, d3.max(avgbedrooms, d => d.total)]).nice()
    .range([height, marginTop]);

  var scaleColorBar = d3.scaleOrdinal(d3.schemePaired);

  var xAxis = d3.axisBottom(scaleX).tickSizeOuter(0);
  var yAxis = d3.axisLeft(scaleY);

  pathMadrid.on("click", (event, d) => redraw(d.properties.avgbedrooms));

  //Para inicializar la gráfica
  redraw(avgbedrooms);

  //Añado los ejes
  svg
    .append("g")
    .attr("class", "axisX")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "axisY")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .call(yAxis);

  // Titulo  x axis
  svg
    .append("text")
    .attr("transform", "translate(" + width / 2 + " ," + (height + 30) + ")")
    .style("text-anchor", "middle")
    .text("Número de habitaciones");

  // Titulo y axis
  svg
    .append("text")
    .attr("y", 20)
    .attr("x", marginLeft)
    .attr("dy", "1em")
    .text("Numero de propiedades");

  function redraw(avgbedrooms) {
    var speed = 1000;

    //Fijamos los dominios de cada escala
    scaleX.domain(avgbedrooms.map((d) => d.bedrooms));
    scaleY.domain([0, d3.max(avgbedrooms, (d) => d.total)]).nice();

    //Con remove() eliminamos las barras y textos del anterior barrio
    svg.selectAll("rect").remove();
    svg.selectAll(".recttext").remove(); //Elimino el texto asociado a los rectangulos

    //Actualizo los ejes
    svg.selectAll(".axisX").transition().duration(speed).call(xAxis);

    svg.selectAll(".axisY").transition().duration(speed).call(yAxis);

    //Añado las barras
    var rect = svg
      .append("g")
      .selectAll("rect")
      .data(avgbedrooms)
      .enter()
      .append("rect")
      .attr("x", (d) => scaleX(d.bedrooms))
      // se pone en height para que la animación vaya de abajo hacia arriba,
      // si lo eliminamos iría en el curso normal de pintado, que también estaría correcto,
      // pero para ver como podemos jugar con cambios en las transiciones solo con un estado inical.
      .attr("y", height)
      .attr("width", scaleX.bandwidth())
      .attr("fill", (d) => scaleColorBar(d.bedrooms));

    rect
      .transition()
      .duration(speed)
      .ease(d3.easeLinear)
      .attr("y", (d) => scaleY(d.total))
      .attr("height", (d) => scaleY(0) - scaleY(d.total));

    //Añado los textos asociados a las barras
    var text = svg
      .append("g")
      .selectAll("text")
      .data(avgbedrooms)
      .enter()
      .append("text")
      .attr("class", "recttext")
      .text((d) => d.total)
      .attr("x", function (d) {
        var textLength = this.getComputedTextLength(); //Para ajustar un poco mejor los textos en el centro de cada barra
        return scaleX(d.bedrooms) + scaleX.bandwidth() / 2 - textLength / 2;
      })
      // se pone en height para que la animación vaya de abajo hacia arriba como la anterior
      .attr("y", height)
      .attr("fill", "black");

    text
      .transition()
      .duration(speed)
      .ease(d3.easeLinear)
      .attr("y", (d) => {
        var borderTop = 15;
        var y = scaleY(d.total) + borderTop;
        return y > height ? height : y;
      });
  }
}
