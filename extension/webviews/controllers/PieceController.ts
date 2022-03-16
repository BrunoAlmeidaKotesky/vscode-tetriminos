/* eslint-disable @typescript-eslint/naming-convention */
import { klona } from "klona";
import { get } from "svelte/store";
import { BLOCK_SIZE, COLS, IGameStore } from "../helpers/constants";
import { utils } from "../helpers/Utils";
import type { CurrentPieceStore } from "../stores/currentPiece";
import type { NextPieceStore } from "../stores/nextPieceStore";
import type { StatsScore } from "../stores/statsStore";
import type { Matrix } from "../types";

export enum PieceColors {
    T = '#6B46C1',
    J = '#F6AD55',
    Z = '#E53E3E',
    O = '#F6E05E',
    S = '#68D391',
    L = '#2B6CB0',
    I = '#4FD1C5',
    BACKGROUND = '#000000',
    GHOST_PIECE = 'rgb(170 170 170 / 22%)'
}

export interface IPieceInformation {
    name: string;
    id: number;
    color: PieceColors;
    matrix: Matrix;
    x: number;
    y: number;
    rotation: number;
}

//Create a function to rotate a tetris piece

export class PieceController {
    private id: number = 0;
    private bag: IPieceInformation[] = [];
    public tetriminos: IPieceInformation[] = [];
    constructor() {
        this.tetriminos = this.getTetriminos();
    }

