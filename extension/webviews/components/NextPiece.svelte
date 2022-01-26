<script lang="ts">
    import { getContext } from "svelte";
    import type {IGameStore} from "../helpers/constants";
    import { TETRIS } from "../helpers/constants";
    import Display from "../components/Display.svelte";
    import Piece from "../components/Piece.svelte";
    const { nextPiece } = getContext<IGameStore>(TETRIS);
    export let width: number;
    export let height: number;
</script>

<Display>
    <div>
        <span>Next</span>
        <Piece
            {width}
            {height}
            piece={$nextPiece}
            xOffset={(4 - $nextPiece.matrix[0].length) / 2}
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
