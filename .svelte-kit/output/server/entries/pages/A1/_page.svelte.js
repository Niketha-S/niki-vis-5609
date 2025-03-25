import { e as escape_html } from "../../../chunks/escaping.js";
import "clsx";
import { e as ensure_array_like, c as pop, p as push, d as stringify, f as bind_props } from "../../../chunks/index.js";
import * as d3 from "d3";
/* empty css                                                */
import { a as attr, t as to_class, c as clsx } from "../../../chunks/attributes.js";
function Bar($$payload, $$props) {
  push();
  let {
    movies,
    progress = 100,
    width = 500,
    height = 400
  } = $$props;
  let selectedGenre = "";
  const yearRange = d3.extent(movies.map((d) => d.year));
  function getUpYear(yearRange2) {
    if (!yearRange2[0]) return /* @__PURE__ */ new Date();
    const timeScale = d3.scaleTime().domain(yearRange2).range([0, 100]);
    return timeScale.invert(progress);
  }
  const upYear = getUpYear(yearRange);
  function getGenreNums(movies2, upYear2) {
    let res = {};
    movies2.filter((movie) => movie.year <= upYear2).forEach((movie) => {
      movie.genres.forEach((genre) => {
        res[genre] = (res[genre] || 0) + 1;
      });
    });
    return res;
  }
  const genreNums = getGenreNums(movies, upYear);
  const margin = { top: 15, bottom: 50, left: 30, right: 10 };
  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left
  };
  const xScale = d3.scaleBand().range([usableArea.left, usableArea.right]).domain(Object.keys(genreNums)).padding(0.1);
  const yScale = d3.scaleLinear().domain([
    0,
    d3.max(Object.values(genreNums)) ?? 40
  ]).range([usableArea.bottom, usableArea.top]);
  const xBarwidth = xScale.bandwidth();
  $$payload.out += `<h3>The Distribution of Genres ${escape_html(yearRange[0]?.getFullYear())} - ${escape_html(yearRange[1]?.getFullYear())}</h3> `;
  if (movies.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(Object.entries(genreNums));
    $$payload.out += `<svg${attr("width", width)}${attr("height", height)}><g class="bars"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [genre, cnt] = each_array[$$index];
      $$payload.out += `<g${attr("class", to_class(clsx(genre), "svelte-11e0c4e"))}><rect${attr("width", xBarwidth)}${attr("height", yScale(0) - yScale(cnt))}${attr("x", xScale(genre))}${attr("y", yScale(cnt))} fill="#449900" class="bar svelte-11e0c4e"${attr("opacity", selectedGenre === genre ? 1 : 0.7)}></rect><text${attr("x", xScale(genre) + xBarwidth / 2)}${attr("y", yScale(cnt) - 5)} font-size="12" text-anchor="middle">${escape_html(selectedGenre === genre ? cnt : "")}</text></g>`;
    }
    $$payload.out += `<!--]--></g><g${attr("transform", `translate(0, ${stringify(usableArea.bottom)})`)}></g><g${attr("transform", `translate(${stringify(usableArea.left)}, 0)`)}></g></svg>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function Q1($$payload, $$props) {
  push();
  let movies = $$props["movies"];
  let width = 600, height = 400;
  $$payload.out += `<h2>Q1: How do the top three movie genres (by number of movies) change over time?</h2> <h3>Line Chart</h3> <svg${attr("width", width)}${attr("height", height)}></svg> <h3>Stacked Area Chart</h3> <svg${attr("width", width)}${attr("height", height)}></svg> <h3>Grouped Bar Chart</h3> <svg${attr("width", width)}${attr("height", height)}></svg>`;
  bind_props($$props, { movies });
  pop();
}
function Q2($$payload, $$props) {
  push();
  let topGenrePairs = [];
  let genreMatrix = [];
  const each_array = ensure_array_like(topGenrePairs);
  const each_array_1 = ensure_array_like(genreMatrix);
  const each_array_3 = ensure_array_like(topGenrePairs);
  $$payload.out += `<h2>Q2: Are there any correlations between different genres? For example, which genre often co-occurs with comedy in a movie?</h2> <h2>First graph- Bar chart</h2> <svg width="500" height="350"><text x="250" y="20" text-anchor="left" font-size="14">Top Genre Pairs</text><text x="250" y="340" text-anchor="middle" font-size="12">Genre Pairs</text><text x="10" y="180" text-anchor="middle" font-size="12" transform="rotate(-90,10,180)">Frequency</text><!--[-->`;
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let [pair, count] = each_array[i];
    $$payload.out += `<rect${attr("x", i * 50 + 50)}${attr("y", 300 - count * 5)} width="40"${attr("height", count * 5)} fill="steelblue"></rect><text${attr("x", i * 50 + 70)}${attr("y", 290 - count * 5)} font-size="12" text-anchor="middle">${escape_html(pair)}</text>`;
  }
  $$payload.out += `<!--]--></svg> <h2>Second graph- Heatmap</h2> <svg width="500" height="500"><text x="250" y="490" text-anchor="middle" font-size="12">Genres</text><text x="10" y="250" text-anchor="middle" font-size="12" transform="rotate(-90,10,250)">Genres</text><!--[-->`;
  for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
    let row = each_array_1[i];
    const each_array_2 = ensure_array_like(row);
    $$payload.out += `<!--[-->`;
    for (let j = 0, $$length2 = each_array_2.length; j < $$length2; j++) {
      let value = each_array_2[j];
      $$payload.out += `<rect${attr("x", j * 25 + 50)}${attr("y", i * 25 + 50)} width="25" height="25"${attr("fill", d3.interpolateBlues(value / 10))}></rect>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></svg> <h2>Third graph- Genre Relationship Network</h2> <svg width="500" height="500"><text x="250" y="20" text-anchor="middle" font-size="14">Genre Relationship Network</text><!--[-->`;
  for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
    let [pair, count] = each_array_3[$$index_3];
    $$payload.out += `<line${attr("x1", Math.random() * 500)}${attr("y1", Math.random() * 500)}${attr("x2", Math.random() * 500)}${attr("y2", Math.random() * 500)} stroke="gray"${attr("stroke-width", count / 5)}></line>`;
  }
  $$payload.out += `<!--]--></svg>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  let movies = [];
  $$payload.out += `<h1>Summer Movies</h1> <h2>-Niketha Sabesan</h2> <p>Here are ${escape_html(movies.length == 0 ? "..." : movies.length + " ")} movies</p> `;
  Bar($$payload, { movies });
  $$payload.out += `<!----> `;
  Q1($$payload, { movies });
  $$payload.out += `<!----> `;
  Q2($$payload);
  $$payload.out += `<!---->`;
  pop();
}
export {
  _page as default
};
