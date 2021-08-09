import { BoardController } from "./BoardController";
import { utils } from '../helpers/Utils';

export class TileController {

    private flipMatrix(matrix: number[][]): number[][] {
        const h = matrix.length;
        const w = matrix[0].length;

        let newMatrix = BoardController.createEmptyMatrix(h, w);
        //Flip the new matrix
        for (let row = 0; row < w; row++) {
            for (let column = 0; column < h; column++) {
                newMatrix[column][row] = matrix[row][column];
            }
        }
        return newMatrix;
    }

    private rotateRight = (matrix: number[][]) => {
        return utils.mirror(this.flipMatrix(matrix));
    }

    private rotateLeft = (matrix: number[][]) => {
        return this.flipMatrix(matrix).reverse();
    }

    public rotate(matrix: number[][], direction: number): number[][] {
        if (direction && direction <= 0) 
            return this.rotateLeft(matrix);
        return this.rotateRight(matrix);
    }

}

export default new TileController();