var input = [
  {
    platform: "Blackberry",
    color: "green",
    value: 5,
  },
  {
    platform: "Windows",
    color: "gray",
    value: 10,
  },
  {
    platform: "Ios",
    color: "orange",
    value: 15,
  },
  {
    platform: "Android",
    color: "blue",
    value: 20,
  },
];

var height = 500;
var width = 500;

var svg = d3
  .select("div")
  .append("svg")
  .attr("width", width + 100)
  .attr("height", height + 100)
  .append("g")
  .attr("transform", "translate(50,50)");

var Ymax = d3.max(input, function (d) {
  return d.value;
});
var Ymin = d3.min(input, function (d) {
  return d.value;
});

var domainX = input.map(function (d) {
  return d.platform;
});

//console.log(d3.schemeTableau10);
//Creacion de escala de colores.
var scaleColor = d3.scaleOrdinal().domain(domainX).range(d3.schemeTableau10);

//Creacion de escalas
var scaleY = d3
  .scaleLinear()
  .domain([0, Ymax])
  .range([height / 2, 0]);

var scaleX = d3.scaleBand().domain(domainX).range([0, width]).padding(0.1);

//Creacion de ejes
var axisX = d3.axisBottom(scaleX);
var axisY = d3.axisLeft(scaleY);

//Añado ejes a mi lienzo svg
svg
  .append("g")
  .attr("transform", "translate(0," + height / 2 + ")")
  .call(axisX);

// svg.append("g").call(axisY);

//creo los rectangulos
var rect = svg
  .selectAll("rect")
  .data(input)
  .enter()
  .append("rect")
  .attr("x", function (d) {
    return scaleX(d.platform);
  })
  .attr("y", function (d) {
    return scaleY(0);
  })
  .attr("width", scaleX.bandwidth())
  .attr("height", 0)
  .attr("fill", function (d) {
    return scaleColor(d.platform);
  });

rect
  .transition()
  .duration(1000)
  .delay(function (d, i) {
    return i * 200;
  })
  .attr("height", function (d) {
    return height / 2 - scaleY(d.value);
  })
  .attr("y", function (d) {
    return scaleY(d.value);
  });
//Creo los textos
svg
  .append("g")
  .selectAll("text")
  .data(input)
  .enter()
  .append("text")
  .attr("x", function (d) {
    return scaleX(d.platform) + scaleX.bandwidth() / 2;
  })
  .attr("y", function (d) {
    return scaleY(d.value);
  })
  .text(function (d) {
    return d.value;
  });

//EJERCICIO PARA EL PROXIMO DIA: implementar una animacion segun la cual
//al cargar el navegador no haya rectagulos pintados sobre los ejes y a los 1000 ms estos
//rectangulos se pinten. Pista: Transicciones!!
