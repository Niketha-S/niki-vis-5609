<script lang="ts">
    import * as d3 from "d3";
    import { onMount } from "svelte";

    let movies = [];
    let genrePairs = {};
    let topGenrePairs = [];
    let genreMatrix = [];
    let genres = new Set();

    // Load CSV and store data in localStorage
    async function loadCsv() {
        try {
            const storedData = localStorage.getItem("movies");
            if (storedData) {
                movies = JSON.parse(storedData);
            } else {
                const csvUrl = "./summer_movies.csv";
                movies = await d3.csv(csvUrl, (row) => {
                    return {
                        genres: row.genres.split(","),
                        year: new Date(row.year).getFullYear(),
                    };
                });
                localStorage.setItem("movies", JSON.stringify(movies));
            }
            processGenres();
        } catch (error) {
            console.error("Error loading CSV:", error);
        }
    }

    function processGenres() {
        genrePairs = {};
        genres.clear();
        movies.forEach((movie) => {
            const movieGenres = movie.genres;
            movieGenres.forEach((g) => genres.add(g));
            for (let i = 0; i < movieGenres.length; i++) {
                for (let j = i + 1; j < movieGenres.length; j++) {
                    const pair = [movieGenres[i], movieGenres[j]].sort().join(" & ");
                    genrePairs[pair] = (genrePairs[pair] || 0) + 1;
                }
            }
        });
        topGenrePairs = Object.entries(genrePairs)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        createGenreMatrix();
    }

    function createGenreMatrix() {
        const genreArray = Array.from(genres);
        genreMatrix = genreArray.map((g1) => {
            return genreArray.map((g2) => {
                const pair = [g1, g2].sort().join(" & ");
                return genrePairs[pair] || 0;
            });
        });
    }

    onMount(loadCsv);
</script>

<h2>Q2: Are there any correlations between different genres? For example, which genre often co-occurs with comedy in a movie?</h2>

<!-- Bar Chart for Top Genre Pairs -->
 <h2> First graph- Bar chart</h2>
<svg width="500" height="350">
    <text x="250" y="20" text-anchor="left" font-size="14">Top Genre Pairs</text>
    <text x="250" y="340" text-anchor="middle" font-size="12">Genre Pairs</text>
    <text x="10" y="180" text-anchor="middle" font-size="12" transform="rotate(-90,10,180)">Frequency</text>
    {#each topGenrePairs as [pair, count], i}
        <rect
            x={i * 50 + 50}
            y={300 - count * 5}
            width="40"
            height={count * 5}
            fill="steelblue"
        />
        <text x={i * 50 + 70} y={290 - count * 5} font-size="12" text-anchor="middle">{pair}</text>
    {/each}
</svg>

<!-- Heatmap for Genre Correlation -->
 <h2> Second graph- Heatmap </h2>
<svg width="500" height="500">
    
    <text x="250" y="490" text-anchor="middle" font-size="12">Genres</text>
    <text x="10" y="250" text-anchor="middle" font-size="12" transform="rotate(-90,10,250)">Genres</text>
    {#each genreMatrix as row, i}
        {#each row as value, j}
            <rect
                x={j * 25 + 50}
                y={i * 25 + 50}
                width="25"
                height="25"
                fill={d3.interpolateBlues(value / 10)}
            />
        {/each}
    {/each}
</svg>

<!-- Network Graph for Genre Relationships -->
 <h2> Third graph- Genre Relationship Network
</h2>
<svg width="500" height="500">
    <text x="250" y="20" text-anchor="middle" font-size="14">Genre Relationship Network</text>
    {#each topGenrePairs as [pair, count]}
        <line
            x1={Math.random() * 500}
            y1={Math.random() * 500}
            x2={Math.random() * 500}
            y2={Math.random() * 500}
            stroke="gray"
            stroke-width={count / 5}
        />
    {/each}
</svg>
