export interface Player {
  id: number;
  color: string;
}

export interface Square {
  color: number;
  selected: boolean;
}

export type ColorMap = { [key: string]: string };

export const fillBoard0s = (
  rows: Array<Array<Number>>,
  rowLengths: Array<Number>
): void => {
  for (let i = 0; i < 17; i++) {
    rows[i] = Array(rowLengths[i]).fill(0);
  }
};

export const rowLengths = [
  1, 2, 3, 4, 13, 12, 11, 10, 9, 10, 11, 12, 13, 4, 3, 2, 1,
];

export const changeTurn = (players: Player[], turn: number): number => {
  const newTurn = turn >= players!.at(-1)!.id ? 1 : turn + 1;
  return newTurn;
};
