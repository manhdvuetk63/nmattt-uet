var ellipticApp = (function() {
  'use strict';

  var c;
  var points;
  var activeTooltip;
  var plotSvg;
  var w = 800,
      h = 500;

  function _clearNotes() {
    var notes = document.getElementById('notes');
    if (notes) notes.innerHTML = '';
  }

  function _addNote(noteClass, noteText) {
    var notes = document.getElementById('notes');
    if (notes) {
      var noteDiv = document.createElement('div');
      var noteP = document.createElement('p');
      noteP.appendChild(document.createTextNode(noteText));
      noteDiv.appendChild(noteP);
      noteDiv.className = noteClass;
      notes.appendChild(noteDiv);
    }
  }

  return {
    setSvg: function(svg) {
      plotSvg = svg;
    },

    init: function() {

      var a = document.getElementById('a').value;
      var b = document.getElementById('b').value;
      var r = document.getElementById('r').value;

      c = curve( a, b, r );
      points = c.getPoints();
      var plotPoints = points.slice(1);
      var i, j, rVals = [];
      for (i=0; i<r; i++) { rVals.push(i); }

      var margin = {top: 20, right: 60, bottom: 30, left: 40},
          width  = w - margin.left - margin.right,
          height = h - margin.top - margin.bottom;

      var yScale = d3.scaleLinear().domain([0,r-1]).range([height, 0]);
      var xScale = d3.scaleLinear().domain([0,r-1]).range([0, width]);

      var tickMax = 31;
      var xAxis = d3.axisBottom(xScale).ticks(Math.min(r-1, tickMax));
      var yAxis = d3.axisLeft(yScale).ticks(Math.min(r-1, tickMax));

      function customXAxis(g) {
        g.call(xAxis);
        g.selectAll(".tick:not(:first-of-type) line").attr("class", "helpline").attr("y1", -1).attr("y2", -1*height);
        // g.selectAll(".tick text").attr("x", -20).attr("dy", 0);
      }

      function customYAxis(g) {
        g.call(yAxis);
        g.selectAll(".tick:not(:first-of-type) line").attr("class", "helpline").attr("x1", 1).attr("x2", width);
        // g.selectAll(".tick text").attr("x", -20).attr("dy", 0);
      }

      d3.select(".graphchart").selectAll("*").remove();

      // setup graphchart
      var chart = d3.select(".graphchart")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          chart.selectAll('.helplineH')
                      .data(rVals)
                      .enter()
                      .append('line')
                        .attr('class', 'helplineH')
                        .attr('x1', '0')
                        .attr('y1', function(index) { return yScale(index); })
                        .attr('x2', xScale(r-1))
                        .attr('y2', function(index) { return yScale(index); });

          chart.selectAll('.helplineV')
                      .data(rVals)
                      .enter()
                      .append('line')
                        .attr('class', 'helplineV')
                        .attr('x1', function(index) { return xScale(index); })
                        .attr('y1', yScale(0))
                        .attr('x2', function(index) { return xScale(index); })
                        .attr('y2', yScale(r-1));

          chart.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(customXAxis);

          chart.append("g")
              .attr("class", "y axis")
              .call(customYAxis);

      var pointPlotGroup = chart.selectAll(".pcGroup")
            .data(plotPoints);

      var plotPoint =  pointPlotGroup.enter()
                                     .append("g")
                                     .attr('class', 'pcGroup');

                      pointPlotGroup.exit().remove();

           plotPoint.append("circle")
           .attr('class', 'pcircle')
           .attr("cy", function(p) { return yScale(p.y); })
           .attr("cx", function(p) { return xScale(p.x); })
           .attr("r",  function(p) { return Math.min(Math.min(xScale(0.3),yScale(0.3)),6); })
           .attr('onclick', function(p) {
             return 'ellipticApp.showTip(\"' + pointToTipId(p) + '\", \"' + p.toString() + '\")';
           });
/*           .attr('onmouseout', function(p) {
             return 'ellipticApp.hideTip(evt, \"' + pointToTipId(p) + '\")';
           });*/

           function pointToTipId(p) { return "tipX" + p.x + "Y" + p.y; }

      var plotPointTip = plotPoint.append('g')
                                  .attr('id', function(p) { return pointToTipId(p); })
                                  .attr("transform", function(p) { return "translate(" + (xScale(p.x)+8) + "," + (yScale(p.y)-8) + ")"; })
                                  .attr('visibility', 'hidden');

        plotPointTip.append("rect")
             .attr('class', 'tooltip')
             .attr('rx', 4)
             .attr('ry', 4)
             .attr('width', 52)
             .attr('height', 16);

        plotPointTip.append('text')
                    .attr('class', 'tttext')
                    .attr('x', '10')
                    .attr('y', '11.5')
                    .text(function(p) { return p.toString(); });

        d3.select('.graphchart')
          .append('g')
          .attr("transform", "translate(" + 9/10*width + "," + (margin.top-5) + ")")
          .append('text')
            .text('y^2 = x^3 + ' + a + 'x + ' + b + '  mod ' + r);

        d3.select('.graphchart')
          .append('g')
          .attr("transform", "translate(" + 1/20*width + "," + (margin.top-5) + ")")
          .append('text')
            .text('' + points.length + ' points (infinity not shown)');

        // build addition table
        // d3 table creation sucks, do it the old way
        var t = c.getAdditionTable();
        var tabString = '<table><tr><td class=\"tabhead\">+</td>';
        for (i=0; i<points.length; i++) {
          tabString += '<td class=\"tabhead\" onclick=\"ellipticApp.showTip(\'' + pointToTipId(points[i]) + '\', \'' + points[i].toString() + '\' )\">' + points[i].toString() + '</td>';
        }
        tabString += '</tr>';

        for (i=0; i<points.length; i++) {
          tabString += '<tr><td class=\"tabhead\" onclick=\"ellipticApp.showTip(\'' + pointToTipId(points[i]) + '\', \'' + points[i].toString() + '\' )\">' + points[i].toString() + '</td>';
          for (j=0; j<points.length; j++) {
            tabString += '<td onclick="ellipticApp.showTip(\'' + pointToTipId(t[i][j]) + '\', \'' + t[i][j].toString() + '\' )">' + t[i][j].toString() + '</td>';
          }
          tabString += "</tr>";
        }
        tabString += "</table>";

        document.getElementById('genspace').innerHTML =
          '<p>Click/tap on a point in (table or plot) to show details about that point.</p>';
        document.getElementById('tabspace').innerHTML = tabString;

        _clearNotes();
        if (!c.rIsPrime()) {
          _addNote('warning', '\\(r = ' + r + '\\) is not a prime. Hence, \\(\\mathbb{F}_{' + r + '}\\) is not a field!');
        }
        if (!c.isNonSingular()) {
          _addNote('info', 'Your curve is not non-singular.');
        }
        // force MathJax typesetting
        if (MathJax) {
          MathJax.Hub.Typeset();
        }
    },

    getPointDetails: function(p) {
      var subgroup = p.generate();
      if (!subgroup) {
        // curve does not allow point addition
        return {
          name: p.toString(),
          subgroupOrder: 'none',
          inverse: 'none',
          subgroup: 'No subgroup determinable. Check curve parameters!',
        };
      }
      return {
        name: p.toString(),
        subgroupOrder: subgroup.length,
        inverse: (subgroup.length > 1) ? subgroup[subgroup.length-2].toString() : p.toString(),
        subgroup: subgroup.map( function(q) { return q.toString(); } )
                          .join( (MathJax) ? ' \\( \\to \\) ' : ' => '),
      };
    },

    showTip: function(id, p) {
      if (activeTooltip) {
        ellipticApp.hideTip(activeTooltip);
      }
      activeTooltip = id;

      //  var i, tipBox = evt.target.ownerDocument.getElementById(id);
      var i, tipBox = plotSvg.getElementById(id);
      if (tipBox) { // might be null, if infty is clicked in table
        tipBox.setAttributeNS(null,"visibility","visible");
        var boxContents = tipBox.childNodes;
        for (i=0; i<boxContents.length; i++) {
          // console.log(boxContents[i].tagName);
          if (boxContents[i].tagName == 'text') {
            boxContents[i].innerHTML = p;
            break;
          }
        }
      }

      // now update external details box
      var details = ellipticApp.getPointDetails(c.getPoint(p));
      tipBox = document.getElementById('genspace');
      tipBox.innerHTML = '<table style="max-width: ' + (w-20) + 'px;">' +
                         '<tr><td class="tabhead">Point:</td><td><div style="min-width: 4em;">' + details.name + '</div></td></tr>' +
                         '<tr><td class="tabhead">Inverse:</td><td>' + details.inverse + '</td></tr>' +
                         '<tr><td class="tabhead">Order of subgroup:</td><td>' + details.subgroupOrder + '</td></tr>' +
                         '<tr><td class="tabhead">Generated subgroup:</td><td>' + details.subgroup + '</td></tr>' +
                         '</table>';
      // force MathJax typesetting
      if (MathJax) {
        MathJax.Hub.Typeset();
      }
    },

    hideTip: function(id) {
      var tipBox = plotSvg.getElementById(id);
      if (tipBox) {
        tipBox.setAttributeNS(null,"visibility","hidden");
      }
    },

    clearNotes: _clearNotes,
    addNote: _addNote,
  };
}());
