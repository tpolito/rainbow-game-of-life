import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Number of Rows & Columns for the grid
const totalRows: number = 40;
const totalCols: number = 80;

// Function to create a new grid
const newBoardStatus = (cellStatus = () => (Math.random() < 0.3 ? 1 : 0)) => {
  const grid: any[][] = [];
  for (let r = 0; r < totalRows; r++) {
    grid[r] = [];
    for (let c = 0; c < totalCols; c++) {
      grid[r][c] = {
        status: cellStatus(),
        color: `coral`
      };
    }
  }
  return grid;
};

// Grid Component
interface BoardGridProps {
  boardStatus: any;
}

const BoardGrid: React.FC<BoardGridProps> = ({ boardStatus }) => {
  const tr = [];
  for (let r = 0; r < totalRows; r++) {
    const td = [];
    for (let c = 0; c < totalCols; c++) {
      td.push(
        <td
          key={`${r},${c}`}
          style={{
            backgroundColor: boardStatus[r][c].status
              ? boardStatus[r][c].color
              : 'white'
          }}
          data-cord={`${r},${c}`}
          // data-status={boardStatus[r][c].status ? 'alive' : 'dead'}
        />
      );
    }
    tr.push(<tr key={r}>{td}</tr>);
  }
  return (
    <table>
      <tbody>{tr}</tbody>
    </table>
  );
};

// App
const App: React.FC = () => {
  // App State
  const testStatus = [
    [
      { status: 0, color: 'coral' },
      { status: 1, color: 'coral' },
      { status: 0, color: 'coral' },
      { status: 0, color: 'coral' },
      { status: 0, color: 'coral' }
    ],
    [
      { status: 0, color: 'coral' },
      { status: 0, color: 'coral' },
      { status: 0, color: 'coral' },
      { status: 0, color: 'coral' },
      { status: 0, color: 'coral' }
    ],
    [
      { status: 0, color: 'coral' },
      { status: 0, color: 'coral' },
      { status: 0, color: 'coral' },
      { status: 0, color: 'coral' },
      { status: 0, color: 'coral' }
    ],
    [
      { status: 0, color: 'coral' },
      { status: 0, color: 'coral' },
      { status: 0, color: 'coral' },
      { status: 0, color: 'coral' },
      { status: 0, color: 'coral' }
    ],
    [
      { status: 0, color: 'coral' },
      { status: 1, color: 'coral' },
      { status: 0, color: 'coral' },
      { status: 0, color: 'coral' },
      { status: 0, color: 'coral' }
    ]
  ];

  const [gameStatus, setGameStatus] = useState({
    boardStatus: newBoardStatus(),
    gameRunning: false
  });

  // Stop Function
  const handleStop = () => {
    setGameStatus({ ...gameStatus, gameRunning: false });
  };
  // Start Function
  const handleStart = () => {
    setGameStatus({ ...gameStatus, gameRunning: true });
  };

  // Moves to next generation
  const handleGeneration = useCallback(() => {
    const nextStep = (prevBoard: any[][]) => {
      const boardStatus: any[][] = prevBoard;

      // const deepClone = (array: any) => {
      //   const clone = array.map((element: any) => {
      //     return Array.isArray(element) ? deepClone(element) : element;
      //   });

      //   return clone;
      // };

      const clonedBoardStatus = JSON.parse(JSON.stringify(boardStatus));
      // const clonedBoardStatus = boardStatus;

      // const findNeighbors = (r: number, c: number) => {
      //   const neighbors: number[][] = [
      //     [-1, -1],
      //     [-1, 0],
      //     [-1, 1],
      //     [0, 1],
      //     [1, 1],
      //     [1, 0],
      //     [1, -1],
      //     [0, -1]
      //   ];

      //   return neighbors.reduce((trueNeighbors: number, neighbor) => {
      //     const x = r + neighbor[0];
      //     const y = c + neighbor[1];

      //     const isNeighborOnBoard: boolean =
      //       x >= 0 && x < totalRows && y >= 0 && y < totalCols;

      //     if (
      //       trueNeighbors < 4 &&
      //       isNeighborOnBoard &&
      //       boardStatus[x][y].status
      //     ) {
      //       return trueNeighbors + 1;
      //     } else {
      //       return trueNeighbors;
      //     }
      //   }, 0);
      // };

      const findNeighbors = (r: number, c: number) => {
        let sum: number = 0;
        const numberOfRows = boardStatus.length;
        const numberOfCols = boardStatus[0].length;

        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            const row = (r + i + numberOfRows) % numberOfRows;
            const col = (c + j + numberOfCols) % numberOfCols;

            sum += boardStatus[row][col].status;
          }
        }

        sum -= boardStatus[r][c].status;

        // console.log(`Cell: (${r},${c}) has ${sum} neighbors`);
        return sum;
      };

      for (let r = 0; r < totalRows; r++) {
        for (let c = 0; c < totalCols; c++) {
          const totalNeighbors = findNeighbors(r, c);

          // console.log(`totalNighbors of ${r},${c} = ${totalNeighbors}`);

          if (!boardStatus[r][c].status) {
            if (totalNeighbors === 3) {
              clonedBoardStatus[r][c].status = 1;
            }
          } else {
            if (totalNeighbors < 2 || totalNeighbors > 3) {
              clonedBoardStatus[r][c].status = 0;
            }
          }

          // if (boardStatus[r][c].status === 0 && totalNeighbors === 3) {
          //   clonedBoardStatus[r][c].status = 1;
          // } else if (
          //   boardStatus[r][c].status === 1 &&
          //   (totalNeighbors < 2 || totalNeighbors > 3)
          // ) {
          //   clonedBoardStatus[r][c].status = 0;
          // } else {
          //   clonedBoardStatus[r][c].status = boardStatus[r][c].status;
          // }
        }
      }
      // console.log(clonedBoardStatus);
      // console.log(boardStatus);
      // console.log(prevBoard);
      return clonedBoardStatus;
    };

    let prevBoard: any[][] = gameStatus.boardStatus;

    setGameStatus({ ...gameStatus, boardStatus: nextStep(prevBoard) });
  }, [gameStatus]);

  // Counts Living Cells on the Board
  const countLiving = () => {
    let count = 0;

    for (let i = 0; i < totalRows; i++) {
      for (let j = 0; j < totalCols; j++) {
        if (gameStatus.boardStatus[i][j].status === 1) {
          count++;
        }
      }
    }

    console.log(count);
  };

  // Runs the animation
  // https://reacttraining.com/blog/useEffect-is-not-the-new-componentDidMount/
  useEffect(() => {
    let timer: any;

    if (!gameStatus.gameRunning) {
      clearInterval(timer);
    } else {
      timer = setInterval(() => {
        handleGeneration();
      }, 200);

      return () => clearInterval(timer);
    }
  }, [gameStatus.gameRunning, handleGeneration]);

  return (
    <div className='App'>
      <h1>
        <span aria-label='dna-strand' role='img'>
          🌈
        </span>
        Game of Life
        <span aria-label='dna-strand' role='img'>
          🧬
        </span>
      </h1>

      <BoardGrid boardStatus={gameStatus.boardStatus} />

      <button className='button' onClick={handleGeneration}>
        Test
      </button>

      <button className='button' onClick={countLiving}>
        Count Living
      </button>

      {gameStatus.gameRunning ? (
        <button className='button' onClick={handleStop}>
          Stop Game
        </button>
      ) : (
        <button className='button' onClick={handleStart}>
          Start Game
        </button>
      )}
    </div>
  );
};

export default App;
