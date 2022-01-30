<script lang="ts">
    import { getContext } from "svelte";
    import Display from "../components/Display.svelte";
    import { TETRIMINOS } from "../helpers/constants";
    import type { IGameStore } from "../helpers/constants";

    const { lines } = getContext<IGameStore>(TETRIMINOS);
    const zeroPaddingTotal = 3;

    $: display = padLines($lines);

    function padLines(currentLines: number): string {
        const lines = currentLines.toString();
        return lines.padStart(zeroPaddingTotal, "0");
    }
</script>

<Display>
    <div>
        <span>Lines {display}</span>
    </div>
</Display>

<style>
    div {
        width: 100%;
    }
    span {
        display: block;
        text-align: right;
    }
</style>
