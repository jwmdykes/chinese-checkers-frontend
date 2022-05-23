import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Board from './Board';
import { fillBoard0s } from '../gameLogic';

const rowLengths = [1, 2, 3, 4, 13, 12, 11, 10, 9, 10, 11, 12, 13, 4, 3, 2, 1];
const colors = [
  { type: 'hsl', hue: 240, saturation: 72, brightness: 67 },
  { type: 'hsl', hue: 240, saturation: 80, brightness: 40 },
];
let rows: Array<Array<Number>> = Array<Array<Number>>(17);
let selected: Array<Array<boolean>> = Array<Array<boolean>>(17);
for (let i = 0; i < 17; i++) {
  rows[i] = Array(rowLengths[i]).fill(0);
  selected[i] = Array(rowLengths[i]).fill(0);
}

describe('<Board />', () => {
  test('it should mount', () => {
    render(
      <Board
        rows={rows}
        selected={selected}
        colors={colors}
        pieceOnClick={(e) => {}}
        turn={1}
      />
    );
  });
});
