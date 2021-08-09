// BOARD
export const COLS = 10; //width
export const ROWS = 20; // height
export const PLAYER_SIDEWAYS_RATE = 6;
export const PLAYER_DOWN_RATE = 20;

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