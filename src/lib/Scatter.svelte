<script lang="ts">
    import type { TMovie } from "../types";
    import * as d3 from "d3";

    type TProps = {
        movies: TMovie[];
        x: keyof TMovie;
        y: keyof TMovie;
        size?: keyof TMovie;
        width?: number;
        height?: number;
    };
    const { movies, x, y, size, height = 500, width = 600 }: TProps = $props();

    let selectedMovie: TMovie | undefined = $state();

    const margin = {
        top: 15,
        bottom: 50,
        left: 60, // Increased for better y-axis labels
        right: 10,
    };
    const usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
    };
    const sizeRange = [3, 15];

    function getScale(
        attrName: keyof TMovie,
        axis: "x" | "y" | "size",
        movies: TMovie[],
    ) {
        if (movies.length === 0) return null;

        let range: number[] = [];
        if (axis === "x") range = [usableArea.left, usableArea.right];
        if (axis === "y") range = [usableArea.bottom, usableArea.top];
        if (axis === "size") range = sizeRange;

        if (typeof movies[0][attrName] === "string") {
            return d3
                .scaleBand()
                .domain(movies.map((d) => d[attrName] as string))
                .range(range)
                .padding(0.2);
        } else if (typeof movies[0][attrName] === "number") {
            return d3
                .scaleLinear()
                .domain(
                    d3.extent(movies, (d) => d[attrName] as number) as [
                        number,
                        number,
                    ],
                )
                .range(range);
        } else if (movies[0][attrName] instanceof Date) {
            return d3
                .scaleTime()
                .domain(
                    d3.extent(movies, (d) => d[attrName] as Date) as [
                        Date,
                        Date,
                    ],
                )
                .range(range);
        } else {
            return null;
        }
    }

    const xScale = $derived(getScale(x, "x", movies));
    const yScale = $derived(getScale(y, "y", movies));
    const sizeScale = $derived(size ? getScale(size, "size", movies) : null);

    let xAxis: any = $state(), yAxis: any = $state();

    function updateAxis() {
        if (!xScale || !yScale) return;

        d3.select(xAxis)
            .call(d3.axisBottom(xScale).ticks(6))
            .selectAll("text")
            .attr("transform", "rotate(30)")
            .style("text-anchor", "start");

        d3.select(yAxis).call(d3.axisLeft(yScale));
    }

    function handleMovieClick(movie: TMovie) {
        // Toggle selection
        selectedMovie = selectedMovie === movie ? undefined : movie;
    }

    // Run updates when reactive variables change
    $effect(() => {
        updateAxis();
    });
</script>

<svg {width} {height}>
    <g class="points">
        {#each movies as movie}
            {#if x === "genres"}
                {#each movie["genres"] as genre}
                    <circle
                        cx={xScale ? xScale(genre) + xScale.bandwidth() / 2 : usableArea.left}
                        cy={yScale ? yScale(movie[y]) : usableArea.bottom}
                        r={sizeScale ? sizeScale(movie[size]) : sizeRange[0]}
                        fill={movie === selectedMovie ? "steelblue" : "transparent"}
                        stroke="steelblue"
                        stroke-width="2"
                        opacity={movie === selectedMovie ? 1 : 0.5}
                        onclick={() => handleMovieClick(movie)}
                    />
                {/each}
            {:else}
                <circle
                    cx={xScale ? xScale(movie[x]) : usableArea.left}
                    cy={yScale ? yScale(movie[y]) : usableArea.bottom}
                    r={sizeScale ? sizeScale(movie[size]) : sizeRange[0]}
                    fill={movie === selectedMovie ? "steelblue" : "transparent"}
                    stroke="steelblue"
                    stroke-width="2"
                    opacity={movie === selectedMovie ? 1 : 0.5}
                    onclick={() => handleMovieClick(movie)}
                />
            {/if}
        {/each}
    </g>
    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
</svg>

<div class="selectedInfo">
    {selectedMovie
        ? JSON.stringify(selectedMovie, null, 2)
        : "Click on a point to see details"}
</div>

<style>
    .points circle {
        transition:
            r 0.5s,
            cx 0.5s,
            cy 0.5s;
        cursor: pointer;
    }

    svg {
        display: inline-block;
        vertical-align: top;
    }

    .selectedInfo {
        display: inline-block;
        vertical-align: top;
        width: 250px;
        color: #555;
        font-family: monospace;
        white-space: pre-wrap;
        background-color: #f9f9f9;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        overflow: auto;
    }
</style>
