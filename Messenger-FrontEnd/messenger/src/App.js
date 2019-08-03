import React from 'react';
import './App.css';
import SideBar from "./Messenger/Componets/SideBar"
function App() {
  return (
    <div className="container">
      <SideBar>-Side-Bar-</SideBar>
      <div className="content"> 
        Content
      </div>
    </div>
  );
}

export default App;
