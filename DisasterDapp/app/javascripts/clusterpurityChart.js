//Developer: Narayana Swamy
//emailID: narayanaswamy14@gmail.com

d3 = d3 || {};
(function () {
    "use strict";

    d3.clusterpuritychart = function () {

        var containerID,
            width,
            height,
            originalData,
            ParentG, LegendG, legendFilter = [],
            circleR = 0,
            innerRadius = 0, eleInRow, noOfCategories, fixAngleLayout,
            colorScale = d3.scale.category10(),
            radiusScale = d3.scale.linear(),
            legendObj = d3.legend(),
            scale_temp = d3.scale.linear(),
            originalData2,
            MinMaxTotal = 0,
            margin = { top: 20 },
            totalCount = 0,
            colorMap = {};

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) {
                return d.ele;
            });

        var custLayout = d3.custumPieLayout()
            .sort(null)
            .value(function (d) {
                return d.ele;
            });

        var arc = d3.svg.arc()
            .innerRadius(innerRadius);

        var chart = function (selection) {

            if (fixAngleLayout)
                custLayout.fixAngle((360 / (noOfCategories - legendFilter.length)) / (360 / (2 * Math.PI)));

            width = parseInt(d3.select('#' + containerID).style('width'));
            height = parseInt(d3.select('#' + containerID).style('height'));

            legendObj.legendOnclickMthod(chart.legendFilter);

            selection.each(function (data) {

                originalData = data;

                data.forEach(function (d) {
                    d.values.forEach(function (e) {
                        e.total = d.total;
                        e.color = colorScale(e.type);
                        if (!colorMap.hasOwnProperty(e.type))
                            colorMap[e.type] = { 'key': e.type, 'color': e.color };
                    })
                });

                var length = data.length, eleInRow = Math.ceil(Math.sqrt(length));
                var container = d3.select(this);
                width = width - 100;
                var temp_width = data.length > eleInRow ? width - 0.5 * (width / eleInRow) : width;
                circleR = d3.min([temp_width, (height - margin.top)]) / eleInRow;
                var x_offset = 0, y_offset = 0;

                radiusScale
                    .domain([0, d3.extent(data, function (d) { return d.total })[1]])
                    .range([(circleR / 2) * (1 / data.length), circleR / 2]);

                MinMaxTotal = radiusScale.domain();

                container.attr('width', (circleR * eleInRow + 0.5 * circleR) + 200)
                    .attr('height', circleR * eleInRow + margin.top)

                if (!ParentG) {
                    ParentG = container.append('g').attr('class', 'parentG')
                        .attr('transform', 'translate(' + (data.length > eleInRow ? 0.5 * circleR : 0) + ',' + margin.top + ')');
                    LegendG = container.append('g').attr('class', 'legendG');
                }

                LegendG.attr('transform', 'translate(' + (width + 50) + ',' + ((circleR * eleInRow / 2) - (Object.keys(colorMap).length * 20) / 2) + ')')
                    .datum(colorMap)
                    .call(legendObj);

                var circleG = ParentG
                    .attr('transform', 'translate(' + (data.length > eleInRow ? 0.5 * circleR : 0) + ',' + margin.top + ')')
                    .selectAll('.circleG')
                    .data(data
                        .sort(function (a, b) {
                            if (a.total < b.total)
                                return 1;
                            else if (a.total > b.total)
                                return -1;
                            else
                                return 0;
                        })
                    );

                circleG.enter()
                    .append('g')
                    .attr('class', 'circleG')
                    .attr('transform', function (d, i) {
                        return 'translate(' + ((i % eleInRow) * (circleR)) + ',' + (Math.floor(i / eleInRow) * circleR) + ')';
                    })
                    .append('circle')
                    .attr('r', 0)
                    .attr('cx', circleR / 2)
                    .attr('cy', circleR / 2)
                    .style('fill', 'white')
                    .style('stroke', 'black')
                    .style('stroke-width', '1px');

                circleG.exit().transition().duration(0).remove();

                circleG
                    .attr('transform', function (d, i) {
                        if (Math.floor(i / eleInRow) % 2 === 1) {
                            x_offset = 0.5 * circleR;
                            y_offset = 0.13 * circleR * Math.floor(i / eleInRow);
                        }
                        else {
                            x_offset = 0;
                            if (Math.floor(i / eleInRow) === 0)
                                y_offset = 0;
                            else
                                y_offset = 0.13 * circleR * Math.floor(i / eleInRow);
                        }
                        return 'translate(' + (((i % eleInRow) * (circleR)) - x_offset) + ',' + ((Math.floor(i / eleInRow) * circleR) - y_offset) + ')';
                    });

                circleG
                    .selectAll('circle')
                    .attr('r', 0)
                    .attr('cx', circleR / 2)
                    .attr('cy', circleR / 2)
                    .on('mouseover', function (d) {
                        d3.select(this).style('stroke-width', '2px')
                    })
                    .on('mouseout', function (d) {
                        d3.select(this).style('stroke-width', '1px')
                    })
                    .on('click', function (d) {
                        d3.select(this).style('stroke-width', '1px')
                        if (originalData.length == 1)
                            d3.select('#' + containerID).select('svg').datum(originalData2).call(chart);
                        else {
                            originalData2 = originalData;
                            d3.select('#' + containerID).select('svg').datum([d]).call(chart);
                        }
                    })
                    .transition()
                    .duration(1000)
                    .attr('r', circleR / 2);

                circleG.each(chart.renderPieChart);

            })
            d3.select(window).on('resize.' + containerID, chart.resize)
        };

        chart.containerID = function (_) {
            containerID = _;
            return chart;
        };
        chart.noOfCategories = function (_) {
            noOfCategories = _;
            return chart;
        };
        chart.fixAngleLayout = function (_) {
            fixAngleLayout = _;
            return chart;
        };
        chart.legendFilter = function (_) {
            if (legendFilter.indexOf(_) == -1)
                legendFilter.push(_);
            else
                legendFilter.splice(legendFilter.indexOf(_), 1);

            d3.select('#' + containerID).select('svg').datum(originalData).call(chart);

            return chart;
        };
        chart.change = function (_) {
            chart.fixAngleLayout(_);
            d3.select('#' + containerID).select('svg').datum(originalData).call(chart);
            return chart;
        };

        chart.resize = function () {
            d3.select('#' + containerID).select('svg').datum(originalData).call(chart);
        };

        chart.renderPieChart = function (data) {

            scale_temp
                .domain(d3.extent(data.values, function (d) { return d.ele; }))
                .range([parseInt(radiusScale(data.total) * 0.2), parseInt(radiusScale(data.total)) * (originalData.length == 1 ? 0.8 : 1.2)]);

            arc.outerRadius(function (d) {
                if (fixAngleLayout) {
                    return scale_temp(d.value);
                }
                else {
                    return (radiusScale(d.data.total)) * 0.8;
                }
            });

            var newData = data.values
                .filter(function (d) {
                    if (legendFilter.indexOf(d.type) === -1)
                        return true;
                    else
                        return false;
                });

            var paths = d3.select(this)
                .selectAll('path')
                .data(fixAngleLayout ? custLayout(newData) : pie(newData));

            paths.enter()
                .append("path")
                .attr('transform', function (d, i) {
                    return 'translate(' + (circleR / 2) + ',' + (circleR / 2) + ')';
                })
                .attr("fill", function (d) {
                    return d.data.color;
                })
                .attr("stroke", "gray")
                .attr("class", "outlineArc")
                .attr("d", arc)
                .on('click', function (d) {
                    console.log(originalData)
                    if (originalData.length == 1)
                        d3.select('#' + containerID).select('svg').datum(originalData2).call(chart);
                    else {
                        originalData2 = originalData;
                        d3.select('#' + containerID).select('svg').datum([d.parentData]).call(chart);
                    }
                })
                .each(function (d) {
                this._current = d;
                    d.parentData = data;
                });

            paths.exit().transition().duration(1000).remove();

            paths
                .attr('transform', function (d, i) {
                    return 'translate(' + (circleR / 2) + ',' + (circleR / 2) + ')';
                })
                .attr("fill", function (d) {
                    return d.data.color;
                })
                .transition()
                .duration(1000)
                .attrTween("d", arcTween)
                .each('end', function (d) {
                this._current = d;
                    d.parentData = data;
                });

            function arcTween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(10);
                return function (t) {
                    return arc(i(t));
                };
            }

        }

        return chart;
    };

    d3.custumPieLayout = function () {
        var sort, fixAngle,
            valueFun,
            sortcomparator,
            padAngle = 0;

        var pieLayoutObj = function (startAngle, endAngle, padAngle, value, data) {
            this.startAngle = startAngle;
            this.endAngle = endAngle;
            this.padAngle = padAngle;
            this.value = value;
            this.data = data;
        };

        var layout = function (data) {

            if (sortcomparator)
                data.sort(sortcomparator);

            var previousEndAngle = 0,
                outputObj = [];

            data.forEach(function (d) {
                outputObj.push(new pieLayoutObj(previousEndAngle, previousEndAngle + fixAngle, padAngle, valueFun(d), d));
                previousEndAngle = previousEndAngle + fixAngle;
            });

            return outputObj;

        };

        layout.sort = function (_) {
            //if(typeof _ !== 'function') return;
            sortcomparator = _;
            return layout;
        }
        layout.fixAngle = function (_) {
            if (!arguments.length) return;
            fixAngle = _;
            return layout;
        }
        layout.value = function (_) {
            if (typeof _ !== 'function') return;
            valueFun = _;
            return layout;
        }
        layout.padAngle = function (_) {
            padAngle = _;
            return layout;
        }

        return layout;
    };

    d3.legend = function () {

        var legendOnclickMthod,
            legendOnHoverMthod,
            legendOnmouseHoverMthod,
            legendOnmouseOutMthod,
            legendOndblclickMthod;

        var chart = function (selection) {

            selection.each(function (data) {


                var legend_container = d3.select(this);

                var wrap = legend_container.selectAll('.legendChart').data([data]);
                var wrapEnter = wrap.enter().append('g').attr('class', 'legendChart');
                var gEnter = wrapEnter.append('g');
                var g = wrap.select('g')
                    .attr('transform', 'translate(10,30)');

                wrapEnter.append('text').attr('x', 0).attr('y', 0).text('Interactive legend')
                var g_ci = g.selectAll('circle')
                    .data(function (d) {
                        return Object.keys(d)
                    });

                g_ci.exit().transition().remove();

                g_ci.enter()
                    .append('circle')
                    .attr('r', function (d) { return 10; })
                    .style('fill', function (d) { return data[d].color })
                    .style('opacity', 1)
                    .style('stroke', function (d) { return data[d].color })
                    .style('stroke-width', 2)
                    .attr('cx', function (d, i) {
                        return 0;
                    })
                    .attr('cy', function (d, i) {

                        return Math.floor(i) * 30;
                    })
                    .on('mouseout', function (d) {
                        d3.select(this).style('stroke-width', 2)
                            .style('stroke', function (d) { return data[d].color });
                    })
                    .on('mouseover', function (d) {
                        d3.select(this).style('stroke-width', 3)
                            .style('stroke', function (d) { return 'black' });
                    })
                    .on('click', function (d) {
                        if (d3.select(this).classed("disable_")) {
                            d3.select(this).style("fill", data[d].color)
                                .classed("disable_", false);
                            legendOnclickMthod(data[d].key, true);
                        }
                        else {
                            d3.select(this).classed("disable_", true)
                                .style("fill", 'white');
                            legendOnclickMthod(data[d].key, false);
                        }
                    });


                g_ci.style('fill', function (d) {
                    if (d3.select(this).style('fill') == 'rgb(255, 255, 255)')
                        return 'white';
                    else
                        return data[d].color;
                })
                    .style('stroke', function (d) { return data[d].color })
                    .transition()
                    .duration(1000)
                    .attr('cx', function (d, i) {
                        return 0;
                    })
                    .attr('cy', function (d, i) {

                        return Math.floor(i) * 30;
                    });

                var g_txt = g.selectAll('text')
                    .data(function (d) { return Object.keys(d) });

                g_txt.exit().transition().remove();

                g_txt.enter()
                    .append('text');

                g_txt.text(function (d) { return data[d].key.substring(0, 10) })
                    .attr('font-size', '18px')
                    .transition()
                    .duration(1000)
                    .attr('x', function (d, i) {
                        return 30;
                    })
                    .attr('y', function (d, i) {
                        return i * 30 + 5;
                    })

            });

            //return chart;
        };
        chart.legendOnclickMthod = function (_) {
            if (!arguments.length) return legendOnclickMthod;
            if (typeof _ != 'function') return legendOnclickMthod;
            legendOnclickMthod = _;
            return chart;
        };
        chart.legendOndblclickMthod = function (_) {
            if (!arguments.length) return legendOndblclickMthod;
            if (typeof _ != 'function') return legendOndblclickMthod;
            legendOndblclickMthod = _;
            return chart;
        };
        chart.legendOnmouseOutMthod = function (_) {
            if (!arguments.length) return legendOnmouseOutMthod;
            if (typeof _ != 'function') return legendOnmouseOutMthod;
            legendOnmouseOutMthod = _;
            return chart;
        };
        chart.legendOnmouseHoverMthod = function () {
            if (!arguments.length) return legendOnmouseHoverMthod;
            if (typeof _ != 'function') return legendOnmouseHoverMthod;
            legendOnmouseHoverMthod = _;
            return chart;
        };

        return chart;

    };

})()