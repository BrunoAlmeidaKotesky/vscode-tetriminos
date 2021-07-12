import {writable} from 'svelte/store';
import boardController, {BoardController} from '../controllers/BoardController';
import type { IPieceInformation } from '../controllers/PieceController';
import { COLS, ROWS } from '../helpers/constants';
import { Utils } from '../helpers/Utils';

const initialState = BoardController.createEmptyMatrix(COLS, ROWS);

function createBoard(initialBoard: number[][]) {
  const { subscribe, set, update } = writable(initialBoard);
  return {
    subscribe,
    resetBoard() {
      set(BoardController.createEmptyMatrix(COLS, ROWS));
    },
    mergePiecesIntoBoard(piece: IPieceInformation) {
      update(prevBoard => {
        const { matrix: pieceMatrix, x, y } = piece;
        const mergedBoard = Utils.combineMatrices(prevBoard, pieceMatrix, x, y, false);
        return mergedBoard;
      });
    }
  };
}

export default createBoard(initialState);