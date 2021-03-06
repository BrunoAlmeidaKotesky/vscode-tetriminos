<script lang="ts">
    import { onMount, setContext } from "svelte";
    import * as pressed from "pressed";
    import {
        COLS,
        ROWS,
        BLOCK_SIZE,
        TETRIMINOS,
        KeyBoardController,
RotationDirection,
    } from "../helpers/constants";
    import { pieceController } from "../controllers/PieceController";
    import board from "../stores/board";
    import currentPiece from "../stores/currentPiece";
    import { level } from "../stores/levelStore";
    import nextPiece from "../stores/nextPieceStore";
    import lines from "../stores/lineStore";
    import scoreStore from "../stores/scoreStore";
    import { fallRate } from "../stores/fallRateStore";
    import statsScore from "../stores/statsStore";
    import boardController from "../controllers/BoardController";
    // components
    import Statistics from "./Statistics.svelte";
    import Lines from "./Lines.svelte";
    import Board from "./Board.svelte";
    import Score from "./Score.svelte";
    import NextPiece from "./NextPiece.svelte";
    import Level from "./Level.svelte";
    import statsStore from "../stores/statsStore";
    import holdPieceStore from "../stores/holdPieceStore";
    import HoldPiece from "./HoldPiece.svelte";
    import Info from "./Info.svelte";

    const canvasWidth = COLS * BLOCK_SIZE;
    const canvasHeight = ROWS * BLOCK_SIZE;
    const nextWidth = 4 * BLOCK_SIZE;
    const nextHeight = 4 * BLOCK_SIZE;
    statsScore.setBaseStats(pieceController?.tetriminos);
    setContext(TETRIMINOS, {
        currentPiece,
        board,
        nextPiece,
        level,
        lines,
        scoreStore,
        statsScore,
        holdPieceStore
    });

    let animationID: number | null = null;
    let lastLeftMove: number = 0;
    let lastRightMove: number = 0;
    let lastDownMove: number = 0;
    let timeSincePieceLastFell: number = 0;
    let lastRotate: number = 0;
    let lastFrameTime: number = 0;
    let lastDropMove: number = 0;
    let softDropCount: number = 0;
    let timeSinceSwap: number = 0;

    function handlePlayerMovement(currentTime: number) {
        const [
            isLeftMovementAllowed,
            isRightMovementAllowed,
            isDownMovementAllowed,
            playerSidewaysThreshold,
            isDropMovementAllowed,
        ] = boardController.calculateMovement(currentTime, [
            lastLeftMove,
            lastRightMove,
            lastDownMove,
            lastDropMove,
        ]);
        const isRotateMovementAllowed = currentTime - lastRotate > playerSidewaysThreshold;
        const isSwapMovementAllowed = currentTime - timeSinceSwap > playerSidewaysThreshold;
        if (pressed.some(KeyBoardController.DOWN)) {
            if (isDownMovementAllowed) {
                lastDownMove = currentTime;
                timeSincePieceLastFell = 0;
                softDropCount += 1;
                currentPiece.movePieceDown($board);
                boardController.calculateGhostPosition($board, $currentPiece);
                return;
            }
        } else {
            lastDownMove = 0;
            softDropCount = 0;
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

        if (
            pressed.some(
                ...KeyBoardController.ROTATE_LEFT,
                ...KeyBoardController.ROTATE_RIGHT
            )
        ) {
            if (isRotateMovementAllowed) {
                lastRotate = currentTime;
                if (pressed.some(...KeyBoardController.ROTATE_LEFT))
                    currentPiece.rotateCurrentPiece($board, RotationDirection.LEFT);
                if (pressed.some(...KeyBoardController.ROTATE_RIGHT))
                    currentPiece.rotateCurrentPiece($board, RotationDirection.RIGHT);
            }
        } else lastRotate = 0;

        if (pressed.some(KeyBoardController.DROP)) {
            if (isDropMovementAllowed) {
                lastDropMove = currentTime + 500;
                timeSincePieceLastFell = 0;
                softDropCount += 1;
                currentPiece.movePieceDown($board, true);
                return;
            }
        } else {
            lastDropMove = 0;
            softDropCount = 0;
        }
        if (pressed.some(KeyBoardController.RESET))
            resetGame(true);
        if(pressed.some(KeyBoardController.HOLD)) {
            if(isSwapMovementAllowed) {
                timeSinceSwap = currentTime;
                pieceController.swapHoldPiece({currentPiece, holdPieceStore, nextPiece, statsStore});
                pressed.reset();
            }
        } else timeSinceSwap = 0;
    }

    function clearCompletedLines() {
        const filledRows = boardController.getFilledRows($board);
        const numberOfClearedLines = filledRows ? filledRows.length : 0;
        if (numberOfClearedLines > 0) {
            lines.setLines($lines + numberOfClearedLines);
            board.clearCompletedLines();
            scoreStore.addClearedLineScore(numberOfClearedLines, $level);
        }
    }

    function animate(currentTime: number) {
        let deltaTime = currentTime - lastFrameTime;
        lastFrameTime = currentTime;
        handlePlayerMovement(currentTime);
        timeSincePieceLastFell = boardController.handleAutomatedFalling({
            deltaTime,
            timeSincePieceLastFell,
            currentPiece,
            fallRate: $fallRate,
        });
        if (boardController.detectMatrixCollision($currentPiece, $board, )) {
            boardController.mergeCurrentPieceIntoBoard($currentPiece, board, holdPieceStore);
            scoreStore.addPieceScore(softDropCount);
            softDropCount = 0;
            clearCompletedLines();
            pieceController.makeNextPieceCurrent(
                currentPiece,
                $nextPiece,
                statsStore,
                $currentPiece?.id
            );
            pieceController.randomizeNextPiece(nextPiece);

            // If there is still a collision right after a new piece is spawned, the game ends.
            if (boardController.detectMatrixCollision($currentPiece, $board)) {
                cancelAnimationFrame(animationID as number);
                animationID = null;
                resetGame(true);
                animationID = requestAnimationFrame(animate);
                return;
            }
        }
        animationID = requestAnimationFrame(animate);
    }

    function resetGame(currentGame = false) {
        timeSincePieceLastFell = 0;
        lastFrameTime = 0;
        board.resetBoard();
        if(currentGame) {
            animationID = null;
            lastLeftMove = 0;
            lastRightMove = 0;
            lastDownMove = 0;
            timeSincePieceLastFell = 0;
            lastRotate = 0;
            lastFrameTime = 0;
            lastDropMove = 0;
            softDropCount = 0;
            timeSinceSwap = 0;
            lines.resetLines();
            holdPieceStore.reset();
            statsScore.setBaseStats(pieceController?.tetriminos);
            scoreStore.reset();
        }
        pieceController.randomizeNextPiece(nextPiece);
        pieceController.makeNextPieceCurrent(
            currentPiece,
            $nextPiece,
            statsStore,
            $currentPiece?.id
        );
        pieceController.randomizeNextPiece(nextPiece);
    }

    onMount(() => {
        pressed.start(document);
        resetGame();
        animationID = requestAnimationFrame(animate);
    });
</script>

<div class="game">
    <section class="stats">
        <Statistics stats={$statsStore}/>
    </section>
    <section>
        <Lines />
        <Board width={canvasWidth} height={canvasHeight} />
    </section>
    <section class="meta">
        <!-- SCORE -->
        <Score />
        <!-- NEXT/HOLD PIECE -->
        <NextPiece height={nextHeight} width={nextWidth} />
        <HoldPiece height={nextHeight} width={nextWidth} />
        <!-- LEVEL -->
        <Level />
    </section>
    <section>
        <Info/>
    </section>
</div>
<svelte:head>
    <style>
        .game {
            max-width: 56rem;
            display: grid;
            grid-template-columns: 220px auto 96px auto;
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
        .infoGrid {
            display: grid;
            row-gap: 6px;
        }
        .infoTitle {
            font-size: 1.2rem;
            font-weight: bold;
        }
    </style>
</svelte:head>
