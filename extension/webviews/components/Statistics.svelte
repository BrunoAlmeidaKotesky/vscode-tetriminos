<script lang="ts">
    import Display from "../components/Display.svelte";
    import Piece from "../components/Piece.svelte";
    import { pieceController } from "../controllers/PieceController";
    export let stats: {id: number, count: number}[] = [];

</script>
<Display>
    <div>
        <div class="title">Statistics</div>
        {#each stats as stat}
            <div class="stat">
                <Piece 
                    width={45}
                    height={20}
                    piece={pieceController?.tetriminos[stat.id - 1]}
                    scale={0.5}
                    xOffset={(4 - pieceController?.tetriminos[stat.id - 1].matrix[0].length) / 2} />
                <span>{stat?.count?.toString()?.padStart(3, "0")}</span>
            </div>
        {/each}
    </div>
</Display>

<style>
    .stat {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 5px;
    }
</style>
