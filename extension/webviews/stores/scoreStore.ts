import { LINE_POINTS } from "../helpers/constants";
import { writable } from "svelte/store";

const initialState = 0;

function createScore(initialValue: number) {
    const { set, update, subscribe } = writable(initialValue);
    return {
        subscribe,
        reset: () => set(initialState),
        addPieceScore: (points: number) => update(prevScore => prevScore + points),
        addClearedLineScore(cleared: number, currentLevel: number) {
            update(prevScore => {
                const linesPointIndex = cleared - 1;
                const basePoints = LINE_POINTS[linesPointIndex]
                const increase = basePoints * (currentLevel + 1)
                return prevScore + increase;
            });
        }
    };
}

export type ScoreStore = ReturnType<typeof createScore>;
export default createScore(initialState);