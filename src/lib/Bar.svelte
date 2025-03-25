<script lang="ts">
  import type { TMovie } from "../types";
  import * as d3 from "d3";
  
  type Props = {
    movies: TMovie[];
    progress?: number;
    width?: number;
    height?: number;
  };
  
  let { movies, progress = 100, width = 500, height = 400 }: Props = $props();
  let selectedGenre: string = "";
  
  const yearRange = $derived(d3.extent(movies.map((d) => d.year)));
  
  function getUpYear(yearRange: [undefined, undefined] | [Date, Date]) {
    if (!yearRange[0]) return new Date();
    const timeScale = d3.scaleTime().domain(yearRange).range([0, 100]);
    return timeScale.invert(progress);
  }
  
  const upYear: Date = $derived(getUpYear(yearRange!));
  
  function getGenreNums(movies: TMovie[], upYear: Date) {
    let res: { [genre: string]: number } = {};
    movies
      .filter((movie) => movie.year <= upYear)
      .forEach((movie) => {
        movie.genres.forEach((genre: string) => {
          res[genre] = (res[genre] || 0) + 1;
        });
      });
    return res;
  }
  
  const genreNums = $derived(getGenreNums(movies, upYear));
  
  const margin = {
    top: 15,
    bottom: 50,
    left: 30,
    right: 10,
  };
  
  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
  };
  
  const xScale = $derived(
    d3
      .scaleBand()
      .range([usableArea.left, usableArea.right])
      .domain(Object.keys(genreNums))
      .padding(0.1)
  );

  const yScale = $derived(
    d3.scaleLinear()
      .domain([0, d3.max(Object.values(genreNums)) ?? 40])
      .range([usableArea.bottom, usableArea.top])
  );
  
  const xBarwidth: number = $derived(xScale.bandwidth());
  
  let xAxis: any = $state(),
    yAxis: any = $state();
  
  function updateAxis() {
    d3.select(xAxis)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start");
    
    d3.select(yAxis).call(d3.axisLeft(yScale));
  }
  
  $effect(() => {
    updateAxis();
  });
</script>

<h3>
  The Distribution of Genres {yearRange[0]?.getFullYear()} - {yearRange[1]?.getFullYear()}
</h3>

{#if movies.length > 0}
  <svg {width} {height}>
    <g class="bars">
      {#each Object.entries(genreNums) as [genre, cnt]}
        <g class={genre}>
          <rect
            width={xBarwidth}
            height={yScale(0) - yScale(cnt)}
            x={xScale(genre)}
            y={yScale(cnt)}
            fill="#449900"
            class="bar"
            opacity={selectedGenre === genre ? 1 : 0.7}
            onmouseover={() => {
              selectedGenre = genre;
            }}
            onmouseout={() => {
              selectedGenre = "";
            }}
          />
          <text
            x={xScale(genre)! + xBarwidth / 2}
            y={yScale(cnt) - 5}
            font-size="12"
            text-anchor="middle"
          >
            {selectedGenre === genre ? cnt : ""}
          </text>
        </g>
      {/each}
    </g>
    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
  </svg>
{/if}

<style>
  .bar {
    transition:
      y 0.1s ease,
      height 0.1s ease,
      width 0.1s ease;
  }
</style>