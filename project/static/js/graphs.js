queue()
    .defer(d3.json, "/data")
    .defer(d3.json, "static/geojson/us-states.json")
    .await(makeGraphs);

function makeGraphs(error, inputData, statesJson) {
        
        inputData.forEach(function(d){
            d.Total_Population = parseInt(+(d.Total_Population)/1000000);
            d.Urban = +(d.Urban);
            d.Suburban = +(d.Suburban);
            d.Rural = +(d.Rural);
            d.Native = +(d.Native);
            d.Female = parseInt(+(d.Female)/1000000);
            d.Male = parseInt(+(d.Male)/1000000);
            d.Europe = +(d.Europe);
            d.Asia = +(d.Asia);
            d.Africa = +(d.Africa);
            d.MedianIncome = +(d.MedianIncome);
            d.PerCapitaIncome = +(d.PerCapitaIncome);
            d.Poverty = +(d.Poverty);
            d.Educated_Sex_Ratio = +(d.Educated_Sex_Ratio);
            d.College_Educated_Ratio = +(d.College_Educated_Ratio);
            d.year = +(d.year);
            d.Foreign = parseInt(+(d.Foreign)/1000000);
            console.log(d.year);
        })

        var filter = crossfilter(inputData);
            
        var dimension_citizenship = filter.dimension(dc.pluck('STATE'));
        var dimension_citizenship_group = dimension_citizenship.group().reduceSum(dc.pluck('Total_Population'));
        dc.pieChart('#Total_Population')
            .height(350)
            .radius(350)
            .transitionDuration(1000)
            .dimension(dimension_citizenship)
            .group(dimension_citizenship_group);


        // var dimension_map = filter.dimension(dc.pluck('year'));
        // var dimension_map_group = dimension_map.group();
        // dc.geoChoroplethChart("#Total_Population")
        //     .width(1000)
        //     .height(350)
        //     .dimension(dimension_map)
        //     .group(dimension_map_group)
        //     .colors(d3.scale.category10())
        //     .overlayGeoJson(statesJson["features"], "state", function (d) {
        //         return d.properties.name;
        //     })
        //     .projection(d3.geo.albersUsa()
        //             .scale(600)
        //             .translate([340, 150]))
        //     .title(function (p) {
        //         return "State: " + p["key"]
        //             + "\n"
        //             + "Total_Population: " + Math.round(p["value"]);
        // });

       
        var dimension_industry = filter.dimension(dc.pluck('year'));
        var total_worth = dimension_industry.group().reduceSum(dc.pluck('Total_Population'));
        dc.rowChart("#Total_Population_state")
            .width(800)
            .height(300)
            .dimension(dimension_industry)
            .group(total_worth)
            .xAxis().ticks(8);

            
        var dimension_name = filter.dimension(dc.pluck('year'));
        var worth_group = dimension_name.group().reduceSum(dc.pluck('PerCapitaIncome'));
        dc.rowChart("#PerCapitaIncome")
            .width(500)
            .height(300)
            .dimension(dimension_name)
            .group(worth_group)
            .xAxis().ticks(5);


        // function reduceInitial(){ 
        //       return {}; 
        //   }
        // function reduceAdd(p, v){
        //       p[v.Male] = (p[v.Male]||0) + v.Total_Population; return p;
        //   }

        // function reduceRemove(p, v){
        //       p[v.Male] = (p[v.Male]||0)  - v.Total_Population; return p;
        //   }

        // dimensionByType = filter.dimension(function(d){ return d.year; });
        // var groupByType = dimensionByType.group().reduce(reduceAdd,reduceRemove,reduceInitial);
        // dc.barChart("#gender_chart")
        //     .height(300)
        //     .width(400)
        //     .dimension(dimensionByType)
        //     .group(groupByType)
        //     .x(d3.scale.ordinal().domain(['1970','1980','1990', '2000', '2010']))
        //     .xUnits(dc.units.ordinal)
        //     .group(groupByType,"Quantity: 1",function(d){ return d.value[1] || 0; })
        //     .stack(groupByType,"Quantity: 2",function(d){ return d.value[2]; })
        
        var dimension_gender = filter.dimension(dc.pluck('year'));
        var dimension_gender_group = dimension_gender.group().reduceSum(dc.pluck('Foreign'));
        dc.barChart("#Foreign")
            .height(300)
            .width(400)
            .margins({top: 20, right: 40, bottom: 20, left: 40})
            .dimension(dimension_gender)
            .group(dimension_gender_group)
            .colors("#003f5c")
            .transitionDuration(1000)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .yAxisLabel("Millions");

        var dimension_gender1 = filter.dimension(dc.pluck('year'));
        var dimension_gender_group1 = dimension_gender.group().reduceSum(dc.pluck('College_Educated_Ratio'));
        dc.barChart("#College_Educated_Ratio")
            .height(300)
            .width(400)
            .margins({top: 20, right: 40, bottom: 20, left: 40})
            .dimension(dimension_gender1)
            .group(dimension_gender_group1)
            .transitionDuration(1000)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)


        // var bubbleDimension = filter.dimension(dc.pluck('year'));
        // var bubbleGroup = bubbleDimension.group().reduceSum(dc.pluck('Foreign', 'PerCapitaIncome'));
        // var bubble_chart = dc.bubbleChart("#gender_chart")
        //     .width(600)
        //     .height(250)
        //     .dimension(bubbleDimension)
        //     .group(bubbleGroup)
        //     .clipPadding(60)
        //     .maxBubbleRelativeSize(0.05)
        //     .r(d3.scale.linear().domain([1,6]))
        //     .y(d3.scale.linear().domain([0,200]))
        //     .x(d3.scale.linear().domain([0,300]))
        //     .keyAccessor(function(d){ return d.key[0] })
        //     .valueAccessor(function(d){ return d.key[1] })
        //     .radiusValueAccessor(function(d){ return parseInt(d.value)})
        //     .colorAccessor(function(d){ return d.value; })
        //     .colors(d3.scale.category10())
        //     .yAxisLabel("Y axis")
        //     .xAxisLabel("X axis");

        // bubble_chart.yAxis().ticks(5);

   dc.renderAll();
}