import React from 'react';
import logo from './logo.svg';
import './App.css';
import SideBar from "./Messenger/Componets/SideBar"
function App() {
  return (
    <div className="container">
      <SideBar>-Side-Bar-</SideBar>
      <div class="content"> 
        Content
      </div>
    </div>
  );
}

export default App;
