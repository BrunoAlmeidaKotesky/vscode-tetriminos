import { writable } from 'svelte/store'
import type { IPieceInformation } from '../controllers/PieceController'

const initialState: {id: number, count: number}[] = [];

function createStats(initialStats: {id: number, count: number}[]) {
    const { subscribe, set, update } = writable(initialStats)

    return {
        subscribe,
        setBaseStats(pieces: IPieceInformation[]) {
            let stats: {id: number, count: number}[] = []
            stats = pieces?.map(piece => {
                return {
                    id: piece.id,
                    count: 0,
                }
            });
            set(stats);
        },
        updateStats(id: number) {
            update(prevStats => {
                const index = prevStats?.findIndex(item => item?.id === id);
                if (index !== -1) 
                    prevStats[index].count++
                return prevStats;
            })
        }
    }
}

export type StatsScore = ReturnType<typeof createStats>;
export default createStats(initialState);