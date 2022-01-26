<script lang="ts">
    import { getContext } from "svelte";
    import Display from "../components/Display.svelte";
    import { TETRIS } from "../helpers/constants";
    import type { IGameStore } from "../helpers/constants";

    const zeroPaddingTotal = 2;
    const displayLength = 5;
    const { level } = getContext<IGameStore>(TETRIS);

    $: display = padLevel($level);

    function padLevel(currentLevel: number): string {
        const level = currentLevel.toString();
        const spacePadStart = Math.floor((5 - level.length) / 2) + level.length;
        return level
            .padStart(zeroPaddingTotal, "0")
            .padEnd(spacePadStart, " ")
            .padStart(displayLength, " ");
    }
</script>

<Display>
    <div>
        <span>Level</span>
        <span class="display">{display}</span>
    </div>
</Display>

<style>
    span {
        display: block;
    }
    .display {
        white-space: pre;
    }
</style>
