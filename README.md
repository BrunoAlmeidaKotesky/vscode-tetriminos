**New version 1.2.0 Available!**

## Features
Play a game similar to Tetris inside VSCode.

You can play a falling block game like, very similiar to TETRIS, with many of the same features from the official game.

### Most recent version: 1.2.1
*Please read the [changelog](https://github.com/BrunoAlmeidaKotesky/vscode-tetriminos/blob/main/extension/CHANGELOG.md) for the other versions.*

![Ghost Piece](https://i.imgur.com/2h6QkBs.png)

The focus of this release was on increasing the game difficulty, fixing bugs and *FINALLY* implementing a **ghost piece preview**.

- Fixed a bug that the fall rate of the game didn't changed when the game was restarted.
- Implemented the **ghost piece preview** of the blocks, showing where the piece will be placed.
- The fallrate of the pieces has been changed from `0.5` to `0.8` and the level of the game now changes every `5` cleared lines, instead of `10`. This Change was intented to make the game a little harder, maybe that could possible make the game a little frustrating at higher levels, but when the implementation of the `merge delay` comes, it will be much more confortable.

## Known Issues
* If the game restarts while hard dropping (only), depending on the piece, some fragments of the tiles is still on the board.
* Due to the lack of a delay from merging the pieces into the board, it feels harder to play.

## Roadmap:
The importance of the features is from the top to the bottom.
- Add a local ranking scoreboard of your top ten scores, it was supposed to be released on 1.2.0, but due to VSCode Extension limitations, localStorage was not a option.
- Add a merge/lock delay: When playing on higher levels, its difficulty to exactly control where the piece will fall, since it immediatly merges into the board, with a [lock delay](https://tetris.fandom.com/wiki/Lock_delay#:~:text=Lock%20delay%20refers%20to%20how,as%20low%20as%20fifteen%20frames.), it'll be avoided, since the pieces waits for a while before locking on the ground.
- *Maybe* more changes to the game difficulty.
- A different style for the game, therefore no longer using the same style provided by the Hero defaults.
- ~~Xbox One/Series X controller support~~ - Probably not, who knows.
- ~~1v1 Online matches using WebSockets.~~ I definitely can't do it now.


### Other informations:
* [Support the project!](https://github.com/BrunoAlmeidaKotesky/vscode-tetriminos) 😀
* The base of the project was built based on [Rene Dellefont
](https://github.com/babycourageous/) articles of "MAKING TETRIS WITH SVELTE", with my own implementation on Typescript and changes according to my preferences.
* As for the game stlye, the background pattern and pieces was supplied by [Hero Patterns](https://heropatterns.com/) by Steve Schoger.