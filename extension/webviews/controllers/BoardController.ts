import { klona } from "klona";
import { COLS, PLAYER_DOWN_RATE, PLAYER_SIDEWAYS_RATE, ROWS } from "../helpers/constants";
import { utils } from "../helpers/Utils";
import type { BoardStore } from "../stores/board";
import type { CurrentPieceStore } from "../stores/currentPiece";
import type { HoldPieceStore } from "../stores/holdPieceStore";
import type { Matrix } from "../types";
import type { IPieceInformation } from "./PieceController";

export type MovementCalculationTupleReturn = [boolean, boolean, boolean, number, boolean];
export type MovementCalculationTuple = [number, number, number, number];
type CalculateFn = (currentTime: number, time: MovementCalculationTuple) => MovementCalculationTupleReturn;
interface IBoardFalling {
  deltaTime: number; 
  timeSincePieceLastFell: number; 
  fallRate: number; 
  currentPiece: CurrentPieceStore;
}

export class BoardController {

  static createEmptyMatrix(cols: number, rows: number) {
    // create a single column
    const column = BoardController.createEmptyArray(rows);
    // callback function to create the row
    const createRow = utils.partial(BoardController.createEmptyArray, cols);
    // for each column create a row and return matrix
    //@ts-ignore
    return column.map(createRow);
  }

  /**
   * Creates an array with length "length" filled with "0"s
   *
   * @param {Number} length The length of the returned empty array
   */
  static createEmptyArray = (length: number) => utils.times(length, utils.constant(0));
  /**
 * Detects collision between a piece and board
 * by checking if the piece is within the bounds of the board
 *
 * @param {Object} piece The full piece object
 * @param {Array} board The board matrix
 * @returns {Boolean} True if there is a collision, false if not
 */
  public detectMatrixCollision( piece: IPieceInformation, board: Matrix, xOffset: number = 0, yOffset: number = 0): boolean {
    const tempPiece = klona(piece);
    tempPiece.x += xOffset;
    tempPiece.y += yOffset;
    if (this.inBounds(piece, board))
      return false;
    return true;
  }

  /**
   * Checks if a piece is within the bounds of the board
   *
   * @param {Object} piece The full piece object
   * @param {Array} board The board matrix
   * @returns {Boolean} True if the piece is within bounds of board, false if not
   */
  public inBounds(piece: IPieceInformation, board: Matrix): boolean {
    const { matrix } = piece;
    return matrix.every((row, dy) => {
      return row.every((value, dx) => {
        let x = piece.x + dx;
        let y = piece.y + dy;
        return value === 0 || (this.insideWalls(x) && this.aboveFloor(y) && this.notOccupied(x, y, board));
      });
    });
  }

  /**
   * Checks if a cell is located within the walls of the board
   *
   * @param {Number} x The location of the cell
   * @returns {Boolean} True if the cell is within the walls, false if not
   */
  public insideWalls(x: number): boolean {
    return x >= 0 && x < COLS;
  }

  /**
   * Checks if a cell is located above the floor of the board
   *
   * @param {Number} y The row location of the cell
   * @returns {Boolean} True if the cell is above the floor, false if not
   */
  public aboveFloor(y: number): boolean {
    return y <= ROWS;
  }

  /**
   * Checks if the space on the board is occupied by a piece represented by a non-zero number
   *
   * @param {Number} x The column location
   * @param {Number} y The row location
   * @param {Array} board The 2 dimensional board array
   * @returns {Boolean} True if there is nothing (0) in that spot, false if it is occupied
   */
  public notOccupied(x: number, y: number, board: Matrix): boolean {
    return y < 0 || (board[y] && board[y][x] === 0);
  }

  public calculateMovement: CalculateFn = (currentTime, [lastLeftMove, lastRightMove, lastDownMove, lastDropMove]) => {
    const playerSidewaysThreshold = Math.ceil(1000 / PLAYER_SIDEWAYS_RATE);
    const isLeftMovementAllowed =
      currentTime - lastLeftMove > playerSidewaysThreshold;
    const isRightMovementAllowed =
      currentTime - lastRightMove > playerSidewaysThreshold;
    const isDownMovementAllowed =
      currentTime - lastDownMove > Math.ceil(1000 / PLAYER_DOWN_RATE);
    const isDropMovementAllowed = currentTime > lastDropMove;
    return [
      isLeftMovementAllowed,
      isRightMovementAllowed,
      isDownMovementAllowed,
      playerSidewaysThreshold,
      isDropMovementAllowed
    ];
  }

  public mergeCurrentPieceIntoBoard(currentPiece: IPieceInformation, board: BoardStore, holdStore: HoldPieceStore) {
    // First moves the piece up one space.
    // This allows you to shift the piece around a bit and
    // only detects collisions at the end of the step
    // instead of at the beginning.
    const previousPositionPiece = klona(currentPiece); //{...$currentPiece};
    previousPositionPiece.y -= 1;
    board.mergePiecesIntoBoard(previousPositionPiece);
    holdStore?.makeSwappable();
  }

  public handleAutomatedFalling(fallingOptions: IBoardFalling) {
    let {timeSincePieceLastFell, fallRate, currentPiece, deltaTime} = fallingOptions;
    timeSincePieceLastFell += deltaTime;

    const shouldPieceFall = timeSincePieceLastFell > Math.ceil(1000 / fallRate);

    if (shouldPieceFall) {
      timeSincePieceLastFell = 0;
      currentPiece.movePieceDown();
    }
    return timeSincePieceLastFell;
  }

  public getFilledRows(matrix: Matrix) {
    return matrix.reduce((filledRows, row, rowIndex) => {
      // check that every element in the row is a filled block
      if (row.every(i =>  i > 0)) {
        filledRows.push(rowIndex);
      }
      return filledRows;
    }, []);
  }
  
  public removeRow(matrix: Matrix, rowIndex: number) {
    const klone = klona(matrix);
    klone.splice(rowIndex, 1);
    return klone;
  }
  
  public removeRowAndShiftDown(matrix: Matrix, rowIndex: number) {
    const w = utils.getMatrixWidth(matrix);
    const emptyRowMatrix = [BoardController.createEmptyArray(w)];
    const newBoard = emptyRowMatrix.concat(this.removeRow(matrix, rowIndex));
    return newBoard;
  }
  
}

const boardController = new BoardController();
export default boardController;
