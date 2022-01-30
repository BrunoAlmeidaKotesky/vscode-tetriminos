<script lang="ts">
    import Display from "./Display.svelte";
    import { onMount, getContext } from "svelte";
    import {pieceController} from "../controllers/PieceController";
    import { TETRIMINOS } from "../helpers/constants";

    export let width: number;
    export let height: number;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;

    const { currentPiece, board } = getContext(TETRIMINOS);
    $: $currentPiece && drawCanvas();
    function drawCanvas() {
        if(ctx) 
            pieceController.drawGame(ctx!, $board, $currentPiece);
    }

    onMount(() => {
        ctx = canvas.getContext("2d");
    });
</script>

<Display>
    <canvas bind:this={canvas} width={width} height={height} />
</Display>
