var margin = { top: 20, right: 120, bottom: 20, left: 120 },
  width = 960 - margin.right - margin.left,
  height = 1800 - margin.top - margin.bottom;
var cluster = d3.layout.cluster().size([height, width - 200]);

var diagonal = d3.svg.diagonal().projection(function (d) {
  return [d.y, d.x];
});

var div = d3.select("#info").style("opacity", 0);

div.on("mouseout", function (d) {
  div.transition().duration("50").attr("opacity", "1");

  div.transition().duration(500).style("opacity", 0);
  div.attr("class", "hide");
});

// Creates sources <svg> element
const svginfo = d3.select("#shapes");

// var tooltipWithContent = d3.selectAll("#info, #info *");
// function equalToEventTarget() {
//   return this == d3.event.target;
// }

// d3.select("body").on("click", function () {
//   var outside = tooltipWithContent.filter(equalToEventTarget).empty();
//   if (d3.select("#info").classed()[0][0].className == "info") {
//     div.attr("class", "hide");
//   }
// });

// const svg = document.querySelector(".svg");
// const circle = document.querySelector(".circle");

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data.json", function (error, root) {
  var nodes = cluster.nodes(root);
  var links = cluster.links(nodes);
  var link = svg
    .selectAll(".link")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", diagonal);

  var node = svg
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")

    .attr("transform", function (d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  node
    .append("circle")
    .attr("r", 4.5)
    .style("fill", function (d) {
      if (d.base === "plants") {
        return "green";
      } else if (d.base === "animal") {
        return "red";
      } else if (d.base === "petrol-based") {
        return "black";
      } else if (d.base === "microbial") {
        return "lightgreen";
      } else if (d.base === "inorganic") {
        return "orange";
      } else if (d.base === "chemical compounds") {
        return "yellow";
      }
    });

  node
    .append("text")
    .attr("dx", function (d) {
      return d.children ? -8 : 8;
    })
    .attr("dy", 3)
    .on("click", function (d) {
      d3.select(this).transition().duration("50").attr("opacity", ".85");
      div.transition().duration(200).style("opacity", 1);
      d3.select("#name").text(`Name: ${d.name}`);
      d3.select("#functions").text(`Functions: ${d.functions}`);
      console.log(d);
      svginfo
        .append("circle")
        .attr("cx", 300)
        .attr("cy", 80)
        .attr("r", 37.5)
        .style("fill", function () {
          if (d.base === "plants") {
            return "green";
          } else if (d.base === "animal") {
            return "red";
          } else if (d.base === "petrol-based") {
            return "black";
          } else if (d.base === "microbial") {
            return "lightgreen";
          } else if (d.base === "inorganic") {
            return "orange";
          } else if (d.base === "chemical compounds") {
            return "yellow";
          }
        });
      div.attr("class", "info");
    })
    .style("text-anchor", function (d) {
      return d.children ? "end" : "start";
    })
    .text(function (d) {
      return d.name;
    });
});
