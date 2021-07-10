import type { IPieceInformation } from "./PieceController";

export class BoardController {
  constructor(public tetriminos: IPieceInformation[]) { }

  static getEmptyBoard(rows: number, columns: number): number[][] {
    return Array.from(
      { length: rows }, () => Array(columns).fill(0)
    );
  }

}