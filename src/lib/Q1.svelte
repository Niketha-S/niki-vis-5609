<script lang="ts">
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import type { TMovie } from "../types";

    export let movies: TMovie[];

    let svgLine, svgStacked, svgGrouped;
    let width = 600, height = 400, margin = { top: 40, right: 30, bottom: 50, left: 50 };

    function processData(movies) {
        let genreCounts = d3.rollup(
            movies.flatMap(d => d.genres.includes("Comedy") || d.genres.includes("Drama") || d.genres.includes("Romance") 
              ? d.genres.map(g => ({ year: +d.year, genre: g })) : []),
            v => v.length,
            d => d.year,
            d => d.genre
        );

        let data = Array.from(genreCounts, ([year, genres]) => ({
            year,
            Comedy: genres.get("Comedy") || 0,
            Drama: genres.get("Drama") || 0,
            Romance: genres.get("Romance") || 0
        }));

        return data.sort((a, b) => a.year - b.year);
    }

    onMount(() => {
        let data;

        // Check if data exists in localStorage
        const storedData = localStorage.getItem("q1_chart_data");
        if (storedData) {
            data = JSON.parse(storedData);
        } else if (movies && movies.length > 0) {
            data = processData(movies);
            localStorage.setItem("q1_chart_data", JSON.stringify(data));
        } else {
            return;
        }

        drawLineChart(data);
        drawStackedAreaChart(data);
        drawGroupedBarChart(data);
    });

    function drawLineChart(data) {
        const svg = d3.select(svgLine);
        svg.selectAll("*").remove();

        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.Comedy, d.Drama, d.Romance))])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal().domain(["Comedy", "Drama", "Romance"]).range(["#ff5733", "#3399ff", "#ff33cc"]);

        const line = d3.line()
            .x(d => x(d.year))
            .y((d, i, nodes) => y(d[`${d3.select(nodes[i].parentNode).datum()}`]));

        const genres = ["Comedy", "Drama", "Romance"];

        genres.forEach(genre => {
            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", color(genre))
                .attr("stroke-width", 2)
                .attr("d", line.y(d => y(d[genre])));
        });

        svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
        svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));
    }

    function drawStackedAreaChart(data) {
        const svg = d3.select(svgStacked);
        svg.selectAll("*").remove();

        const keys = ["Comedy", "Drama", "Romance"];

        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Comedy + d.Drama + d.Romance)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal().domain(keys).range(["#ff5733", "#3399ff", "#ff33cc"]);

        const stack = d3.stack().keys(keys);
        const stackedData = stack(data);

        svg.selectAll("layers")
            .data(stackedData)
            .join("path")
            .attr("fill", d => color(d.key))
            .attr("d", d3.area()
                .x(d => x(d.data.year))
                .y0(d => y(d[0]))
                .y1(d => y(d[1]))
            );

        svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
        svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));
    }

    function drawGroupedBarChart(data) {
        const svg = d3.select(svgGrouped);
        svg.selectAll("*").remove();

        const x0 = d3.scaleBand()
            .domain(data.map(d => d.year))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const x1 = d3.scaleBand()
            .domain(["Comedy", "Drama", "Romance"])
            .range([0, x0.bandwidth()])
            .padding(0.05);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.Comedy, d.Drama, d.Romance))])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal().domain(["Comedy", "Drama", "Romance"]).range(["#ff5733", "#3399ff", "#ff33cc"]);

        svg.append("g")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("transform", d => `translate(${x0(d.year)},0)`)
            .selectAll("rect")
            .data(d => ["Comedy", "Drama", "Romance"].map(key => ({ key, value: d[key] })))
            .join("rect")
            .attr("x", d => x1(d.key))
            .attr("y", d => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - margin.bottom - y(d.value))
            .attr("fill", d => color(d.key));

        svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x0).tickFormat(d3.format("d")));
        svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));
    }
</script>

<h2>Q1: How do the top three movie genres (by number of movies) change over time?</h2>

<h3>Line Chart</h3>
<svg bind:this={svgLine} width={width} height={height}></svg>

<h3>Stacked Area Chart</h3>
<svg bind:this={svgStacked} width={width} height={height}></svg>

<h3>Grouped Bar Chart</h3>
<svg bind:this={svgGrouped} width={width} height={height}></svg>
