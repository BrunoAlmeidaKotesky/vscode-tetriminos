import type { NextPieceStore } from "../stores/nextPieceStore";
import type { BoardStore } from "../stores/board";
import type { CurrentPieceStore } from "../stores/currentPiece";
import type { LevelStore } from "../stores/levelStore";
import type { LineStore } from "../stores/lineStore";
import type { ScoreStore } from "../stores/scoreStore";
import type { StatsScore } from "../stores/statsStore";
import type { HoldPieceStore } from "../stores/holdPieceStore";

// BOARD
export const COLS = 10; //width
export const ROWS = 20; // height
export const PLAYER_SIDEWAYS_RATE = 6;
export const PLAYER_DOWN_RATE = 20;
// Falling rate should be expressed in steps per second.
export const INITIAL_FALL_RATE = 1;
// This number is added to the fall rate on each new level
export const FALL_RATE_LEVEL_MODIFIER = 0.8;
// Levels
export const START_LEVEL = 0;
export const NEW_LEVEL_EVERY = 5;
// PIECE
export const BLOCK_SIZE = 20;
export const LINE_POINTS = [40, 100, 300, 1200, 2400];

export interface IGameStore {
    readonly nextPiece: NextPieceStore;    
    readonly board: BoardStore;
    readonly currentPiece: CurrentPieceStore;
    readonly level: LevelStore;
    readonly lines: LineStore;
    readonly scoreStore: ScoreStore;
    readonly statsStore: StatsScore;
    readonly holdPieceStore: HoldPieceStore;
}
export const TETRIMINOS: Partial<IGameStore> = {};

export enum KeyBoardController {
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right",
    UP = "up",
    ENTER = "ENTER",
    HOLD = "C",
    ROTATE_RIGHT = "X",
    ROTATE_LEFT = "Z",
    DROP = "SPACE",
    RESET = "R"
}

export enum RotationDirection {
    LEFT = 0,
    RIGHT = 1
}

export enum RotationStates {
    /**Spawn state */
    SPAWN = 0,
    /**State resulting from a clockwise rotation ("right") from spawn */
    R = 1,
    /**State resulting from a counter-clockwise rotation ("left") from spawn */
    L = 2,
    /**State resulting from 2 successive rotations in either direction from spawn. */
    FULL_ROTATION = 3
}