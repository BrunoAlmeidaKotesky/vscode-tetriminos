import { writable } from 'svelte/store';
import { klona } from 'klona';
import type { IPieceInformation } from '../controllers/PieceController';
import boardController from '../controllers/BoardController';
import tilesController, { TileKeys } from '../controllers/TileController';
import type { Matrix } from '../types';

const initialState = null;

function moveAndCheck(piece: IPieceInformation, board: Matrix, direction: number) {
    const newPiece = klona(piece);//{...piece};
    newPiece.x += direction;
    if (boardController.detectMatrixCollision(newPiece, board))
        return piece;
    return newPiece;
}

function createCurrentPiece(initialPiece: IPieceInformation | null) {
    const { set, update, subscribe } = writable<IPieceInformation>();
    return {
        subscribe,
        setCurrentPiece: (piece: IPieceInformation) => set(piece),
        movePieceLeft: (board: Matrix) => {
            update(prevPiece => moveAndCheck(prevPiece as IPieceInformation, board, -1));
        },
        movePieceRight: (board: Matrix) => {
            update(prevPiece => moveAndCheck(prevPiece as IPieceInformation, board, 1));
        },
        movePieceDown(board: Matrix) {
            update(prevPiece => {
                const newPiece = klona(prevPiece);//{...prevPiece as IPieceInformation};
                newPiece.y += 1;
                return newPiece;
            });
        },
        rotateCurrentPiece(board: Matrix, direction = 1) {
            update(prevPiece => {
                // 0. if this is the "O" piece we can just return it
                if (prevPiece.name === 'O')
                    return prevPiece;
                // 1. clone the current piece in case we have to return unchanged
                let newPiece = klona(prevPiece);
                // 2. store a reference to the starting rotation position (0-3) and advance rotation position
                const rotation = newPiece.rotation;
                newPiece.rotation = (prevPiece.rotation + 1) % 4;
                // 3. rotate the cloned piece's matrix
                newPiece.matrix = tilesController.rotate(newPiece.matrix, direction);
                // 4. If the rotation results in a collision
                if (boardController.detectMatrixCollision(newPiece, board)) {
                    // 4a. Find the tests for this piece from the pre-defined object of kicks
                    const kicks = tilesController.tileKicks;
                    const filteredKick = Object.keys(kicks).filter(kick => kick.includes(newPiece.name)) as unknown as TileKeys;
                    const pieceKicks = kicks[filteredKick];
                    // 4b. Grab the tests for the current start rotation and direction
                    const tests = pieceKicks.filter(k => k?.rotation === rotation && k?.direction === direction)[0].tests;
                    // 4c. Store reference to current state
                    let validRotation = false;
                    // 4d. Run thru the tests - return the new piece adjusted for kick when first non-collision position found
                    for (let test of tests) {
                        // 5. If test results in collision-free placement
                        if (!boardController.detectMatrixCollision(newPiece, board, test.dx, test.dy)) {
                            validRotation = true;
                            newPiece.x += test.dx;
                            newPiece.y += test.dy;

                            break;
                        }
                    }
                    // 6. After checking our tests return new or previous piece
                    return validRotation ? newPiece : prevPiece;
                }
                return newPiece;
            });
        }
    };
}

export type CurrentPieceStore = ReturnType<typeof createCurrentPiece>;

export default createCurrentPiece(initialState);