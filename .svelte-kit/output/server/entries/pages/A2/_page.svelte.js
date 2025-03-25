import { p as push, e as ensure_array_like, d as stringify, c as pop, f as bind_props, h as copy_payload, i as assign_payload } from "../../../chunks/index.js";
import * as d3 from "d3";
/* empty css                                                */
import { a as attr } from "../../../chunks/attributes.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function Scatter($$payload, $$props) {
  push();
  const {
    movies,
    x,
    y,
    size,
    height = 500,
    width = 600
  } = $$props;
  let selectedMovie = void 0;
  const margin = {
    top: 15,
    bottom: 50,
    left: 60,
    // Increased for better y-axis labels
    right: 10
  };
  const usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left
  };
  const sizeRange = [3, 15];
  function getScale(attrName, axis, movies2) {
    if (movies2.length === 0) return null;
    let range = [];
    if (axis === "x") range = [usableArea.left, usableArea.right];
    if (axis === "y") range = [usableArea.bottom, usableArea.top];
    if (axis === "size") range = sizeRange;
    if (typeof movies2[0][attrName] === "string") {
      return d3.scaleBand().domain(movies2.map((d) => d[attrName])).range(range).padding(0.2);
    } else if (typeof movies2[0][attrName] === "number") {
      return d3.scaleLinear().domain(d3.extent(movies2, (d) => d[attrName])).range(range);
    } else if (movies2[0][attrName] instanceof Date) {
      return d3.scaleTime().domain(d3.extent(movies2, (d) => d[attrName])).range(range);
    } else {
      return null;
    }
  }
  const xScale = getScale(x, "x", movies);
  const yScale = getScale(y, "y", movies);
  const sizeScale = getScale(size, "size", movies);
  const each_array = ensure_array_like(movies);
  $$payload.out += `<svg${attr("width", width)}${attr("height", height)} class="svelte-mz9u0u"><g class="points svelte-mz9u0u"><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
    let movie = each_array[$$index_1];
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<circle${attr("cx", xScale ? xScale(movie[x]) : usableArea.left)}${attr("cy", yScale ? yScale(movie[y]) : usableArea.bottom)}${attr("r", sizeScale ? sizeScale(movie[size]) : sizeRange[0])}${attr("fill", movie === selectedMovie ? "steelblue" : "transparent")} stroke="steelblue" stroke-width="2"${attr("opacity", movie === selectedMovie ? 1 : 0.5)} class="svelte-mz9u0u"></circle>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></g><g${attr("transform", `translate(0, ${stringify(usableArea.bottom)})`)}></g><g${attr("transform", `translate(${stringify(usableArea.left)}, 0)`)}></g></svg> <div class="selectedInfo svelte-mz9u0u">${escape_html("Click on a point to see details")}</div>`;
  pop();
}
function Line($$payload, $$props) {
  push();
  let {
    data = [],
    yearRange = void 0,
    height = 150,
    width = 600
  } = $$props;
  const margin = { top: 15, bottom: 50, left: 30, right: 10 };
  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left
  };
  const xScale = d3.scaleTime().domain(d3.extent(data.map((d) => new Date(d.x)))).range([usableArea.left, usableArea.right]);
  const yScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d.y) || 10]).range([
    usableArea.bottom,
    // Ensuring a valid range
    usableArea.top
  ]);
  const lineGenerator = d3.line().x((d) => xScale(new Date(d.x))).y((d) => yScale(d.y)).curve(d3.curveBasis);
  const path = () => lineGenerator(data) || "";
  const each_array = ensure_array_like(data);
  $$payload.out += `<svg${attr("width", width)}${attr("height", height)} class="line svelte-1e6h4yb"><path${attr("d", path)} fill="none" stroke="black" stroke-width="2"></path><g class="points"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let point = each_array[$$index];
    $$payload.out += `<circle${attr("cx", xScale(new Date(point.x)))}${attr("cy", yScale(point.y))} r="3" fill="red"></circle>`;
  }
  $$payload.out += `<!--]--></g><g${attr("transform", `translate(0, ${stringify(usableArea.bottom)})`)}></g><g${attr("transform", `translate(${stringify(usableArea.left)}, 0)`)}></g><g class="brush svelte-1e6h4yb"></g><text${attr("x", width / 2)}${attr("y", height - 5)} text-anchor="middle">Number of Movies by Year:</text>`;
  if (yearRange) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<text${attr("x", width / 2)}${attr("y", height - 20)} text-anchor="middle">${escape_html(yearRange[0].getFullYear())} - ${escape_html(yearRange[1].getFullYear())}</text>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<text${attr("x", width / 2)}${attr("y", height - 20)} text-anchor="middle">Brush to select a range</text>`;
  }
  $$payload.out += `<!--]--></svg>`;
  bind_props($$props, { yearRange });
  pop();
}
function _page($$payload, $$props) {
  push();
  let movies = [];
  let yearRange;
  let yearCountArray = [];
  let axisSelection = {
    x: "year",
    y: "average_rating",
    size: "num_votes"
  };
  const attributeOptions = [
    "tconst",
    "title_type",
    "primary_title",
    "original_title",
    "year",
    "runtime_minutes",
    "genres",
    "simple_title",
    "average_rating",
    "num_votes"
  ];
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="container svelte-a9n7ci"><h1>Summer Movies</h1> <p>${escape_html(movies.length === 0 ? "Loading..." : `${movies.length} movies`)}</p> `;
    if (movies.length > 0) {
      $$payload2.out += "<!--[-->";
      const each_array = ensure_array_like(attributeOptions);
      const each_array_1 = ensure_array_like(attributeOptions);
      const each_array_2 = ensure_array_like(attributeOptions);
      $$payload2.out += `<div class="selectors svelte-a9n7ci"><label>X Axis: <select class="svelte-a9n7ci"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let key = each_array[$$index];
        $$payload2.out += `<option${attr("value", key)}>${escape_html(key)}</option>`;
      }
      $$payload2.out += `<!--]--></select></label> <label>Y Axis: <select class="svelte-a9n7ci"><!--[-->`;
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let key = each_array_1[$$index_1];
        $$payload2.out += `<option${attr("value", key)}>${escape_html(key)}</option>`;
      }
      $$payload2.out += `<!--]--></select></label> <label>Size: <select class="svelte-a9n7ci"><!--[-->`;
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let key = each_array_2[$$index_2];
        $$payload2.out += `<option${attr("value", key)}>${escape_html(key)}</option>`;
      }
      $$payload2.out += `<!--]--></select></label></div> `;
      Scatter($$payload2, {
        movies: yearRange ? movies.filter((d) => d.year >= yearRange[0] && d.year <= yearRange[1]) : movies,
        x: axisSelection.x,
        y: axisSelection.y,
        size: axisSelection.size
      });
      $$payload2.out += `<!----> <br> `;
      Line($$payload2, {
        data: yearCountArray,
        stroke: "black",
        "stroke-width": "2",
        get yearRange() {
          return yearRange;
        },
        set yearRange($$value) {
          yearRange = $$value;
          $$settled = false;
        }
      });
      $$payload2.out += `<!---->`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
export {
  _page as default
};
