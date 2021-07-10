import { writable } from 'svelte/store'
import type { IPieceInformation } from '../controllers/PieceController';

const initialState = null;
function createCurrentPiece(initialPiece: IPieceInformation|null) {
    const { set, update, subscribe } = writable();
    return {
        subscribe,
        setCurrentPiece: (piece: IPieceInformation) => set(piece),
    };
}

export default createCurrentPiece(initialState);