import { writable } from 'svelte/store';
import { IPieceInformation, PieceColors } from '../controllers/PieceController';

const initialState: IPieceInformation = {
    name: '',
    matrix: [[0]],
    id: -1,
    color: PieceColors.BACKGROUND,
    rotation: 0,
    x: 0,
    y: 0,
}

function createNextPiece(piece = {} as IPieceInformation) {
    const { subscribe, set } = writable<IPieceInformation>(piece);

    return {
        subscribe,
        setNextPiece: (nextPiece: IPieceInformation) => set(nextPiece),
    };
}

export type NextPieceStore = ReturnType<typeof createNextPiece>;
export default createNextPiece(initialState);