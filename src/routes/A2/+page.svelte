<script lang="ts">
    import * as d3 from "d3";
    import { Scatter, Line } from "$lib";
    import { onMount, tick } from "svelte";
    import type { TMovie } from "../../types";

    let movies: TMovie[] = [];
    let yearRange: [Date, Date] | undefined;
    let yearCountArray = [];

    function getYearCountArray(movies: TMovie[]) {
        let yearCount: { [year: number]: number } = {};

        movies.forEach((d) => {
            const year = d.year.getFullYear();
            yearCount[year] = (yearCount[year] || 0) + 1;
        });

        let processedArray = Object.entries(yearCount)
            .map(([year, count]) => ({
                x: new Date(Number(year), 0, 1).getTime(), // Use timestamps for better scaling
                y: count,
            }))
            .sort((a, b) => a.x - b.x);

        console.log("Processed Year Count Data:", processedArray); // Debugging

        return processedArray;
    }

    let axisSelection = {
        x: "year",
        y: "average_rating",
        size: "num_votes",
    };

    const attributeOptions = [
        "tconst", "title_type", "primary_title", "original_title", "year",
        "runtime_minutes", "genres", "simple_title", "average_rating", "num_votes"
    ];

    async function loadCsv() {
        try {
            const csvUrl = "./summer_movies.csv";
            const rawData = await d3.csv(csvUrl);
            
            movies = rawData.map(row => ({
                tconst: row.tconst,
                title_type: row.title_type,
                primary_title: row.primary_title,
                original_title: row.original_title,
                year: new Date(Number(row.year), 0, 1),
                runtime_minutes: Number(row.runtime_minutes),
                genres: row.genres.split(","),
                simple_title: row.primary_title.toLowerCase(),
                average_rating: Number(row.average_rating),
                num_votes: Number(row.num_votes),
            }));

            yearCountArray = getYearCountArray(movies);
            console.log("Loaded CSV Data:", movies);
            console.log("Final Year Count Array:", yearCountArray);

            await tick();  // Ensure the graph updates after data loads
        } catch (error) {
            console.error("Error loading CSV:", error);
        }
    }

    onMount(loadCsv);

    function handleScatterClick(event: MouseEvent, d: TMovie) {
        alert(`Clicked on: ${d.primary_title} (${d.year.getFullYear()}) - Rating: ${d.average_rating}`);
    }

    function handleBrush(selection: [Date, Date]) {
        yearRange = selection;
    }
</script>

<div class="container">
    <h1>Summer Movies</h1>
    <p>{movies.length === 0 ? "Loading..." : `${movies.length} movies`}</p>
    {#if movies.length > 0}
        <div class="selectors">
            <label>
                X Axis:
                <select bind:value={axisSelection.x}>
                    {#each attributeOptions as key}
                        <option value={key}>{key}</option>
                    {/each}
                </select>
            </label>

            <label>
                Y Axis:
                <select bind:value={axisSelection.y}>
                    {#each attributeOptions as key}
                        <option value={key}>{key}</option>
                    {/each}
                </select>
            </label>

            <label>
                Size:
                <select bind:value={axisSelection.size}>
                    {#each attributeOptions as key}
                        <option value={key}>{key}</option>
                    {/each}
                </select>
            </label>
        </div>

        <Scatter
            movies={yearRange
                ? movies.filter(d => d.year >= yearRange[0] && d.year <= yearRange[1])
                : movies}
            x={axisSelection.x}
            y={axisSelection.y}
            size={axisSelection.size}
            on:click={handleScatterClick} 
        />
        <br />

        <!-- Updated Line Graph to Ensure Visibility -->
        <Line 
            data={yearCountArray} 
            bind:yearRange 
            on:brush={handleBrush} 
            stroke="black" 
            stroke-width="2"
        />
    {/if}
</div>

<style>
    .container {
        width: 60vw;
        margin: 10px auto;
        padding: 10px;
    }
    .selectors {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
    }
    select {
        padding: 5px;
    }
</style>
