import {
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { Board, Symbol, Row } from "./entities";

@ValidatorConstraint()
export class IsBoard implements ValidatorConstraintInterface {
  validate(board: Board) {
    const symbols = ["x", "o", null];
    return (
      board.length === 5 &&
      board.every(
        row => row.length === 5 && row.every(symbol => symbols.includes(symbol))
      )
    );
  }
}

export const isValidTransition = (
  playerSymbol: Symbol,
  from: Board,
  to: Board
) => {
  const changes = from
    .map((row, rowIndex) =>
      row.map((symbol, columnIndex) => ({
        from: symbol,
        to: to[rowIndex][columnIndex]
      }))
    )
    .reduce((a, b) => a.concat(b))
    .filter(change => change.from !== change.to);

  return (
    changes.length === 1 &&
    changes[0].to === playerSymbol &&
    changes[0].from === null
  );
};

export const calculateWinner = (
  clickedCell,
  winningCells,
  playerSymbol
): Symbol | null => {
  if (
    clickedCell[0] === winningCells[0][0] &&
    clickedCell[1] === winningCells[0][1]
  )
    return playerSymbol;
  if (
    clickedCell[0] === winningCells[1][0] &&
    clickedCell[1] === winningCells[1][1]
  )
    return playerSymbol;
  return null;
};

// export const calculateWinner = (board: Board): Symbol | null =>
//   board
//     .concat(
//       // vertical winner
//       [0, 1, 2].map(n => board.map(row => row[n])) as Row[]
//     )
//     .concat(
//       [
//         // diagonal winner ltr
//         [0, 1, 2].map(n => board[n][n]),
//         // diagonal winner rtl
//         [0, 1, 2].map(n => board[2-n][n])
//       ] as Row[]
//     )
//     .filter(row => row[0] && row.every(symbol => symbol === row[0]))
//     .map(row => row[0])[0] || null

export const finished = (board: Board): boolean =>
  board.reduce((a, b) => a.concat(b) as Row).every(symbol => symbol !== null);
