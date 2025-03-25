<h1> A0</h1>

<script>
    let maxClick = 2;
    let cnt = maxClick; // Initialize cnt with maxClick

    function onClick() {
        if (cnt > 0) {
            cnt--; // Decrease count on button click
        }
    }

    $: console.log("maxClick:", maxClick, "cnt:", cnt); // Debugging
</script>

<h1>Niketha Sabesan's VIS Site</h1>
<img 
    width="200px" 
    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1" 
    alt="Coding Girl"
/>

<div>
    You can click up to
    <select bind:value={maxClick} on:change={() => cnt = maxClick}>
        {#each [2, 4, 6] as optionNum}
            <option value={optionNum}>{optionNum}</option>
        {/each}
    </select>
    times
</div>

<button on:click={onClick} disabled={cnt === 0}>Click Me</button>

{#if cnt > 0}
    <p id="info">Remaining Number of Clicks: {cnt}</p>
{:else}
    <p>No more clicks allowed</p>
{/if}

<style>
    body {
        font-family: Arial, Helvetica, sans-serif;
    }
    button {
        background-color: #44aa66;
        color: white;
        font-size: xx-large;
        padding: 10px 20px;
        border: none;
        cursor: pointer;
        border-radius: 5px;
    }
    button:disabled {
        background-color: gray;
        cursor: not-allowed;
    }
</style>
