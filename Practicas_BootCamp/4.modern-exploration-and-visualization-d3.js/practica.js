d3.json('practica_airbnb.json')
    .then((featureCollection) => {
        drawMap(featureCollection);
        
    });

function drawBar( barrio, colorBarrio){
    
    var datos = barrio.properties.avgbedrooms;
    var barrioName = barrio.properties.name;

    var height = 200;
    var width = 300;
    
    d3.select("#div_bar").select("svg").remove();

    var svgTabla = d3.select('#div_bar').append("div")
        .append('svg')
        .attr('width', width + 900)
        .attr('height', height + 60)
        .append("g")
        .attr("transform", "translate (130,20)");

    var xscale = d3.scaleBand()
        .domain(datos.map((d) => d.bedrooms))
        .range([0, width])
        .padding(0.1);

    var yscale = d3.scaleLinear()
        .domain([0, d3.max(datos, d => d.total)])
        .range([height, 0]);

    var xaxis = d3.axisBottom(xscale);

    var rect = svgTabla
        .selectAll('rect')
        .data(datos)
        .enter()
        .append('rect')
        .attr("fill", colorBarrio);

    rect.attr("x", d => xscale(d.bedrooms))
        .attr('y', d => yscale(d.total))
        .attr("width", xscale.bandwidth())
        .attr("height", d => height - yscale(d.total));

    var text = svgTabla.selectAll('text')
        .data(datos)
        .enter()
        .append('text')
        .text(d => d.total)
        .attr("x", d => xscale(d.bedrooms) + xscale.bandwidth() / 2)
        .attr('y', d => yscale(d.total))

    svgTabla.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis);

    svgTabla.append("text")
        .attr("y", 0)
        .attr("dx", 300)
        .attr("dy", "0em")
        .style("font-weight", "bold")
        .style("font-size", "27")
        .text(barrioName);

    svgTabla.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("dx", -100)
        .style("text-anchor", "middle")
        .style("font-size", "14")
        .text("Numero de Establecimientos")
        
    svgTabla.append("text")
        .attr("y", 230)
        .attr("dx", 150)
        .style("text-anchor", "middle")
        .style("font-size", "14")
        .text(" Numero de Habitaciones");           
        
}

function drawMap(featureCollection) {

    var width = 800;
    var height = 840;

    var svg = d3.select("#div_mapa")
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g');

    var center = d3.geoCentroid(featureCollection); //Encontrar la coordenada central del mapa (de la featureCollection)

    //to translate geo coordinates[long,lat] into X,Y coordinates.
    var projection = d3.geoMercator()
        .fitExtent([[0, 60], [width, height]], featureCollection)

    //Para crear paths a partir de una proyección 
    var pathProjection = d3.geoPath().projection(projection);
  
    var features = featureCollection.features;

    features.forEach((d) => d.properties.rango = (d.properties.avgprice == null) ? 0:
                                                                   (d.properties.avgprice > 0 & d.properties.avgprice <= 30) ? 1:
                                                                   (d.properties.avgprice > 30 & d.properties.avgprice <= 50) ? 2:
                                                                   (d.properties.avgprice > 50 & d.properties.avgprice <= 60) ? 3:
                                                                   (d.properties.avgprice > 60 & d.properties.avgprice <= 70) ? 4:
                                                                   (d.properties.avgprice > 70 & d.properties.avgprice <= 80) ? 5:
                                                                   (d.properties.avgprice > 80 & d.properties.avgprice <= 90) ? 6:
                                                                   (d.properties.avgprice > 90 & d.properties.avgprice <= 100) ? 7:
                                                                   (d.properties.avgprice > 100 & d.properties.avgprice <= 150) ? 8:9);
   
    features.forEach((d,i) => d.properties.idx = i);

    //Creamos el elemento Tooltip
    var tooltip = d3.select("div").append("div")
        .attr("class", "tooltip") 
    

    var createdPath = svg.selectAll('path')
        .data(features)
        .enter()
        .append('path')
        .attr('d', pathProjection)    

    createdPath
        .on('click', handleClick)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)

    function handleClick(event, d) {        
        drawBar(features[d.properties.idx] , scaleColor[d.properties.rango]);
    }

    function handleMouseOver(event, d) {
        d3.select(this)
            .transition()
            .duration(1000)
            .attr("fill", "#FFa084")        

        tooltip.transition()
            .duration(200)
            .style("visibility", "visible")
            .style("left", (event.pageX + 20) + "px")
            .style("top", (event.pageY - 30) + "px")
            .text(`${d.properties.avgprice} euros`)
    }

    function handleMouseOut(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", (d) => scaleColor[d.properties.rango])
            .attr("r", 3)

        tooltip.transition()
            .duration(200)
            .style("visibility", "hidden")
    }


    var scaleColor = ["lightgrey", "Yellow", "LightGreen", "Green", "LightBlue", "Blue","DarkBlue", "orange", "Pink", "Red"]
    createdPath.attr('fill', (d) => scaleColor[d.properties.rango]);           


    //Creacion de una leyenda
    var nblegend = 10;
    var widthRect = (width / nblegend) - 2;
    var heightRect = 10;

    var scaleLegend = d3.scaleLinear()
        .domain([0, nblegend])
        .range([0, width]);

    var legend = svg.append("g")
        .selectAll("rect")
        .data(scaleColor)
        .enter()
        .append("rect")
        .attr("width", widthRect)
        .attr("height", heightRect)
        .attr("x", (d, i) => scaleLegend(i)) 
        .attr("fill", (d) => d);

    
    var text_legend = svg.append("g")
        .selectAll("text")
        .data(["Sin datos ","0 - 30","31 - 50","51 - 60","61 - 70","71 - 80","81 - 90","91 - 100","101 - 150","mas de 150"])
        .enter()
        .append("text")
        .attr("x", (d, i) => scaleLegend(i)+20) 
        .attr("y", heightRect * 2.5)
        .text((d) => d)
        .attr("font-size", 12)
}

