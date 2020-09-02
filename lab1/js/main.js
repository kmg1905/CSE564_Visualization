/*
*    main.js
*    Mastering Data Visualization with D3.js
*    3.11 - Making a bar chart
*/

var margin = { left:100, right:10, top:10, bottom:150 };

var width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left 
            + ", " + margin.top + ")");


var dataMap = {};


/*
*    main.js
*    Mastering Data Visualization with D3.js
*    3.11 - Making a bar chart
*/

var margin = { left:100, right:10, top:10, bottom:150 };

var width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left 
            + ", " + margin.top + ")");


//var dataMap = {};


d3.csv('data/basketBall.csv').then(function(data){

    console.log(data);
    data.forEach(function(d){
        d.Games_Played = +d.Games_Played;
    });

    var x = d3.scaleBand()
        .domain(data.map(function(d){ return d.Team; }))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){
            return d.Games_Played;
        })])
        .range([height, 0]);

    var xAxisCall = d3.axisBottom(x);
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxisCall)
        .selectAll("text")
            .attr("y", "10")
            .attr("x", "-5")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)");

    var yAxisCall = d3.axisLeft(y)
        .ticks(3)
        .tickFormat(function(d){
            return d + "m";
        });

    // X Label
    g.append("text")
        .attr("class", "x axis-label")
        .attr("x", width / 2)
        .attr("y", height + 140)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Teams");

    // Y Label
    g.append("text")
        .attr("class", "y axis-label")
        .attr("x", - (height / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("");


    g.append("g")
        .attr("class", "y-axis")
        .call(yAxisCall);

    var rects = g.selectAll("rect")
        .data(data)
    
    rects.enter()
        .append("rect")
            .attr("y", function(d){ return y(d.Games_Played); })
            .attr("x", function(d){ return x(d.Team); })
            .attr("width", x.bandwidth)
            .attr("height", function(d){ return height - y(d.Games_Played); })
            .attr("fill", "grey");

})





