import { COLS, ROWS } from "../helpers/constants";
import { Utils } from "../helpers/Utils";
import type { IPieceInformation } from "./PieceController";

export class BoardController {

  static createEmptyMatrix(cols: number, rows: number) {
    // create a single column
    const column = BoardController.createEmptyArray(rows);
    // callback function to create the row
    const createRow = Utils.partial(BoardController.createEmptyArray, cols);
    // for each column create a row and return matrix
    //@ts-ignore
    return column.map(createRow);
  }
  
  /**
   * Creates an array with length "length" filled with "0"s
   *
   * @param {Number} length The length of the returned empty array
   */
  static createEmptyArray = (length: number) => Utils.times(length, ()=>0);
  /**
 * Detects collision between a piece and board
 * by checking if the piece is within the bounds of the board
 *
 * @param {Object} piece The full piece object
 * @param {Array} board The board matrix
 * @returns {Boolean} True if there is a collision, false if not
 */
  public detectMatrixCollision(piece: IPieceInformation, board: number[][]): boolean {
    if(this.inBounds(piece, board))
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
  public inBounds(piece: IPieceInformation, board: number[][]): boolean {
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
  public notOccupied(x: number, y: number, board: number[][]): boolean {
    return board[y] && board[y][x] === 0;
  }
}

const boardController = new BoardController();
export default boardController;
