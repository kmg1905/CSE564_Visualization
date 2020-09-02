var url = 'http://127.0.0.1:5000';
    
    function Elbow()
    {
    $.getJSON((url + '/Elbow'), function(d) {
          
          createLineChart(d.data, "Number of Clusters", "Inertia")
          
        });
    }

    function ScreePlotForPCATotal()
    {
    $.getJSON((url + '/ScreePlotForPCATotal'), function(d) {
          
          createLineChart(d.data,"No of Components","PCA Variance")
          
        });
    }
    
    function ScreePlotForPCA()
    {
    $.getJSON((url + '/ScreePlotForPCA'), function(d) {
          
          createLineChart(d.data,"No of Components","PCA Variance")
          
        });
    }
    
    function ScreePlotForPCAStratified()
    {
    $.getJSON((url + '/ScreePlotForPCAStratified'), function(d) {
          
          createLineChart(d.data,"No of Components","PCA Variance")
        });
    }
    
    function ScreePlotForMDSEucTotal()
    {
    $.getJSON((url + '/ScreePlotForMDSEucTotal'), function(d) {
          
          createLineChart(d.data,"No of Components","MDS Eucilidian Stress")
        });
    }

    function ScreePlotForMDSEuc()
    {
    $.getJSON((url + '/ScreePlotForMDSEuc'), function(d) {
          
          createLineChart(d.data,"No of Components","MDS Eucilidian Stress")
        });
    }
    
    function ScreePlotForMDSEucStratified()
    {
    $.getJSON((url + '/ScreePlotForMDSEucStratified'), function(d) {
          
          createLineChart(d.data,"No of Components","MDS Eucilidian Stress")
        });
    }
    
    function ScatterPlotPCATotal()
    {
    $.getJSON((url + '/ScatterPlotPCATotal'), function(d) {
          
          createScatterPlot(d.data, 'n', "PC1","PC2")
        });
    }

    function ScatterPlotPCA()
    {
    $.getJSON((url + '/ScatterPlotPCA'), function(d) {
          
          createScatterPlot(d.data, 'n', "PC1","PC2")
        });
    }
    
    function ScatterPlotPCAStratified()
    {
    $.getJSON((url + '/ScatterPlotPCAStratified'), function(d) {
          
          createScatterPlot(d.data, 'y', "PC1","PC2")
        });
    }
    
    function ScatterPlotMDSTotal()
    {
    $.getJSON((url + '/ScatterPlotMDSTotal'), function(d) {
          
          createScatterPlot(d.data,'n', "MDS1","MDS2")
        });
    }

    function ScatterPlotMDS()
    {
    $.getJSON((url + '/ScatterPlotMDS'), function(d) {
          
          createScatterPlot(d.data,'n', "MDS1","MDS2")
        });
    }
    
    function ScatterPlotMDSStratified()
    {
    $.getJSON((url + '/ScatterPlotMDSStratified'), function(d) {
          
          createScatterPlot(d.data, 'y', "MDS1","MDS2")
        });
    }
    
    function ScatterPlotMDSCorrTotal()
    {
    $.getJSON((url + '/ScatterPlotMDSCorrTotal'), function(d) {
          
          createScatterPlot(d.data, 'n', "MDS1","MDS2")
        });
    }

    function ScatterPlotMDSCorr()
    {
    $.getJSON((url + '/ScatterPlotMDSCorr'), function(d) {
          
          createScatterPlot(d.data, 'n', "MDS1","MDS2")
        });
    }
    
    function ScatterPlotMDSCorrStratified()
    {
    $.getJSON((url + '/ScatterPlotMDSCorrStratified'), function(d) {
          
          createScatterPlot(d.data, 'y', "MDS1", "MDS2")
        });
    }
    
