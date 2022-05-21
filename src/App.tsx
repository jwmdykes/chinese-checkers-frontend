import React from 'react';
import './App.css';
import Flex from './components/Flex/Flex';
import Grid from './components/Grid/Grid';
import SidebarLayout from './components/SidebarLayout/SidebarLayout';
import Game from './components/Game/Game';

function App() {
  return (
    <div className='App'>
      {/* <Flex></Flex> */}
      {/* <Grid></Grid> */}
      {/* <SidebarLayout></SidebarLayout> */}
      <Game></Game>
    </div>
  );
}

export default App;
