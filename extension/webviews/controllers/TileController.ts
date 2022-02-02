import { BoardController } from "./BoardController";
import { utils } from '../helpers/Utils';
import type { Matrix } from "../types";
import { RotationDirection, RotationStates } from "../helpers/constants";
interface IKickTests {
  dx: number;
  dy: number;
}

interface IKickInformation {
  rotation: RotationStates;
  direction: RotationDirection;
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
        direction: RotationDirection.LEFT,
        rotation: RotationStates.SPAWN,
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
        direction: RotationDirection.RIGHT,
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
        direction: RotationDirection.LEFT,
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
        direction: RotationDirection.RIGHT,
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
        direction: RotationDirection.LEFT,
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
        direction: RotationDirection.RIGHT,
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
        direction: RotationDirection.LEFT,
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
        direction: RotationDirection.RIGHT,
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
        rotation: RotationStates.SPAWN,
        direction: RotationDirection.RIGHT,
        tests: [
          {dx: 0, dy: 0},
          {dx: -2, dy: 0},
          {dx: 1, dy: 0},
          {dx: -2, dy: -1},
          {dx: 1, dy: 2},
        ]
      },
      {
        rotation: RotationStates.SPAWN,
        direction: RotationDirection.LEFT,
        tests: [
          {dx: 0, dy: 0},
          {dx: -1, dy: 0},
          {dx: 2, dy: 0},
          {dx: -1, dy: 2},
          {dx: 2, dy: -1}
        ]
      },
      {
        rotation: RotationStates.FULL_ROTATION,
        direction: RotationDirection.RIGHT,
        tests: [
          {dx: 0, dy: 0},
          {dx: 1, dy: 0},
          {dx: -2, dy: 0},
          {dx: 1, dy: -2},
          {dx: -2, dy: 1}
        ]
      },
      {
        rotation: RotationStates.FULL_ROTATION,
        direction: RotationDirection.LEFT,
        tests: [
          {dx: 0, dy: 0},
          {dx: 2, dy: 0},
          {dx: -1, dy: 0},
          {dx: 2, dy: 1},
          {dx: -1, dy: -2}
        ]
      },
      {
        rotation: RotationStates.R,
        direction: RotationDirection.LEFT,
        tests: [
          {dx: 0, dy: 0},
          {dx: 1, dy: 0},
          {dx: 1, dy: -1},
          {dx: 0, dy: 2},
          {dx: 1, dy: 2},
        ]
      },
      {
        rotation: RotationStates.R,
        direction: RotationDirection.RIGHT,
        tests: [
          {dx: 0, dy: 0},
          {dx: 1, dy: 0},
          {dx: 1, dy: -1},
          {dx: 0, dy: 2},
          {dx: 1, dy: 2},
        ]
      },
      {
        rotation: RotationStates.L, //Nao arrumei
        direction: RotationDirection.LEFT,
        tests: [
          {dx: 0, dy: 0},
          {dx: -2, dy: 0},
          {dx: 1, dy: 0},
          {dx: -2, dy: -1},
          {dx: 1, dy: 2},
        ]
      },
      {
        rotation: RotationStates.L, //Nao arrumei
        direction: RotationDirection.RIGHT,
        tests: [
          {dx: 0, dy: 0},
          {dx: 1, dy: 0},
          {dx: -2, dy: 0},
          {dx: 1, dy: -2},
          {dx: -2, dy: 1},
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

  public rotate(matrix: Matrix, direction: RotationDirection): Matrix {
    if (direction === RotationDirection.LEFT)
      return this.rotateLeft(matrix);
    return this.rotateRight(matrix);
  }

}

export default new TileController();