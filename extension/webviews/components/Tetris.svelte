<script lang="ts">
    import { onMount, setContext } from "svelte";
    import * as pressed from 'pressed';
    import { COLS, ROWS, BLOCK_SIZE, TETRIS, KeyBoardController } from "../helpers/constants";
    import { pieceController } from "../controllers/PieceController";
    import board from "../stores/board";
    import currentPiece from "../stores/currentPiece";
    // components
    import Statistics from "./Statistics.svelte";
    import Lines from "./Lines.svelte";
    import Board from "./Board.svelte";
    import Score from "./Score.svelte";
    import NextPiece from "./NextPiece.svelte";
    import Level from "./Level.svelte";
    import boardController from "../controllers/BoardController";
    import { klona } from "klona";

    const canvasWidth = COLS * BLOCK_SIZE;
    const canvasHeight = ROWS * BLOCK_SIZE;
    const tetriminos = pieceController.tetriminos;

    currentPiece.setCurrentPiece(tetriminos[1]);
    setContext(TETRIS, { currentPiece, board });

    let animationID: number | null = null;
    let lastLeftMove: number = 0;
    let lastRightMove: number = 0;
    let lastDownMove: number = 0;
    let timeSincePieceLastFell: number = 0;

    function handlePlayerMovement(currentTime: number) {
        const [
            isLeftMovementAllowed,
            isRightMovementAllowed,
            isDownMovementAllowed,
        ] = boardController.calculateMovement(currentTime, [lastLeftMove, lastRightMove, lastDownMove]);
        if (pressed.some(KeyBoardController.DOWN)) {
            if (isDownMovementAllowed) {
                lastDownMove = currentTime;
                timeSincePieceLastFell = 0;
                currentPiece.movePieceDown($board);
                return;
            }
            lastDownMove = 0;
        }
        if (pressed.some(KeyBoardController.LEFT)) {
            if (isLeftMovementAllowed) {
                lastLeftMove = currentTime;
                currentPiece?.movePieceLeft($board);
                return;
            }
            lastLeftMove = 0;
        }

        if (pressed.some(KeyBoardController.RIGHT)) {
            if (isRightMovementAllowed) {
                lastRightMove = currentTime;
                currentPiece.movePieceRight($board);
                return;
            }
            lastRightMove = 0;
        }
    }

    function animate(currentTime: number) {
        handlePlayerMovement(currentTime);
        if (boardController.detectMatrixCollision($currentPiece, $board)) {
            boardController.mergeCurrentPieceIntoBoard($currentPiece, board);
            const randomPiece = pieceController.getRandomPiece();
            console.log(randomPiece);
            currentPiece.setCurrentPiece(randomPiece);

            // If there is still a collision right after a new piece is spawned, the game ends.
            if (boardController.detectMatrixCollision($currentPiece, $board))
                return;
        }
        animationID = requestAnimationFrame(animate);
    }

    function init() {
        pressed.start(document);
        currentPiece.setCurrentPiece(pieceController.getRandomPiece());
        animationID = requestAnimationFrame(animate);
    }

    onMount(() => {
        init();
    });
</script>

<div class="game">
    <section class="stats">
        <Statistics />
    </section>
    <section>
        <Lines />
        <Board width={canvasWidth} height={canvasHeight} />
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