    private matrixes = {
        T: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
        J: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
        Z: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ],
        O: [
            [1, 1],
            [1, 1],
        ],
        S: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ],
        L: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0],
        ],
        I: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
    };

    private createPiece(name: string, color: PieceColors, matrix: Matrix): IPieceInformation {
        this.id++;
        // map non-zero values to the id of this piece
        matrix = matrix.map(row => row.map(value => (value === 0 ? 0 : this.id)));
        return {
            name,
            id: this.id,
            color,
            matrix,
            x: 0,
            y: 0,
            rotation: 0
        };
    }


    private getTetriminos() {
        return [
            this.createPiece('I', PieceColors.I, this.matrixes.I),
            this.createPiece('L', PieceColors.L, this.matrixes.L),
            this.createPiece('J', PieceColors.J, this.matrixes.J),
            this.createPiece('O', PieceColors.O, this.matrixes.O),
            this.createPiece('T', PieceColors.T, this.matrixes.T),
            this.createPiece('S', PieceColors.S, this.matrixes.S),
            this.createPiece('Z', PieceColors.Z, this.matrixes.Z)
        ];
    }

    private drawBlock(ctx: CanvasRenderingContext2D, row: number, column: number, color: PieceColors) {
        const x = row * BLOCK_SIZE;
        const y = column * BLOCK_SIZE;
        const w = BLOCK_SIZE;
        const h = BLOCK_SIZE;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);

        this.drawHighlight(ctx, x, y, w, h);
    }

    /**
     * Draws a highlight to a block within the given ctx
     * @param {CanvasRenderingContext2D} ctx The ctx to draw to.
     * @param {Number} x The x coordinate for the fill
     * @param {Number} y The y coordinate for the fill
     * @param {Number} w  The width of the block
     * @param {Number} h The height of the block
     */
    private drawHighlight(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w - 2, y + 2);
        ctx.lineTo(x + 2, y + 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 255, 255, .2)`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + w, y);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x + w - 2, y + h - 2);
        ctx.lineTo(x + w - 2, y + 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(255,255,255, .2)`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + w, y + h);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x + 2, y + h - 2);
        ctx.lineTo(x + w - 2, y + h - 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(0,0,0, .4)`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x, y);
        ctx.lineTo(x + 2, y + 2);
        ctx.lineTo(x + 2, y + h - 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(0,0,0, .2)`;
        ctx.fill();
    }

    /**
     * Draws a rectangle representing a board
     *
     * @param {CanvasRenderingContext2D} ctx The canvas 2D ctx
     * @param {Array} boardMatrix The 2D array to use as our coordinates
     */
    private drawBoard(ctx: CanvasRenderingContext2D, boardMatrix: Matrix): void {
        this.drawMatrix(ctx, boardMatrix, 0, 0);
    }

    /**
     * Draw a single tetromino to an HTML canvas
     *
     * @param {CanvasRenderingContext2D} ctx The canvas 2D ctx
     * @param {Object} piece The piece object to use
     */
    private drawPiece(ctx: CanvasRenderingContext2D, piece: IPieceInformation) {
        this.drawMatrix(ctx, piece.matrix, piece.x, piece.y);
    }

    private drawGhostPiece(ctx: CanvasRenderingContext2D, ghostPiece: IPieceInformation) {
        this.drawMatrix(ctx, ghostPiece.matrix, ghostPiece.x, ghostPiece.y, ghostPiece.color);
    }

    /**
     * Clears then draws a board and current piece to the canvas
     *
     * @param {CanvasRenderingContext2D} ctx The canvas 2D ctx
     * @param {Array} board The 2D array to use as our coordinates
     * @param {Object} currentPiece The piece object to use
     */
    public drawGame(ctx: CanvasRenderingContext2D, board: Matrix, currentPiece: IPieceInformation, ghostPiece: IPieceInformation) {
        this.clearCanvas(ctx, PieceColors.BACKGROUND);
        this.drawBoard(ctx, board);
        this.drawPiece(ctx, currentPiece);
        this.drawGhostPiece(ctx, ghostPiece);
    }

    /**
     * Renders the provided matrix to a canvas
     * @param {CanvasRenderingContext2D} ctx The canvas 2D ctx
     * @param {Array} matrix The 2D array to use as our coordinates
     * @param {Number} xOffset
     * @param {Number} yOffset
     */
    public drawMatrix(ctx: CanvasRenderingContext2D, matrix: Matrix, xOffset: number, yOffset: number = 0, customColor?: PieceColors) {
        matrix.forEach((col, colIndex) => {
            col.forEach((row, rowIndex) => {
                // eslint-disable-next-line curly
                if (row !== 0)
                    this.drawBlock(ctx, rowIndex + xOffset, colIndex + yOffset, customColor ? customColor : this.getColorForID(row) as PieceColors);
            });
        });
    }

    private getColorForID = (id: number) => this?.tetriminos?.find(o => o?.id === id)?.color;

    /**
     * Reset the canvas
     *
     * @param {CanvasRenderingContext2D} ctx The canvas 2D ctx
     * @param {PieceColors} color The color to fill the resulting rectangle with
     */
    public clearCanvas(ctx: CanvasRenderingContext2D, color: PieceColors) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    public getRandomPiece() {
        const length = this.tetriminos.length;
        const idx = Math.floor(Math.random() * length);
        return this.tetriminos[idx];
    }

    /**
     * Positions a piece in the center of the board.
     * @returns a copy of the input piece
     */
    public centerPiece(piece: IPieceInformation): IPieceInformation {
        const clonePiece = klona(piece);
        clonePiece.x = Math.floor((COLS - clonePiece.matrix[0].length) / 2);
        clonePiece.y = piece.name === 'I' ? -1 : 0;
        return clonePiece;
    }

    public randomizeNextPiece(nextPiece: NextPieceStore) {
        if(this.bag.length === 0) 
            this.createPieceBag();
        const pice = this.bag.pop();
        nextPiece.setNextPiece(pice as IPieceInformation);
    }

    public makeNextPieceCurrent(currentPiece: CurrentPieceStore, $nextPiece: IPieceInformation, stats: StatsScore, currentPieceId: number) {
        const spawnedPiece = this.centerPiece($nextPiece);
        currentPiece.setCurrentPiece(spawnedPiece);
        stats.updateStats(currentPieceId);
    }

    private createPieceBag() {
        if(this.bag.length === 0)
            this.bag = klona(this.tetriminos);
        utils.shuffle(this.bag);
    }

    //Create an method that make the current piece the holding piece, and set the next to be the current
    public swapHoldPiece(stores: Pick<IGameStore, 'currentPiece'|'holdPieceStore'|'nextPiece'|'statsStore'>) {
        const {currentPiece: currentPieceStore, nextPiece: nextPieceStore, holdPieceStore, statsStore} = stores;
        const currentPiece = get(currentPieceStore);
        const nextPiece = get(nextPieceStore);
        const holdingPiece = get(holdPieceStore);
        
        if(holdingPiece.id === -1) {
            holdPieceStore.setHoldPiece({...currentPiece, canBeSwapped: false});
            this.makeNextPieceCurrent(currentPieceStore, nextPiece, statsStore, currentPiece?.id);
            this.randomizeNextPiece(nextPieceStore);
        } else {
            if(holdingPiece?.canBeSwapped) {
                holdPieceStore.setHoldPiece({...currentPiece, canBeSwapped: false});
                currentPieceStore.setCurrentPiece(this.centerPiece(holdingPiece));
            }
        }
    }
    
}

const pieceController = new PieceController();
export { pieceController };