function ScatterPlotMatrixTotal()
    {
    $.getJSON((url + '/ScatterPlotMatrixTotal'), function(d) {
          
          createScatterPlotMatrix(d.data)
        });
    }

    function ScatterPlotMatrixRandom()
    {
    $.getJSON((url + '/ScatterPlotMatrixRandom'), function(d) {
          
          createScatterPlotMatrix(d.data)
        });
    }

    function ScatterPlotMatrixStratified()
    {
    $.getJSON((url + '/ScatterPlotMatrixStratified'), function(d) {
          
          createScatterPlotMatrix(d.data)
        });
    }
    
    function createLineChart(data, label_x, label_y)

      {
        
        var svg = d3.select("svg"),
        height = svg.attr("height") - 99,
        width = svg.attr("width")- 99;
        
        console.log(data);

        d3.selectAll("g").remove();

    var line = d3.line()
        .x(function(d) { return xScale(+d.x); }) 
        .y(function(d) { return yScale(+d.y); }) 

    var xScale = d3.scaleLinear()
        .domain([d3.min(data,function(d)
          { return +d.x;}), d3.max(data,function(d)
          { return +d.x;})])
        .range([0, width]).nice();

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data,function(d)
          {return  +d.y;})]) 
        .range([height, 0]).nice(); 

    var g=  svg.append("g")
        .attr("transform", "translate(" + 88 + "," + 39 + ")");

    g.append("g")
      .attr("class", "x axis")

      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale).tickSize(-height))
      .append("text")
      .attr("y", height - 348)
      .attr("x", width - 99)
      .text(label_x)
      .style("font-weight","bold")
      .style("fill", "#f26024")
      .attr("font-size", "14px");

    g.append("g")
      .attr("class", "y axis")
      
      .call(d3.axisLeft(yScale).tickSize(-width)) 
      .append("text")
      .attr("y", 7)
      .text(label_y)
      .attr("dy", "-5.2em")
      .attr("transform", "rotate(-90)")
      .style("font-weight","bold")
      .style("fill", "#f26024")
      
      .attr("font-size", "14px");

    
    g.append("path")
      .attr("class", "line") 
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .datum(data) 
      .attr("d", line); 

    
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot") 
      .attr("cy", function(d) 
        { return yScale(+d.y) })
      .attr("cx", function(d) 
        { return xScale(+d.x) })
      .attr("r", 5.2);

      }

      
      function createScatterPlot(data, flag, label_x, label_y)

        {
          var svg = d3.select("svg"),
          
          height = svg.attr("height") - 99,
          width = svg.attr("width") - 99;

          console.log(data);
          d3.selectAll("g").remove();

      var xScale = d3.scaleLinear()
          .domain([d3.min(data,function(d)
          { return +d.x;}), d3.max(data,function(d)
          { return +d.x;})])
          .range([0, width]).nice(); 


      var yScale = d3.scaleLinear()
          .domain([d3.min(data,function(d)
          {return  +d.y;}), d3.max(data,function(d)
          {return  +d.y;})]) 
          .range([height, 0]).nice(); 


      var color=d3.scaleOrdinal(d3.schemeCategory10);

      var g=  svg.append("g")
          .attr("transform", "translate(" + 88 + "," + 39 + ")");

      g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale).tickSize(-height))
          .append("text")
          .attr("y", height - 348)
          .attr("x", width - 99)
          .text(label_x)
           .style("font-weight","bold")
          .style("fill", "#f26024")
         
          .attr("font-size", "14px");

      g.append("g")
          .attr("class", "y axis")
          .call(d3.axisLeft(yScale).tickSize(-width ))
          .append("text")
          .attr("y", 7)
          .attr("dy", "-5.2em")
          .text(label_y)
          .style("font-weight","bold")
          .attr("transform", "rotate(-90)")
          
          .style("fill", "#f26024")
          
          .attr("font-size", "14px");

      g.selectAll(".dot")
          .data(data)
          .enter()
          .append("circle")
          .attr("cy", function(d) 
            { return yScale(+d.y) })
          .attr("cx", function(d) 
            { return xScale(+d.x) })
          
          .style("fill", function(d) 
            { return color(d.cluster);})
          .attr("r", 5.2);
          
    if(flag == 'y'){
          var legend = g.selectAll(".legend")
          .data(color.domain())
          .enter() 
          .append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) 
            { return "translate(0," + i * 18 + ")"; });

      legend.append("rect")
          .attr("x", width - 9)
          .attr("height", 18)
          .attr("width", 18)
          .style("fill", color);

      legend.append("text")
          .attr("x", width - 18)
          .attr("y", 9)
          .attr("dy", ".35em")
          .text(function(d) {return "Cluster-"+ d; })
          .style("text-anchor", "end");

        }

        }

      function cross(a, b) {
            var i;
            var j;
            var c = [];
            var n = a.length;
            var m = b.length;

            for (i = -1; ++i  < n;) for (j = -1; ++j < m;) c.push({i: i, x: a[i], j: j, y: b[j]});
            return c;
      }
     
function createScatterPlotMatrix(data){
    d3.selectAll("g").remove();
    console.log(data)

    var size = 231;
    var padding = 21;
    var columnsDomain = {},
     columns = d3.keys(data[0]).filter(function(d) 
      { return d !== "clusters"; }),
     n = columns.length;
     columns.forEach(function(column) {
       columnsDomain[column] = d3.extent(data, function(d) { return d[column]; });
     });

     var svg = d3.select("svg")
         .attr("width", size * n + padding)
         .attr("height", size * n + padding);

     

     var xScale = d3.scaleLinear()
  .range([padding / 2, size - padding / 2]);

    var yScale = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);

    var g= svg.append("g")
         .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

     g.selectAll(".x.axis")
         .data(columns)
         .enter()
         .append("g")
         .attr("class", "x axis")
         .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
         .each(function(d) { xScale.domain(columnsDomain[d]); d3.select(this)
         .call(d3.axisBottom(xScale).tickSize(size*n)); });

     g.selectAll(".y.axis")
         .data(columns)
       .enter().append("g")
         .attr("class", "y axis")
         .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
         .each(function(d) { yScale.domain(columnsDomain[d]); d3.select(this)
          .call(d3.axisLeft(yScale).tickSize(-size*n)); });
    
     var cell = g.selectAll(".cell")
         .data(cross(columns, columns))
       .enter().append("g")
         .attr("class", "cell")
         .attr("transform", function(d) {return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
         .each(plot);

     
     cell.filter(function(d) { return d.i === d.j; }).append("text")
         .attr("x", padding)
         .attr("y", padding)
         .attr("dy", ".71em")
         .text(function(d) { return d.x; });
     
     function plot(p) {
       var cell = d3.select(this);

       xScale.domain(columnsDomain[p.x]);
       yScale.domain(columnsDomain[p.y]);

       cell.append("rect")
           .attr("class", "frame")
           .attr("x", padding / 2)
           .attr("y", padding / 2)
           .attr("width", size - padding)
           .attr("height", size - padding);

       cell.selectAll("circle")
           .data(data)
         .enter().append("circle")
           .attr("cx", function(d) { return xScale(d[p.x]); })
           .attr("cy", function(d) { return yScale(d[p.y]); })
           .attr("r", 4)
           .style("fill", "#6ca103");
     }
  }
        
        