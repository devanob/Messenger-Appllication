import React from 'react';
import './App.css';
import SideBar from "./Messenger/Componets/SideBar"
import MainContent from "./Messenger/Componets/MainContent"
function App() {
  return (
    <div className="container">
      <SideBar/>
      <MainContent />
    </div>
  );
}

export default App;
