import {writable} from 'svelte/store';
import type { IPieceInformation } from '../controllers/PieceController';
import { PieceColors } from '../controllers/PieceController';

type IHoldPiece = IPieceInformation & {canBeSwapped: boolean};
const initialState: IHoldPiece = {
    name: '',
    matrix: [[0]],
    id: -1,
    color: PieceColors.BACKGROUND,
    rotation: 0,
    x: 0,
    y: 0,
    canBeSwapped: false
}
function createHoldPiece(piece = {} as IHoldPiece) {
    const { subscribe, set, update } = writable<IHoldPiece>(piece);

    return {
        subscribe,
        setHoldPiece: (nextPiece: IHoldPiece) => set(nextPiece),
        makeSwappable: () => update(prevPiece => {
            return {
                ...prevPiece,
                canBeSwapped: true
            }
        }),
        reset: () => set(initialState)
    };
}

export type HoldPieceStore = ReturnType<typeof createHoldPiece>;
export default createHoldPiece(initialState as unknown as IHoldPiece);