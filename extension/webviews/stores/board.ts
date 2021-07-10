import {writable} from 'svelte/store';
import {BoardController} from '../controllers/BoardController';
import { COLS, ROWS } from '../helpers/constants';

const initialState = BoardController.getEmptyBoard(COLS, ROWS);

function createBoard(initialBoard: number[][]) {
  const { subscribe, set, update } = writable(initialBoard);
  return {
    subscribe,
    resetBoard() {
      set(BoardController.getEmptyBoard(COLS, ROWS));
    },
  };
}

export default createBoard(initialState);