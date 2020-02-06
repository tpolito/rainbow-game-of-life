import React, { useState, useEffect } from 'react';
import './App.css';

// Number of Rows & Columns for the grid
const totalRows: number = 40;
const totalCols: number = 60;

// Function to create a new grid
const newBoardStatus = (cellStatus = () => Math.random() < 0.3) => {
  const grid: boolean[][] = [];
  for (let r = 0; r < totalRows; r++) {
    grid[r] = [];
    for (let c = 0; c < totalCols; c++) {
      grid[r][c] = cellStatus();
    }
  }
  return grid;
};

// Grid Component
interface BoardGridProps {
  boardStatus: any;
  // onToggleCellStatus: (r: number, c: number) => void;
}

const BoardGrid: React.FC<BoardGridProps> = ({ boardStatus }) => {
  // const handleClick = (r: number, c: number) => onToggleCellStatus(r, c);

  const tr = [];
  for (let r = 0; r < totalRows; r++) {
    const td = [];
    for (let c = 0; c < totalCols; c++) {
      td.push(
        <td
          key={`${r},${c}`}
          className={boardStatus[r][c] ? 'alive' : 'dead'}
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
  const [boardStatus, setBoardStatus] = useState(newBoardStatus());

  const handleGeneration = () => {
    const nextStep = (prevBoard: boolean[][]) => {
      const boardStatus: boolean[][] = prevBoard;
      const clonedBoardStatus = JSON.parse(JSON.stringify(boardStatus));

      const findNeighbors = (r: number, c: number) => {
        const neighbors: number[][] = [
          [-1, 1],
          [-1, 0],
          [-1, -1],
          [0, 1],
          [1, 1],
          [1, 0],
          [1, -1],
          [0, -1]
        ];

        return neighbors.reduce((trueNeighbors: number, neighbor) => {
          const x = r + neighbor[0];
          const y = c + neighbor[1];

          const isNeighborOnBoard: boolean =
            x >= 0 && x < totalRows && y >= 0 && y < totalCols;

          if (trueNeighbors < 4 && isNeighborOnBoard && boardStatus[x][y]) {
            return trueNeighbors + 1;
          } else {
            return trueNeighbors;
          }
        }, 0);
      };

      for (let r = 0; r < totalRows; r++) {
        for (let c = 0; c < totalCols; c++) {
          const totalTrueNeighbors = findNeighbors(r, c);

          if (!boardStatus[r][c]) {
            if (totalTrueNeighbors === 3) {
              clonedBoardStatus[r][c] = true;
            }
          } else {
            if (totalTrueNeighbors < 2 || totalTrueNeighbors > 3) {
              clonedBoardStatus[r][c] = false;
            }
          }
        }
      }

      return clonedBoardStatus;
    };
    let prevBoard: boolean[][] = boardStatus;

    setBoardStatus(nextStep(prevBoard));
  };

  return (
    <div className='App'>
      <h1>
        <span aria-label='dna-strand' role='img'>
          🧬
        </span>
        Game of Life
        <span aria-label='dna-strand' role='img'>
          🧬
        </span>
      </h1>
      <BoardGrid boardStatus={boardStatus} />
      <button onClick={handleGeneration}>Test</button>
    </div>
  );
};

export default App;
