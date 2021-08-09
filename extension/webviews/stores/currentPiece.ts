import { writable } from 'svelte/store'
import {klona} from 'klona';
import type { IPieceInformation } from '../controllers/PieceController';
import boardController from '../controllers/BoardController';
import tilesController from '../controllers/TileController';

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
        },
        rotateCurrentPiece(board: number[][], direction = 1) {
            update(prevPiece => {
              // 0. if this is the "O" piece we can just return it
              // 1. clone the current piece in case we have to return unchanged
              let newPiece = klona(prevPiece);
              // 2. store a reference to the starting rotation position (0-3) and advance rotation position
              const rotation = newPiece.rotation;
              newPiece.rotation = (prevPiece.rotation + 1) % 4;
              // 3. rotate the cloned piece's matrix
              newPiece.matrix = tilesController.rotate(newPiece.matrix, direction);
      
              // 4. If the rotation results in a collision
                // 4a. Find the tests for this piece from the pre-defined object of kicks
                // 4b. Grab the tests for the current start rotation and direction
                // 4c. Store reference to current state
                // 4d. Run thru the tests - return the new piece adjusted for kick when first non-collision position found
      
              // 5. If test results in collision-free placement
      
              // 6. After checking our tests return new or previous piece
              return newPiece;
            });
          }
    };
}

export type CurrentPieceStore = ReturnType<typeof createCurrentPiece>;

export default createCurrentPiece(initialState);