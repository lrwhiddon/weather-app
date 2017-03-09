var dailyForecast = require('./templates/dailyForecast.html');
var weatherCharts = require('./templates/weatherCharts.html');
var d3 = require('d3');

var directives =  angular.module('weatherApp.directives', []);

directives.directive('dailyForecast', ['$sce', function($sce){

    return {
        scope: {
            details: '='
        },
        restrict: 'E',
        replace: 'true',
        template: dailyForecast,
        link: function(scope, element, attrs){
            var iconList = {
                'clear-day': require('./media/Sun.svg'),
                'clear-night': require('./media/Moon.svg'),
                'rain': require('./media/Cloud-Rain.svg'),
                'snow': require('./media/Cloud-Snow-Alt.svg'),
                'sleet': require('./media/Cloud-Hail.svg'),
                'wind': require('./media/Wind.svg'),
                'fog': require('./media/Cloud-Fog.svg'),
                'cloudy': require('./media/Cloud.svg'),
                'partly-cloudy-day': require('./media/Cloud-Sun.svg'),
                'partly-cloudy-night': require('./media/Cloud-Moon.svg'),
                'other': require('./media/Thermometer.svg')
            };
            var svg = iconList[scope.details.icon];
            if(svg === undefined){
                svg = iconList['other'];
            }
            scope.svg = $sce.trustAsHtml(svg);
        }
    };
}]);

directives.directive('weatherCharts', ['$timeout', function($timeout){

    return {
        restrict: 'E',
        template: weatherCharts,
        replace: 'true',
        link: function(scope, element, attrs){

            scope.renderChart = function(selector){
                // start by setting up constants and everything
                // that will be the same with the two graphs
                containerWidth = document.getElementById(selector).offsetWidth;
                containerHeight = containerWidth * 1/2;

                margin = {top: 10, right: 10, bottom: 20, left: 30};
                width = containerWidth - margin.left - margin.right;
                height = containerHeight - margin.top - margin.bottom;

                // set up date manipuation & formatting
                var data = scope.dailyForecast;
                data.forEach(function(d){ d.formatted_date = new Date(d.time * 1000); });
                var parseDate = d3.timeFormat("%a");

                // set up x & y axis
                var x = d3.scaleTime()
                    .range([0, width]);

                var y = d3.scaleLinear()
                    .range([height, 0]);

                var xAxis = d3.axisBottom(x)
                    .ticks(d3.timeDay)
                    .tickFormat(
                        function(d){ return parseDate(d);});

                x.domain(d3.extent(data, function(d) { return d.formatted_date; }));
                
                var yAxis;
                var maxValue;
                var minLine;
                var maxLine;
                var rainLine;

                // set up chart-specific data
                // y domain & actual data lines
                if(selector == 'temp-chart'){
                    // set up Y axis and data lines for temp
                    yAxis = d3.axisLeft(y)
                        .tickFormat(
                            function(d){return d + 'F';});

                    maxValue = d3.max(data,
                        function(d){return d.apparentTemperatureMax;});
                    y.domain([0, maxValue]);
                    // set up data lines
                    maxLine = d3.line()
                        .x(function(d){return x(d.formatted_date);})
                        .y(function(d){return y(d.apparentTemperatureMax);});
                    
                    minLine = d3.line()
                        .x(function(d){return x(d.formatted_date);})
                        .y(function(d){return y(d.apparentTemperatureMin);});

                } else {
                    yAxis = d3.axisLeft(y)
                        .tickFormat(
                            function(d){return (parseInt(d * 100, 10) + '%');});
                    maxValue = d3.max(data,
                        function(d){return d.precipProbability;});
                    y.domain([0, maxValue]);
                    rainLine = d3.line()
                        .x(function(d){return x(d.formatted_date);})
                        .y(function(d){return y(d.precipProbability);});
                }

                //see if this already exists, just transition to the new data
                svg = d3.select('#' + selector + ' svg');
                if(!svg.empty()){
                    // update graph
                    svg = d3.select('#' + selector + ' svg').transition();
                    svg.select(".x.axis")
                        .duration(750)
                        .call(xAxis);
                    svg.select(".y.axis")
                        .duration(750)
                        .call(yAxis);
                    if (selector === 'temp-chart'){
                        svg.select(".max-line")
                            .duration(750)
                            .attr("d", maxLine(data));
                        svg.select(".min-line")
                            .duration(750)
                            .attr("d", minLine(data));
                    } else {
                        svg.select(".rain-line")
                            .duration(750)
                            .attr("d", rainLine(data));
                    }
                    return;
                }

                // first render
                svg = d3.select("#" + selector).append("svg")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 " + containerWidth + " " + containerHeight)
                    .attr('width', '100%')
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // add data lines
                if(selector == 'temp-chart'){
                    svg.append("path")
                        .attr("class", "max-line")
                        .attr("d", maxLine(data))
                        .attr("fill", "none")
                        .attr("stroke", "red")
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-linecap", "round")
                        .attr("stroke-width", 2);
                    
                    svg.append("path")
                        .attr("class", "min-line")
                        .attr("d", minLine(data))
                        .attr("fill", "none")
                        .attr("stroke", "steelblue")
                        .attr("stroke-width", 2);
                } else {
                    svg.append("path")
                        .attr("class", "rain-line")
                        .attr("d", rainLine(data))
                        .attr("fill", "none")
                        .attr("stroke", "green")
                        .attr("stroke-width", 2);
                }

                // add x & y axis
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + (height) + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end");
            };

            // daily forecast gets updated on data load and on 'show more'
            scope.$watch('dailyForecast', function(newVal, oldVal, scope) {
                if (newVal !== undefined && newVal !== null){
                    // can't access width of container right away
                    // need to add a delay
                    $timeout(function(){
                        scope.renderChart('temp-chart');
                        scope.renderChart('precip-chart');
                        scope.rendered = true;
                    });
                }
            }, true);

        }
    };
}]);