# Notes

## Scratchpad

- ~~So right now `prevBoard`, `boardStatus`, and `clonedBoardStatus` are all the same at the end of `nextStep()`~~
  - ~~This means that either my `deepClone()` function isn't working or I'm not editing the status of the board properly.~~

## Deep Cloning

- Deep cloning information [found here](https://dev.to/samanthaming/how-to-deep-clone-an-array-in-javascript-3cig)
  - This is for the problem of the `clonedBoardStatus` we need when we handle the the cloing in the `handleGeneration()`
  - [Useful Link](http://jsben.ch/q2ez1)
  - `const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);`
  - Needed to add `.status` to `clonedBoardStatus[r][c]`
  - `const clonedBoardStatus = JSON.parse(JSON.stringify(boardStatus));`

## Game of Life Rules

- Any live cell with _fewer than two_ live neighbors dies
- Any live cell with _two or three_ live neighbors lives
- Any live cell with _more than three_ live neighbors dies
- Any dead cell with _exactly three live_ neighbors becomes a live cell

## Bugs
