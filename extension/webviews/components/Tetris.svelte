<script lang="ts">
    import {setContext} from 'svelte';
    import { COLS, ROWS, BLOCK_SIZE, TETRIS } from '../helpers/constants';
    import {pieceController} from '../controllers/PieceController';
    import board from '../stores/board';
    import currentPiece from '../stores/currentPiece';
    // components
    import Statistics from "./Statistics.svelte";
    import Lines from "./Lines.svelte";
    import Board from "./Board.svelte";
    import Score from "./Score.svelte";
    import NextPiece from "./NextPiece.svelte";
    import Level from "./Level.svelte";
    console.log('here');
    const canvasWidth = COLS * BLOCK_SIZE
    const canvasHeight = ROWS * BLOCK_SIZE
    const tetriminos = pieceController.tetriminos;
    currentPiece.setCurrentPiece(tetriminos[1]);
    setContext(TETRIS, {currentPiece, board});
</script>

<div class="game">
    <section class="stats">
        <Statistics />
    </section>

    <section>
        <Lines />
        <Board width={canvasWidth} height={canvasHeight}/>
    </section>

    <section class="meta">
        <!-- SCORE -->
        <Score />
        <!-- NEXT PIECE -->
        <NextPiece />
        <!-- LEVEL -->
        <Level />
    </section>
</div>
<svelte:head>
    <style>
        .game {
            max-width: 56rem;
            display: grid;
            grid-template-columns: 220px auto 200px;
        }
        section {
            display: flex;
            flex-direction: column;
        }
        .stats {
            align-items: flex-end;
        }
        .meta {
            align-items: flex-start;
        }
    </style>
</svelte:head>
