import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import './index.css';
import Game from './components/Game/Game';
import * as Settings from './components/Game/gameSettings';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <Flex></Flex> */}
    {/* <Grid></Grid> */}
    {/* <SidebarLayout></SidebarLayout> */}
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
