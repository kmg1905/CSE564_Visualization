function histfrequency(data, field){
    
    count_data = []
    data.forEach(d => count_data.push(+d[field]))
    return count_data;
}

function histogram(colName, no_bins){

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    $("svg").remove()

    d3.select("#chart").html("");
	var svg = d3.select("#chart")
	    .append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	        .attr("transform", "translate(" + margin.left 
	            + ", " + margin.top + ")");

	d3.csv('../data/basketball.csv', function(data){
		// console.log(data)
	    var values = histfrequency(data, colName)
	    //console.log(data)
	    var max = d3.max(values);
		var min = d3.min(values);

		var x = d3.scaleLinear()
		      .domain([min, max])
		      .range([0, width])
		svg.append("g")
      		.attr("transform", "translate(0," + height + ")")
      		.call(d3.axisBottom(x));

		var histogram = d3.histogram()
      						.value(function(d) { return d[colName]; })
      						.domain(x.domain())
      						.thresholds(x.ticks(no_bins));

      	bins = histogram(data)

      	var tip = d3.tip()
  					.attr('class', 'd3-tip')
  					.offset([-10, 0])
  					.html(function(d) {
    				return "<strong>Frequency:</strong> <span style='color:red'>" + d.length + "</span>";
  		})

  		svg.call(tip);

      	var y = d3.scaleLinear()
      				.range([height, 0]);
      				y.domain([0, d3.max(bins, function(d) { return d.length; })]);
  		svg.append("g")
      		.call(d3.axisLeft(y));
   		svg.append("text")             
	      .attr("transform",
	            "translate(" + (width/2) + " ," + 
	                           (height + 25) + ")")
	      .style("text-anchor", "middle")
	      .text(colName);
	     svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Frequency"); 



      	svg.selectAll("rect")
      		.data(bins)
      		.enter()
      		.append("rect")
      		.attr("class", "bar")
        	.attr("x", 3)
        	.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        	.attr("width", function(d) { return x(d.x1) - x(d.x0) - 9 ; })
        	.attr("height", function(d) { return height - y(d.length); })
        	//.style("margin-top", "100px")
        	.on('mouseover', function(d){
		      	x = +d3.select(this).attr('x') - 8;
		      	width = +d3.select(this).attr('width') +10;
		      	y = +d3.select(this).attr('y') - 8;
		      	height = +d3.select(this).attr('height') +10;

		      	d3.select(this)
		      		.attr("x",x )
		      		.attr("width", width)
		      		.attr("y",y )
		      		.attr("height", height)
		      		.style("fill", "#7C48B8")

		      	tip.show(d);
		      })
      		.on('mouseout', function(d){
      			x = +d3.select(this).attr('x') + 8;
		      	width = +d3.select(this).attr('width')-10;
		      	y = +d3.select(this).attr('y') + 8;
		      	height = +d3.select(this).attr('height') -10;

      			d3.select(this)
      				.attr('x', x)
					.attr('width', width)
					.attr('y',  y)
					.attr('height', height)
					.style("fill", "#69b3a2");
      			tip.hide()
      		})
        	.style("fill", "#69b3a2");
	});

	d3.selectAll('#chart').on("mousedown", function() {
        		var temp = d3.event.pageX;
        		var temp2 = d3.select(this)
        					.classed("active", true);
        		var temp3 = d3.select(window)
        					.on("mousemove", mousemove)
        					.on("mouseup", mouseup);

        		d3.event.preventDefault();

        		function mousemove() {
        			var current = d3.event.pageX
        			if (current < temp && temp - current >= 0 ){

        				no_bins = no_bins - 1;
        				console.log(no_bins);
        				histogram(colName, no_bins);
        			}
        			else if (current > temp) {
        				no_bins = no_bins + 1;
        				console.log(no_bins);
        				histogram(colName, no_bins);
        			}
     
        		}

        		function mouseup(){
        			temp3.on("mousemove", null).on("mouseup", null)
        			temp2.classed("active", false)
        		}

    });
}


function frequency(data, field){

	var plot = d3.nest()
            .key(function(d) { return eval("d."+field)})
            .rollup(function(values) { return values.length; })
            .entries(data)
            .sort(function(x, y){ return d3.descending(x.value, y.value) });

     return plot;
}

function barchart(colName){

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    $("svg").remove()

	var svg = d3.select("#chart")
	    .append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	        .attr("transform", "translate(" + margin.left 
	            + ", " + margin.top + ")");

	d3.csv('../data/basketball.csv', function(data){

	    var plot = frequency(data, colName)

	    var x = d3.scaleBand()
	        .domain(plot.map(function(d){ return d.key; }))
	        .range([0, width])
	        .paddingInner(0.3)
	        .paddingOuter(0.3);

	    var y = d3.scaleLinear()
	        .domain([0, d3.max(plot, function(d){
	            return d.value;
	        })])
	        .range([height, 0]);

	    var tip = d3.tip()
  					.attr('class', 'd3-tip')
  					.offset([-10, 0])
  					.html(function(d) {
    				return "<strong>Count:</strong> <span style='color:red'>" + d.value + "</span>";
  		})

  		svg.call(tip);

  		svg.append("text")             
	      .attr("transform",
	            "translate(" + (width/2) + " ," + 
	                           (height + 30) + ")")
	      .style("text-anchor", "middle")
	      .text(colName);
	      svg.append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 0 - margin.left)
		      .attr("x",0 - (height / 2))
		      .attr("dy", "1em")
		      .style("text-anchor", "middle")
		      .text("Count");

		  // append the rectangles for the bar chart
		  svg.selectAll("rect")
		      .data(plot)
		    .enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x(d.key); })
		      .attr("width", x.bandwidth())
		      //.on('mouseover', tip.show)
		      .attr("y", function(d) { return y(d.value); })
		      .attr("height", function(d) { return height - y(d.value); })

		      .on('mouseover', function(d){
		      	x = +d3.select(this).attr('x') - 10;
		      	width = +d3.select(this).attr('width') +10;
		      	y = +d3.select(this).attr('y') - 10;
		      	height = +d3.select(this).attr('height') +10;

		      	d3.select(this)
		      		.attr("x",x )
		      		.attr("width", width)
		      		.attr("y",y )
		      		.attr("height", height)
		      		.style("fill", "#7C48B8")

		      	tip.show(d);
		      })
      		.on('mouseout', function(d){
      			x = +d3.select(this).attr('x') + 10;
		      	width = +d3.select(this).attr('width')-10;
		      	y = +d3.select(this).attr('y') + 10;
		      	height = +d3.select(this).attr('height') -10;

      			d3.select(this)
      				.attr('x', x)
					.attr('width', width)
					.attr('y',  y)
					.attr('height', height)
					.style("fill", "#69b3a2");
      			tip.hide()
      		})
		     .style("fill", "#69b3a2");

		  // add the x Axis
		  svg.append("g")
		      .attr("transform", "translate(0," + height + ")")
		      .call(d3.axisBottom(x));

		  // add the y Axis
		  svg.append("g")
		      .call(d3.axisLeft(y));

	    // console.log(plot)
	});
	
}