var input = [{
        platform: 'Blackberry',
        color: 'green',
        value: 5
    },
    {
        platform: 'Windows',
        color: 'gray',
        value: 10
    },
    {
        platform: 'Ios',
        color: 'orange',
        value: 15
    },
    {
        platform: 'Android',
        color: 'blue',
        value: 20
    }
];

var height = 500;
var width = 500;
var marginbottom = 100;
var margintop = 50;

var svg = d3.select('div')
    .append('svg')
    .attr('width', width)
    .attr('height', height + marginbottom + margintop)
    .append("g")
    .attr("transform", "translate(0," + margintop + ")");

//Creacion de escalas
var xscale = d3.scaleBand()
    .domain(input.map(function(d) {
        return d.platform;
    }))
    .range([0, width])
    .padding(0.1);

var yscale = d3.scaleLinear()
    .domain([0, d3.max(input, function(d) {
        return d.value;
    })])
    .range([height, 0]);

//Creación de eje X
var xaxis = d3.axisBottom(xscale);

//Creacion de los rectangulos
var rect = svg
    .selectAll('rect')
    .data(input)
    .enter()
    .append('rect')
    .attr("fill", "#93CAAE");

rect.attr('class', (d) => {
    if (d.value > 10) {
        return 'rectwarning';
    }
    //(d.value > 10) ? 'rectwarning':''; //El if statement de arriba "simplificado"
});

rect
    .attr("x", function(d) {
        return xscale(d.platform);
    })
    .attr('y', d => {
        return yscale(0)
    })
    .attr("width", xscale.bandwidth())
    .attr("height", function() {
        return height - yscale(0); //Al cargarse los rectangulos tendran una altura de 0 
    }).on("mouseover", function() {
        d3.select(this).attr("class", "").attr("fill", "yellow")
    })
    .on("mouseout", function() {
        d3.select(this).attr("fill", "#93CAAE")
            .attr('class', (d) => {
                if (d.value > 10) {
                    return 'rectwarning';
                }
            })
    });

rect
    .transition() //transición de entrada
    //.ease(d3.easeBounce)
    .duration(1000)
    .delay(function(d, i) {
        console.log(i);
        return (i * 300)
    })
    .attr('y', d => {
        return yscale(d.value)
    })
    .attr("height", function(d) {
        return height - yscale(d.value); //Altura real de cada rectangulo.
    });


//Añadimos el texto correspondiente a cada rectangulo.
var text = svg.selectAll('text')
    .data(input)
    .enter()
    .append('text')
    .text(d => d.value)
    .attr("x", function(d) {
        return xscale(d.platform) + xscale.bandwidth() / 2;
    })
    .attr('y', d => {
        return yscale(d.value)
    })
    .style("opacity", 0);

//Por si queremos aplicar el estilo creado al texto
/*text.attr('class', (d) => {
        if (d.value > 10) {
            return 'rectwarning';
        }
        return 'text';
    })*/

//Transicción de entrada en el texto.
text
    .transition()
    //.ease(d3.easeBounce)
    .duration(500)
    .delay(d3.max(input, function(d, i) {
        return i;
    }) * 300 + 1000)
    .style("opacity", 1);

//Añadimos el eje X
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis);