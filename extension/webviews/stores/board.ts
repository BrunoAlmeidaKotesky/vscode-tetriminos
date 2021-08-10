import {writable} from 'svelte/store';
import {BoardController} from '../controllers/BoardController';
import type { IPieceInformation } from '../controllers/PieceController';
import { COLS, ROWS } from '../helpers/constants';
import { utils } from '../helpers/Utils';
import type { Matrix } from '../types';

const initialState = BoardController.createEmptyMatrix(COLS, ROWS);

function createBoard(initialBoard: Matrix) {
  const { subscribe, set, update } = writable(initialBoard);
  return {
    subscribe,
    resetBoard() {
      set(BoardController.createEmptyMatrix(COLS, ROWS));
    },
    mergePiecesIntoBoard(piece: IPieceInformation) {
      update(prevBoard => {
        const { matrix: pieceMatrix, x, y } = piece;
        const mergedBoard = utils.combineMatrices(prevBoard, pieceMatrix, x, y, false);
        return mergedBoard;
      });
    }
  };
}

export type BoardStore = ReturnType<typeof createBoard>;

export default createBoard(initialState);