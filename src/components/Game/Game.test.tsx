import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Game from './Game';
import * as Settings from './gameSettings';

describe('<Game />', () => {
  test('it should mount', () => {
    render(
      <Game
        players={[Settings.Player1, Settings.Player2]}
        availColors={Settings.colors}
        isSinglePlayer={true}
      />
    );
  });
});
