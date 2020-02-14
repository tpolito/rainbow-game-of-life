import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Number of Rows & Columns for the grid
const totalRows: number = 40;
const totalCols: number = 80;

// Generate a random number from a min to max
const randomNum = (min: number, max: number) => {
  return min + Math.random() * (max - min);
};

// Function to create a new grid
const newBoardStatus = (cellStatus = () => (Math.random() < 0.3 ? 1 : 0)) => {
  const grid: any[][] = [];
  for (let r = 0; r < totalRows; r++) {
    grid[r] = [];
    for (let c = 0; c < totalCols; c++) {
      grid[r][c] = {
        status: cellStatus(),
        h: randomNum(1, 360),
        s: randomNum(0, 100),
        l: randomNum(0, 100)
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
            backgroundColor:
              boardStatus[r][c].status === 1
                ? `hsl(${boardStatus[r][c].h}, ${boardStatus[r][c].s}%, ${boardStatus[r][c].l}%`
                : 'white'
          }}
          data-cord={`${r},${c}`}
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

      const clonedBoardStatus = JSON.parse(JSON.stringify(boardStatus));

      const findNeighbors = (r: number, c: number) => {
        let sum: number = 0;
        // Color is equal to the color value of the cell
        let color: number = boardStatus[r][c].h;

        const numberOfRows = boardStatus.length;
        const numberOfCols = boardStatus[0].length;

        // Check each neighboring cells status
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            const row = (r + i + numberOfRows) % numberOfRows;
            const col = (c + j + numberOfCols) % numberOfCols;

            color += boardStatus[row][col].h;

            sum += boardStatus[row][col].status;
          }
        }

        // -= to remove the value of the cell being checked from the equation
        sum -= boardStatus[r][c].status;

        color = color / sum;

        return { sum: sum, color: color };
      };

      for (let r = 0; r < totalRows; r++) {
        for (let c = 0; c < totalCols; c++) {
          // Find Neighbors returns a sum of total living neighbors and a color value
          const sumAndColor = findNeighbors(r, c);

          const { sum, color } = sumAndColor;

          clonedBoardStatus[r][c].h = color;
          if (!boardStatus[r][c].status) {
            if (sum === 3) {
              clonedBoardStatus[r][c].status = 1;
            }
          } else {
            if (sum < 2 || sum > 3) {
              clonedBoardStatus[r][c].status = 0;
            }
          }
        }
      }

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

      {gameStatus.gameRunning ? (
        <button className='button' disabled onClick={handleGeneration}>
          Test
        </button>
      ) : (
        <button className='button' onClick={handleGeneration}>
          Test
        </button>
      )}

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
