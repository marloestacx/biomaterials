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

function getData() {
  d3.json("data.json", function (error, root) {
    var data = cluster.nodes(root);

    // console.log(data);

    // List of groups (here I have one group per column)
    var allGroup = d3
      .map(data, function (d) {
        return d.base;
      })
      .keys();

    console.log(allGroup);

    // add the options to the button
    d3.select("#selectButton")
      .selectAll("myOptions")
      .data(allGroup)
      .enter()
      .append("option")
      .text(function (d) {
        return d;
      }) // text showed in the menu
      .attr("value", function (d) {
        return d;
      }); // corresponding value returned by the button

    makeDendogram(data);
  });
}
getData();

function makeDendogram(data) {
  var svg = d3
    .select("#dataviz")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  console.log(data);

  var links = cluster.links(data);

  var link = svg.selectAll(".link").data(links);

  link.enter().append("path").attr("class", "link").attr("d", diagonal);

  var node = svg.selectAll(".node").data(data);

  node
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
      if (d.base === "plants" || d.headbase === "plants") {
        return "green";
      } else if (d.base === "animal" || d.headbase === "animal") {
        return "red";
      } else if (d.base === "petrol-based" || d.headbase === "petrol-based") {
        return "black";
      } else if (d.base === "microbial" || d.headbase === "microbial") {
        return "lightgreen";
      } else if (d.base === "inorganic" || d.headbase === "inorganic") {
        return "orange";
      } else if (
        d.base === "chemical compounds" ||
        d.headbase === "chemical compounds"
      ) {
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

      svginfo
        .append("circle")
        .attr("cx", 300)
        .attr("cy", 80)
        .attr("r", 37.5)
        .style("fill", function () {
          if (d.base === "plants" || d.headbase === "plants") {
            return "green";
          } else if (d.base === "animal" || d.headbase === "animal") {
            return "red";
          } else if (
            d.base === "petrol-based" ||
            d.headbase === "petrol-based"
          ) {
            return "black";
          } else if (d.base === "microbial" || d.headbase === "microbial") {
            return "lightgreen";
          } else if (d.base === "inorganic" || d.headbase === "inorganic") {
            return "orange";
          } else if (
            d.base === "chemical compounds" ||
            d.headbase === "chemical compounds"
          ) {
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

  // When the button is changed, run the updateChart function
  d3.select("#selectButton").on("change", function (d) {
    // d3.select("svg").remove();
    // recover the option that has been chosen
    const selectedOption = d3.select(this).property("value");

    // node.exit().remove();
    update(selectedOption);
  });
}

function update(selectedGroup) {
  d3.selectAll("svg").remove();

  d3.json("data.json", function (error, root) {
    var newData = cluster.nodes(root);

    var dataFilter = newData.filter(function (d) {
      return d.base == selectedGroup;
    });

    if (selectedGroup == "all") {
      dataFilter = newData;
    }

    makeDendogram(dataFilter);
    console.log(dataFilter);
  });
}
