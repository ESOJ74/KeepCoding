var map = L.map('mapid').setView([40.421049, -3.706605], 10) // [Lat,Long]


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

console.log(map.getPanes().overlayPane)

var svg = d3.select(map.getPanes().overlayPane) //elemento div donde crearemos nuestro SVG
    .append('svg') //No asignamos unas dimensiones al svg (width & heigth) ya que han de 
    // ser calculadas de manera dinámica.


g = svg.append("g").attr("class", "leaflet-zoom-hide"); //Asignamos esta clase para que el svg se 
//esconda cuando haya una animacion de zoom

d3.json('Practica/practica_airbnb.json')
    .then((featureCollection) => {

        //1. Datos GeoJSON
        console.log(featureCollection);

        //2. Realizamos una proyeccion de nuestros datos. [lat,long] a [X,Y] (pixeles)
        var transform = d3.geoTransform({
            point: projectPoint
        });

        //3. Transformamos los datos proyectados en elementos gráficos path    
        var pathGenerator = d3.geoPath().projection(transform);
        //Escala e colores
        var scaleColor = d3.scaleOrdinal(d3.schemeTableau10);
        var features = featureCollection.features;

        d3_features =
            g.selectAll("path")
            .data(features)
            .enter()
            .append("path")
            .attr("d", pathGenerator)
            .attr("opacity", 0.7)
            .attr("fill", (d, i) => scaleColor(i));
        //.style("pointer-events", "auto") Opcional: para activar los eventos de raton sobre los path.



        map.on("zoom", update); //Actualizar tamaño del SVG cuando haya un evento de zoom
        update(); //Para inicializarlo

        // Ajustamos el SVG a los cambios que se producen en el mapa.
        function update() {

            bounds = pathGenerator.bounds(featureCollection);
            console.log(bounds)
            var topLeft = bounds[0],
                bottomRight = bounds[1];

            svg.attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");

            g.attr("transform", "translate(" + -topLeft[0] + "," +
                -topLeft[1] + ")");

            //Actualizamos el path
            d3_features
                .attr("d", pathGenerator)
        }

        // 
        //Use Leaflet to implement a D3 geometric transformation.
        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }
    });