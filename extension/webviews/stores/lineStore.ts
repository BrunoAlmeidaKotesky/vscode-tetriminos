import { writable } from 'svelte/store';

function createLine(initialValue: number) {
    const { set, update, subscribe } = writable(initialValue);
    return {
        subscribe,
        resetLines: () => set(initialValue),
        setLines: (lines: number) => set(lines),
    };
}

const initialState: number = 0;
export default createLine(initialState);
export type LineStore = ReturnType<typeof createLine>;