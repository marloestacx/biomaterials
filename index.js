var margin = { top: 20, right: 120, bottom: 20, left: 120 },
  width = 1500 - margin.right - margin.left,
  height = 2100 - margin.top - margin.bottom;
var cluster = d3.layout.cluster().size([height, width - 500]);

// var diagonal = d3.svg.diagonal().projection(function (d) {
//   return [d.y, d.x];
// });

var div = d3.select("#info").style("opacity", 0);

// d3.select("#close").on("click", close);

// Creates sources <svg> element
const svginfo = d3.select("#shapes");

var data;
var selectedOption;

function getData() {
  d3.json("data.json", function (root) {
    data = cluster.nodes(root);

    // List of groups (here I have one group per column)
    var allGroup = d3
      .map(data, function (d) {
        return d.base;
      })
      .keys();

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

    // List of groups (here I have one group per column)
    var allGroupCat = d3
      .map(data, function (d) {
        return d.category;
      })
      .keys();

    // add the options to the button
    d3.select("#selectCat")
      .selectAll("myOptions")
      .data(allGroupCat)
      .enter()
      .append("option")
      .text(function (d) {
        if (d != "undefined") {
          return d;
        }
      }) // text showed in the menu
      .attr("value", function (d) {
        if (d != "undefined") {
          return d;
        }
      }); // corresponding value returned by the button

    makeDendogram(data);
  });
}
getData();

function makeDendogram(data) {
  var diagonal = d3.svg.diagonal().projection(function (d) {
    // console.log(d);
    return [d.y, d.x];
  });
  console.log(diagonal);
  var svg = d3
    .select("#dataviz")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
    .attr("class", "text")
    //popup
    .on("click", click)

    .style("text-anchor", function (d) {
      return d.children ? "end" : "start";
    })
    .text(function (d) {
      return d.name;
    });

  //search
  d3.select(".button").on("click", function () {
    console.log("click");

    d3.selectAll(".text")
      .style("fill", "black")
      .attr("font-weight", 100)
      .attr("font-size", "inherit");

    var txtName = d3.select("#txtName").node().value;

    var search = d3.selectAll(".text").filter(function (d) {
      return d.name.match(txtName);
    });

    search
      .style("fill", "#B7336C")
      .attr("font-weight", 700)
      .attr("font-size", "16pt");
  });

  // When the button is changed, run the updateChart function
  d3.select("#selectButton").on("change", function (d) {
    // recover the option that has been chosen
    selectedOption = d3.select(this).property("value");

    // node.exit().remove();
    update(selectedOption);
  });

  // When the button is changed, run the updateChart function
  d3.select("#selectCat").on("change", function (d) {
    // recover the option that has been chosen
    const selectedCat = d3.select(this).property("value");

    // node.exit().remove();
    updateCat(selectedCat);
  });

  //click on name
  function click(d) {
    div
      .transition()
      .duration("50")
      .attr("opacity", ".85")
      .style("opacity", 1)
      .style("top", function () {
        if (d.name == d.category) {
          return d.x + "px";
        } else {
          return d.parent.x + "px";
        }
      });

    d3.select(".category").select("img").remove();
    d3.select(".category").select("p").remove();
    //icon
    d3.select(".category")
      .append("img")
      .attr("src", "images/" + d.base + ".svg")
      .attr("width", 40)
      .attr("height", 40);

    d3.select("#name").text(`${d.name}`);

    if (d.category != "all") {
      d3.select(".category").append("p").text(`${d.base} ➤ ${d.category}`);
    } else {
      d3.select(".category").append("p").text(`${d.base}`);
    }

    if (d.origin != null) {
      d3.select("#origin").text(`${d.origin}`);
    } else {
      d3.select("#origin").text(" ");
    }

    if (d.functions != null) {
      d3.select("#functions").text(`${d.functions}`);
    } else if (d.children[0].functions != null) {
      d3.select("#functions").text(`${d.children[0].functions}`);
    } else if (d.children[0].children[0].functions != null) {
      d3.select("#functions").text(`${d.children[0].children[0].functions}`);
    } else {
      d3.select("#functions").text(" ");
    }

    d3.select("#close")
      .text("close")
      .on("click", function () {
        div.attr("class", "hide");
      });

    var newData = data.filter(function (data) {
      d3.selectAll(".card").remove();
      if (d.category != "all") {
        return (
          (data.category == d.category) &
          (data.base == d.base) &
          (data.name != d.name)
        );
      } else {
        return (data.base == d.base) & (data.category != d.category);
      }
    });

    //cards
    var cards = d3.select("#cards");
    var extrainfo = cards.selectAll("text").data(newData);
    extrainfo
      .enter()
      .append("div")
      .attr("class", "card")
      .attr("width", 370)
      .attr("height", 140)
      .append("text")
      .attr("class", "name")
      .on("click", click)
      .attr("width", "60px")
      .attr("height", "60px")
      .text(function (e) {
        return e.name;
      });

    extrainfo.append("text").text(function (d) {
      if ((d.name !== d.category) & (d.parent.base != "all")) {
        return d.category;
      }
    });

    //remove existing circle
    svginfo.select("circle").remove();
    //make new circle
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
    div.attr("class", "info");
  }
}

var dataFilter;

// update catagory filter
function update(selectedGroup) {
  d3.select("#dataviz")
    .selectAll("svg")
    .transition() // apply a transition
    .ease("easeLinear") // control the speed of the transition
    .duration(400)
    .style("opacity", 0)
    .remove();

  d3.json("data.json", function (root) {
    if (selectedGroup == "all") {
      dataFilter = data;
    } else {
      var newData = root.children.filter(function (d) {
        return d.base == selectedGroup;
      });
      width = 1200;
      var cluster = d3.layout.cluster().size([600, width - 500]);
      dataFilter = cluster.nodes(newData[0]);
    }

    makeDendogram(dataFilter);
  });
}

//update subcategory filter
function updateCat(selectedCat) {
  d3.select("#dataviz")
    .selectAll("svg")
    .transition() // apply a transition
    .ease("easeLinear") // control the speed of the transition
    .duration(400)
    .style("opacity", 0)
    .remove();

  //if category filter = empty use old data
  if (dataFilter == null) {
    newData = data.filter(function (d) {
      return d.category == selectedCat;
    });
  } else {
    newData = dataFilter.filter(function (d) {
      return d.category == selectedCat;
    });
  }
  if (selectedCat == "all") {
    newData = dataFilter;
  }
  makeDendogram(newData);
}
