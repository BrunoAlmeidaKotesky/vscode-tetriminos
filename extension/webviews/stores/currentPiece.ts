import { writable } from 'svelte/store'
import {klona} from 'klona';
import type { IPieceInformation } from '../controllers/PieceController';
import boardController from '../controllers/BoardController';

const initialState = null;

function moveAndCheck(piece: IPieceInformation, board: number[][], direction: number) {
    const newPiece = klona(piece);//{...piece};
    newPiece.x += direction;
    if(boardController.detectMatrixCollision(newPiece, board)) 
        return piece;
    return newPiece;
}

function createCurrentPiece(initialPiece: IPieceInformation|null) {
    const { set, update, subscribe } = writable<IPieceInformation>();
    return {
        subscribe,
        setCurrentPiece: (piece: IPieceInformation) => set(piece),
        movePieceLeft: (board: number[][]) => {
            update(prevPiece => moveAndCheck(prevPiece as IPieceInformation, board, -1));
        },
        movePieceRight: (board: number[][]) => {
            update(prevPiece => moveAndCheck(prevPiece as IPieceInformation, board, 1));
        },
        movePieceDown(board: number[][]) {
          update(prevPiece => {
            const newPiece = klona(prevPiece);//{...prevPiece as IPieceInformation};
            newPiece.y += 1;
            return newPiece;
          });
        }
    };
}

export type CurrentPieceStore = ReturnType<typeof createCurrentPiece>;

export default createCurrentPiece(initialState);