<script lang="ts">
    import { getContext } from "svelte";
    import { TETRIS } from "../helpers/constants";
    import type {IGameStore} from "../helpers/constants";
    import Display from "../components/Display.svelte";
    const { scoreStore } = getContext<IGameStore>(TETRIS);
    $: display = $scoreStore?.toString()?.padStart(6, "0");
</script>

<Display>
    <div class="scoreboard">
        <span>Score</span>
        <span>{display}</span>
    </div>
</Display>

<style>
    .scoreboard {
        display: flex;
        flex-direction: column;
        align-content: center;
    }
    span {
        display: block;
    }
</style>
