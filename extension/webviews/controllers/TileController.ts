import { BoardController } from "./BoardController";
import { utils } from '../helpers/Utils';
import type { Matrix } from "../types";

interface IKickTests {
  dx: number;
  dy: number;
}

interface IKickInformation {
  rotation: number;
  direction: number;
  tests: IKickTests[];
}

interface ITileRotationKick {
  JLSTZ: IKickInformation[];
  I: IKickInformation[];
}

export type TileKeys = keyof ITileRotationKick;


export class TileController {

  public readonly tileKicks: ITileRotationKick = {
    'JLSTZ': [
      {
        rotation: 0,
        direction: -1,
        tests: [
          {
            dx: 0,
            dy: 0
          },
          {
            dx: 1,
            dy: 0
          },
          {
            dx: 1,
            dy: -1
          },
          {
            dx: 0,
            dy: 2
          },
          {
            dx: 1,
            dy: 2
          },
        ]
      },
      {
        rotation: 0,
        direction: 1,
        tests: [
          {
            dx: 0, dy: 0
          },
          {
            dx: -1, dy: 0
          },
          {
            dx: -1, dy: -1
          },
          {
            dx: 0, dy: 2
          },
          {
            dx: -1, dy: 2
          },
        ]
      },
      {
        rotation: 1,
        direction: -1,
        tests: [
          {
            dx: 0, dy: 0,
          },
          {
            dx: 1, dy: 0,
          },
          {
            dx: 1, dy: 1,
          },
          {
            dx: 0, dy: -2,
          },
          {
            dx: 1, dy: -2,
          },
        ]
      },
      {
        rotation: 1,
        direction: 1,
        tests: [
          {
            dx: 0, dy: 0,
          },
          {
            dx: 1, dy: 0,
          },
          {
            dx: 1, dy: 1,
          },
          {
            dx: 0, dy: -2,
          },
          {
            dx: 1, dy: -2,
          },
        ]
      },
      {
        rotation: 2,
        direction: -1,
        tests: [
          {
            dx: 0, dy: 0,
          },
          {
            dx: -1, dy: 0,
          },
          {
            dx: -1, dy: -1,
          },
          {
            dx: 0, dy: 2,
          },
          {
            dx: -1, dy: 2,
          },
        ]
      },
      {
        rotation: 2,
        direction: 1,
        tests: [
          {
            dx: 0, dy: 0,
          },
          {
            dx: 1, dy: 0,
          },
          {
            dx: 1, dy: -1,
          },
          {
            dx: 0, dy: 2,
          },
          {
            dx: 1, dy: 2,
          },
        ]
      },
      {
        rotation: 3,
        direction: -1,
        tests: [
          {
            dx: 0, dy: 0,
          },
          {
            dx: -1, dy: 0,
          },
          {
            dx: -1, dy: 1,
          },
          {
            dx: 0, dy: -2,
          },
          {
            dx: -1, dy: -2,
          },
        ]
      },
      {
        rotation: 3,
        direction: 1,
        tests: [
          {
            dx: 0, dy: 0,
          },
          {
            dx: -1, dy: 0,
          },
          {
            dx: -1, dy: 1,
          },
          {
            dx: 0, dy: -2,
          },
          {
            dx: -1, dy: -2,
          },
        ]
      }
    ],
    'I': [
      {
        rotation: 0,
        direction: -1,
        tests: [
          {
            dx: 0, dy: 0,
          },
          {
            dx: -1, dy: 0,
          },
          {
            dx: 2, dy: 0,
          },
          {
            dx: -1, dy: -2,
          },
          {
            dx: 2, dy: 1,
          },
        ]
      },
      {
        rotation: 0,
        direction: 1,
        tests: [
          {
            dx: 0, dy: 0,
          },
          {
            dx: -2, dy: 0,
          },
          {
            dx: 1, dy: 0,
          },
          {
            dx: -2, dy: 1,
          },
          {
            dx: 1, dy: -2,
          },
        ]
      },
      {
        rotation: 1,
        direction: -1,
        tests: [
          {
            dx: 0, dy: 0,
          },
          {
            dx: 2, dy: 0,
          },
          {
            dx: -1, dy: 0,
          },
          {
            dx: 2, dy: -1,
          },
          {
            dx: -1, dy: 2,
          },
        ]
      },
      {
        rotation: 1,
        direction: 1,
        tests: [
          {
            dx: 0, dy: 0,
          },
          {
            dx: -1, dy: 0,
          },
          {
            dx: 2, dy: 0,
          },
          {
            dx: -1, dy: -2,
          },
          {
            dx: 2, dy: 1,
          },
        ]
      },
      {
        rotation: 2,
        direction: -1,
        tests: [
          {
            dx: 0, dy: 0,
          },
          {
            dx: 1, dy: 0,
          },
          {
            dx: -2, dy: 0,
          },
          {
            dx: 1, dy: 2,
          },
          {
            dx: -2, dy: -1,
          },
        ]
      },
      {
        rotation: 2,
        direction: 1,
        tests: [
          {
            dx: 0, dy: 0,
          },
          {
            dx: 2, dy: 0,
          },
          {
            dx: -1, dy: 0,
          },
          {
            dx: 2, dy: -1,
          },
          {
            dx: -1, dy: 2,
          },
        ]
      },
      {
        rotation: 3,
        direction: 1,
        tests: [
          {
            dx: 0, dy: 0,
          },
          {
            dx: -2, dy: 0,
          },
          {
            dx: 1, dy: 0,
          },
          {
            dx: -2, dy: 1,
          },
          {
            dx: 1, dy: -2,
          },
        ]
      },
      {
        rotation: 3,
        direction: 1,
        tests: [
          {
            dx: 0, dy: 0,
          },
          {
            dx: 1, dy: 0,
          },
          {
            dx: -2, dy: 0,
          },
          {
            dx: 1, dy: 2,
          },
          {
            dx: -2, dy: -1,
          },
        ]
      }
    ]
  }

  private flipMatrix(matrix: Matrix): Matrix {
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

  private rotateRight = (matrix: Matrix) => {
    return utils.mirror(this.flipMatrix(matrix));
  }

  private rotateLeft = (matrix: Matrix) => {
    return this.flipMatrix(matrix).reverse();
  }

  public rotate(matrix: Matrix, direction: number): Matrix {
    if (direction && direction <= 0)
      return this.rotateLeft(matrix);
    return this.rotateRight(matrix);
  }

}

export default new TileController();