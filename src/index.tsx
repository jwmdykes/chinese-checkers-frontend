import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import Game from './components/Game/Game';
import * as Settings from './components/Game/gameSettings';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Game
      players={[
        Settings.Player1,
        Settings.Player2,
        // Settings.Player3,
        // Settings.Player4,
        // Settings.Player5,
        // Settings.Player6,
      ]}
      availColors={Settings.colors}
      isSinglePlayer={true}
    ></Game>
  </React.StrictMode>
);
