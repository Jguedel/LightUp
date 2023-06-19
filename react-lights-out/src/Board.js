import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 1 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    // TODO: create array-of-arrays of true/false values
    for (let index = 0; index < nrows; index++) {
      initialBoard.push([...Array(ncols)]);
      for (let z = 0; z < initialBoard[index].length; z++) {
        let radNum = Math.floor(Math.random() * 10) + 1;
        if (chanceLightStartsOn >= radNum) {
          initialBoard[index][z] = true;
        } else {
          initialBoard[index][z] = false;
        }
      }
    }
    return initialBoard;
  }

  function hasWon() {
    let won = true;
    board.forEach((row) => {
      row.forEach((col) => {
        if (col == false) {
          won = false;
        }
      });
    });
    return won;
  }
  function restart() {
    setBoard(createBoard());
  }

  function flipCellsAround(cord) {
    setBoard((oldBoard) => {
      const [y, x] = cord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          //change square clicked
          boardCopy[y][x] = !boardCopy[y][x];
          //change square up if exist
          if (typeof boardCopy[y - 1] != "undefined") {
            boardCopy[y - 1][x] = !boardCopy[y - 1][x];
          }
          //change square down if exist
          if (typeof boardCopy[y + 1] != "undefined") {
            boardCopy[y + 1][x] = !boardCopy[y + 1][x];
          }
          //change square right if exist
          if (typeof boardCopy[y][x + 1] != "undefined") {
            boardCopy[y][x + 1] = !boardCopy[y][x + 1];
          }
          //change square left if exist
          if (typeof boardCopy[y][x - 1] != "undefined") {
            boardCopy[y][x - 1] = !boardCopy[y][x - 1];
          }
          return boardCopy;
        }
      };

      // TODO: Make a (deep) copy of the oldBoard and flip cells
      let newBoard = oldBoard.map((row) => [...row]);
      newBoard = flipCell(y, x, newBoard);

      // TODO: return the copy
      return newBoard;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  const winner = () => {
    if (hasWon() === true) {
      return (
        <div className="winScreen">
          <h1>You Win</h1>
          <button onClick={restart}>restart</button>
        </div>
      );
    } else {
      return (
        <table className="Board">
          <tbody>{tblBoard}</tbody>
        </table>
      );
    }
  };
  // TODO

  // make table board
  let tblBoard = [];
  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      let cord = `${y}-${x}`;
      row.push(
        <Cell
          key={cord}
          isLit={board[y][x]}
          flipCellsAroundMe={(e) => flipCellsAround(cord)}
        />
      );
    }
    tblBoard.push(<tr key={y}>{row}</tr>);
  }
  return winner();
}

export default Board;
