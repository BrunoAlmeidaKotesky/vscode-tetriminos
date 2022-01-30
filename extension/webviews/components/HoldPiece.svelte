<script lang="ts">
    import { getContext } from "svelte";
    import type {IGameStore} from "../helpers/constants";
    import { TETRIMINOS } from "../helpers/constants";
    import Display from "../components/Display.svelte";
    import Piece from "../components/Piece.svelte";
    const { holdPieceStore } = getContext<IGameStore>(TETRIMINOS);
    export let width: number;
    export let height: number;
</script>

<Display>
    <div>
        <span>Holding</span>
        <Piece
            {width}
            {height}
            piece={$holdPieceStore}
            xOffset={$holdPieceStore ? (4 - $holdPieceStore?.matrix[0]?.length) / 2 : 0}
            yOffset={1}
        />
    </div>
</Display>

<style>
    span {
        display: block;
        text-align: center;
    }
</style>
