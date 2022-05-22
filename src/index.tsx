import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import './index.css';
import Flex from './components/Flex/Flex';
import Grid from './components/Grid/Grid';
import SidebarLayout from './components/SidebarLayout/SidebarLayout';
import Game from './components/Game/Game';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <Flex></Flex> */}
    {/* <Grid></Grid> */}
    {/* <SidebarLayout></SidebarLayout> */}
    <Game></Game>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
