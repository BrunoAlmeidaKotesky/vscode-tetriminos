<script lang="ts">
    import { onMount, setContext } from "svelte";
    import * as pressed from 'pressed';
    import { COLS, ROWS, BLOCK_SIZE, TETRIS, KeyBoardController } from "../helpers/constants";
    import { pieceController } from "../controllers/PieceController";
    import board from "../stores/board";
    import currentPiece from "../stores/currentPiece";
    import lines from "../stores/lineStore";
    import { fallRate } from '../stores/fallRateStore';
    import boardController from "../controllers/BoardController";
    // components
    import Statistics from "./Statistics.svelte";
    import Lines from "./Lines.svelte";
    import Board from "./Board.svelte";
    import Score from "./Score.svelte";
    import NextPiece from "./NextPiece.svelte";
    import Level from "./Level.svelte";

    const canvasWidth = COLS * BLOCK_SIZE;
    const canvasHeight = ROWS * BLOCK_SIZE;

    setContext(TETRIS, { currentPiece, board });

    let animationID: number | null = null;
    let lastLeftMove: number = 0;
    let lastRightMove: number = 0;
    let lastDownMove: number = 0;
    let timeSincePieceLastFell: number = 0;
    let lastRotate: number = 0;
    let lastFrameTime: number = 0;

    function handlePlayerMovement(currentTime: number) {
        const [
            isLeftMovementAllowed,
            isRightMovementAllowed,
            isDownMovementAllowed,
            playerSidewaysThreshold
        ] = boardController.calculateMovement(currentTime, [lastLeftMove, lastRightMove, lastDownMove]);
        const isRotateMovementAllowed = currentTime - lastRotate > playerSidewaysThreshold;
        if (pressed.some(KeyBoardController.DOWN)) {
            if (isDownMovementAllowed) {
                lastDownMove = currentTime;
                timeSincePieceLastFell = 0;
                currentPiece.movePieceDown($board);
                return;
            }
        } else {
            lastDownMove = 0;
        }
        if (pressed.some(KeyBoardController.LEFT)) {
            if (isLeftMovementAllowed) {
                lastLeftMove = currentTime;
                currentPiece?.movePieceLeft($board);
                return;
            }
        } else {            
            lastLeftMove = 0;
        }

        if (pressed.some(KeyBoardController.RIGHT)) {
            if (isRightMovementAllowed) {
                lastRightMove = currentTime;
                currentPiece.movePieceRight($board);
                return;
            }
        } else {
            lastRightMove = 0;
        }
        
        if(pressed.some(...KeyBoardController.ROTATE_LEFT, ...KeyBoardController.ROTATE_RIGHT)) {
            if(isRotateMovementAllowed) {
                lastRotate = currentTime;
                if(pressed.some(...KeyBoardController.ROTATE_LEFT))
                    currentPiece.rotateCurrentPiece($board, -1);
                if(pressed.some(...KeyBoardController.ROTATE_RIGHT))
                    currentPiece.rotateCurrentPiece($board);
            }
        } else lastRotate = 0;

    }

    function clearCompletedLines() {
        const filledRows = boardController.getFilledRows($board);
        const numberOfClearedLines = filledRows ? filledRows.length : 0;

        if (numberOfClearedLines > 0) {
            // TODO: update score
            lines.setLines($lines + numberOfClearedLines);
            board.clearCompletedLines();
        }
    }

    function animate(currentTime: number) {
        let deltaTime = currentTime - lastFrameTime
        lastFrameTime = currentTime;
        
        handlePlayerMovement(currentTime);
        timeSincePieceLastFell = boardController.handleAutomatedFalling({
            deltaTime, 
            timeSincePieceLastFell, 
            currentPiece, 
            fallRate: $fallRate
        });
        if (boardController.detectMatrixCollision($currentPiece, $board)) {
            boardController.mergeCurrentPieceIntoBoard($currentPiece, board);
            clearCompletedLines();
            const randomPiece = pieceController.getRandomPiece();
            currentPiece.setCurrentPiece(pieceController.centerPiece(randomPiece));

            // If there is still a collision right after a new piece is spawned, the game ends.
            if (boardController.detectMatrixCollision($currentPiece, $board))
                return;
        }
        animationID = requestAnimationFrame(animate);
    }

    function resetGame() {
        timeSincePieceLastFell = 0;
        lastFrameTime = 0;
        board.resetBoard();
        const piece = pieceController.centerPiece(pieceController.getRandomPiece());
        currentPiece.setCurrentPiece(piece);
    }

    onMount(() => {
        pressed.start(document);
        resetGame();
        animationID = requestAnimationFrame(animate);
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