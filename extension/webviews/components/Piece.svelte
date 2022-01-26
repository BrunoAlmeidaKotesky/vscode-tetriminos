<script lang="ts">
import { onMount } from "svelte";
import { PieceColors, pieceController } from "../controllers/PieceController";
import type { IPieceInformation } from "../controllers/PieceController";
import type { Matrix } from "../types";

    export let piece: IPieceInformation;
    export let width: number;
    export let height: number;
    export let xOffset = 0;
    export let yOffset = 0;
    export let scale = 1

    let ref: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    $: piece, ctx, drawCanvas(piece.matrix);

    function drawCanvas(matrix: Matrix) {
        if (ctx) {
            const x = (4 - matrix[0].length) / 2;
            pieceController.clearCanvas(ctx, PieceColors.BACKGROUND);
            pieceController.drawMatrix(ctx, matrix, xOffset, yOffset);
        }
    }

    onMount(() => {
        ctx = ref.getContext("2d")!;
        ctx.scale(scale, scale)
    });
</script>

<div>
    <canvas bind:this={ref} {width} {height} />
</div>
