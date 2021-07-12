import * as pressed from 'pressed';
import {get} from 'svelte/store';
import currentPiece from '../stores/currentPiece';
import board from '../stores/board';
import boardController from './BoardController';
import { pieceController } from './PieceController';
import { klona } from 'klona';

enum KeyBoardController {
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right',
    UP = 'up',
    ENTER = 'enter',
    HOLD = 'c'
}
const PLAYER_SIDEWAYS_RATE = 6;
const PLAYER_DOWN_RATE = 20;
type MovementCalculationTuple = [boolean, boolean, boolean];

export default class InputController {
    public animationID: number|null = null;
    private lastLeftMove: number = 0;
    private lastRightMove: number = 0;
    private lastDownMove: number = 0;
    private timeSincePieceLastFell: number = 0;

    private calculateMovement(currentTime: number): MovementCalculationTuple {
        const playerSidewaysThreshold = Math.ceil(1000 / PLAYER_SIDEWAYS_RATE);
        const isLeftMovementAllowed = currentTime - this.lastLeftMove > playerSidewaysThreshold;
        const isRightMovementAllowed = currentTime - this.lastRightMove > playerSidewaysThreshold;
        const isDownMovementAllowed = currentTime - this.lastDownMove > Math.ceil(1000 / PLAYER_DOWN_RATE);
        return [isLeftMovementAllowed, isRightMovementAllowed, isDownMovementAllowed];
    }
    
    private handlePlayerMovement(currentTime: number) {
        const [isLeftMovementAllowed, isRightMovementAllowed, isDownMovementAllowed]  = this.calculateMovement(currentTime);
        const $boardValue = get(board);
        if (pressed.some(KeyBoardController.DOWN)) {
          if (isDownMovementAllowed) {
            this.lastDownMove = currentTime;
            this.timeSincePieceLastFell = 0;
            
            currentPiece.movePieceDown($boardValue);
            return;
          }
          this.lastDownMove = 0;
        }
        if (pressed.some(KeyBoardController.LEFT)) {
          if(isLeftMovementAllowed) {
            this.lastLeftMove = currentTime;
            currentPiece?.movePieceLeft($boardValue);
            return;
          }
          this.lastLeftMove = 0;
        }
      
        if (pressed.some(KeyBoardController.RIGHT)) {
          if(isRightMovementAllowed) {
            this.lastRightMove = currentTime;
            currentPiece.movePieceRight($boardValue);
            return;
          }
          this.lastRightMove = 0;
        }
    }

    private mergeCurrentPieceIntoBoard() {
      // First moves the piece up one space.
      // This allows you to shift the piece around a bit and
      // only detects collisions at the end of the step
      // instead of at the beginning.
      const $currentPiece = get(currentPiece);
      const previousPositionPiece = klona($currentPiece);//{...$currentPiece};
      previousPositionPiece.y -= 1;
      board.mergePiecesIntoBoard(previousPositionPiece);
  }

    public animate = (currentTime: number) => {
      const $currentPieceValue = get(currentPiece);
      const $boardValue = get(board);
      this.handlePlayerMovement(currentTime);
      if (boardController.detectMatrixCollision($currentPieceValue, $boardValue)) {
        this.mergeCurrentPieceIntoBoard();
        const randomPiece = pieceController.getRandomPiece();
        console.log(randomPiece);
        currentPiece.setCurrentPiece(randomPiece);
        
        // If there is still a collision right after a new piece is spawned, the game ends.
        if(boardController.detectMatrixCollision($currentPieceValue, $boardValue))
          return;
      }
        this.animationID = requestAnimationFrame((time) => this.animate(time));
    };
    
    

    public init() {
        pressed.start(document);
        currentPiece.setCurrentPiece(pieceController.getRandomPiece());
        this.animationID = requestAnimationFrame((t) => this.animate(t));
    }
}
