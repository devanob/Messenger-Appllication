import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MessengerService from "./Messenger/Sevices/MessengerService"
import UserModel from "./Messenger/Models/UserModel"
import  UserStore from "./Messenger/Stores/UsersStore"


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});












