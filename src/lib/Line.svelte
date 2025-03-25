<script lang="ts">
  import * as d3 from "d3";

  type TProps = {
    data: Array<{ x: number; y: number }>; // x is now a timestamp for compatibility
    yearRange: [Date, Date] | undefined;
    width?: number;
    height?: number;
  };

  let {
    data = [],
    yearRange = $bindable(),
    height = 150,
    width = 600,
  }: TProps = $props();

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

  // X and Y Scales
  const xScale = $derived(
    d3
      .scaleTime()
      .domain(d3.extent(data.map((d) => new Date(d.x))) as [Date, Date])
      .range([usableArea.left, usableArea.right])
  );

  const yScale = $derived(
    d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) || 10]) // Ensuring a valid range
      .range([usableArea.bottom, usableArea.top])
  );

  // Line Generator
  const lineGenerator = d3
    .line<{ x: number; y: number }>()
    .x((d) => xScale(new Date(d.x)))
    .y((d) => yScale(d.y))
    .curve(d3.curveBasis);

  const path = $derived(() => lineGenerator(data) || "");

  let xAxis: any = $state(),
    yAxis: any = $state(),
    brushElement: any = $state();

  function updateAxis() {
    if (!xScale || !yScale) return;
    d3.select(xAxis).call(d3.axisBottom(xScale));
    d3.select(yAxis).call(d3.axisLeft(yScale));
  }

  function handleBrush(event: any) {
    const selection = event.selection;
    if (selection) {
      const [start, end] = selection.map(xScale.invert); // Convert from pixels to dates
      yearRange = [start, end];
    } else {
      yearRange = undefined;
    }
  }

  function setupBrush() {
    const brush = d3
      .brushX()
      .extent([
        [usableArea.left, usableArea.top],
        [usableArea.right, usableArea.bottom],
      ])
      .on("brush end", handleBrush);

    d3.select(brushElement).call(brush);
  }

  // Ensure the brush and axes update when data changes
  $effect(() => {
    setupBrush();
    updateAxis();
  });
</script>

<svg {width} {height} class="line">
  <!-- Line Path -->
  <path d={path} fill="none" stroke="black" stroke-width="2" />

  <!-- Circles for each data point -->
  <g class="points">
    {#each data as point (point.x)}
      <circle
        cx={xScale(new Date(point.x))}
        cy={yScale(point.y)}
        r="3"
        fill="red"
      />
    {/each}
  </g>

  <!-- Axes -->
  <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
  <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />

  <!-- Brush -->
  <g class="brush" bind:this={brushElement} />

  <!-- Labels -->
  <text x={width / 2} y={height - 5} text-anchor="middle">
    Number of Movies by Year:
  </text>

  {#if yearRange}
    <text x={width / 2} y={height - 20} text-anchor="middle">
      {yearRange[0].getFullYear()} - {yearRange[1].getFullYear()}
    </text>
  {:else}
    <text x={width / 2} y={height - 20} text-anchor="middle">
      Brush to select a range
    </text>
  {/if}
</svg>

<style>
  .line {
    border: 1px solid #ddd;
  }
  .brush {
    fill: rgba(0, 0, 255, 0.1);
  }
</style>
