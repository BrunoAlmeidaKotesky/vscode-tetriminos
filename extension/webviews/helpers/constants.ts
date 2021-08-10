// BOARD
export const COLS = 10; //width
export const ROWS = 20; // height
export const PLAYER_SIDEWAYS_RATE = 6;
export const PLAYER_DOWN_RATE = 20;
// Falling rate should be expressed in steps per second.
export const INITIAL_FALL_RATE = 1;
// This number is added to the fall rate on each new level
export const FALL_RATE_LEVEL_MODIFIER = 0.5;
// Levels
export const START_LEVEL = 0;
export const NEW_LEVEL_EVERY = 10;
// PIECE
export const BLOCK_SIZE = 20;
export const TETRIS = {};

export enum KeyBoardController {
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right",
    UP = "up",
    ENTER = "enter",
    HOLD = "c",
    ROTATE_RIGHT = "X",
    ROTATE_LEFT = "Z"
}