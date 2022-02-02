## Features
Play a game similar to Tetris inside VSCode.
~~The current version is a Alpha version~~, Now with the first official release!

You can play a falling block game like, very similiar to TETRIS, with many of the same features from the official game.

## Known Issues
* If the game restarts while hard dropping (only), depending on the piece, some fragments of the tiles is still on the board.
* Sometimes when you get a game over, the pieces might merge.
* The current rotationa algorithm does implement [SRS](https://tetris.wiki/Super_Rotation_System), but the offset tests for the **I** pieces are not 100% accurate.

**The official release is available!**
### 1.1.0
- Fixed SRS algorithm and sidewalls pieces rotations.
- Fixed a bug that, when swapping pieces, the pieces was not being centered correctly.
### 1.0.1
- Added the feature to hold the pieces by pressing the **C** key on the keyboard.
- The mechanics to restart the game has been changed. Now it's possible to restart the game pressing the **R** key, and now when you get a game over, the game will restart automatically.
- Added the feature to "Hard drop' the pieces, you can hard drop by pressing the **Space Bar** key on the keyboard. 
**(Hard Drop menas that the piece will drop instantly)**
- Added an information board listing the controllers.


### For more information
* [Support the project!](https://github.com/BrunoAlmeidaKotesky/vscode-tetriminos)