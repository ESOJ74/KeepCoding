var dataInput = [
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

//------ Manipulacion de datos---------
var f = d3.format(".1f"); //Para formatear.nos devuelve un string
//Calculo de la suma de d.value
var total = d3.sum(dataInput, function (d) {
  return d.value;
});

//Creacion de  de la variable percentage
dataInput.forEach((d) => {
  d.percentage = +f(100 * (d.value / total));
});
//console.log(input)
//-----------------------------
var width = 500;
var height = 500;
var ratio = d3.min([width, height]) / 2;
var outerR = 10;

var svg = d3
  .select("div")
  .append("svg")
  .attr("width", width + 50)
  .attr("height", height + 50)
  .append("g")
  .attr("transform", `translate(${ratio + outerR}, ${ratio + outerR})`);

// Ejemplo de como funciona el metodo pie(). Transforma datos de entrada en angulos.
/*var data = [2, 4, 8, 10];
var pie = d3.pie()
console.log(pie(data))*/

//d3.json("pie-data.json").then((dataInput) => {
console.log(dataInput);
var pie = d3.pie().value((d) => d.percentage);
var dataPie = pie(dataInput);
console.log(dataPie);

//Crea elementos graficos path con forma de arco.
var arc = d3.arc().innerRadius(35).outerRadius(ratio);

//Arc creado para gestionar la captura del evento
var arcmouse = d3
  .arc()
  .innerRadius(60)
  .padAngle(0.03)
  .outerRadius(ratio + outerR);

var pathPie = svg
  .selectAll("path")
  .data(dataPie)
  .enter()
  .append("path")
  .attr("d", arc);

// Crea una escala de 10 colores.
var scaleColor = d3.scaleOrdinal(d3.schemeTableau10); // schemeCategory10
console.log(scaleColor(1));

//Option 2 utilizando nuestro dominio y rango de colores
/*var scaleColor = d3.scaleOrdinal()
    .domain(dataInput.map(function(d) {
        return d.platform
    }))
    .range(d3.schemeTableau10);*/

pathPie
  .attr("fill", (d, i) => {
    return scaleColor(i);
  })
  .on("mouseover", function () {
    console.log(d3.select(this));
    d3.select(this).transition().duration(500).attr("d", arcmouse);
    //Alternativamente a lo anterior y para prescindir de arcmouse podria actualizar
    //el valor de outerRadius en arc asi: arc = arc.outerRadius(ratio + outerR) y luego
    //usar  .attr('d', arc):

    /* arc = arc.outerRadius(ratio + outerR)
         d3.select(this)
        .transition()
        .duration(500)
        .attr('d', arc)*/
  })
  .on("mouseout", function () {
    d3.select(this).transition().duration(0).attr("d", arc);
  });

var text = svg
  .selectAll("text")
  .data(dataPie)
  .enter()
  .append("text")
  .attr("x", (d) => {
    d.center = arc.centroid(d);
    console.log(d.center);
    return d.center[0];
  })
  .attr("y", (d) => {
    return d.center[1];
  })
  .text((d) => d.data.platform + ": " + d.data.percentage + " %");

//});
