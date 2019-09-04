import React, {Component} from "react";
import { observer,inject } from "mobx-react"
import ActiveUser from "./ActiveUser"
import Spinner from 'react-bootstrap/Spinner';
import SpinnerComponet from "../LoadingSpinner/SpinnerComponet"

//Manages UI Active Users Displayed To The User
class ActiveUsers extends Component{
  constructor(props){
    super(props)
  }   

  render() {
    const {rootStore,searchText} = this.props;
    let activeUsers = rootStore.userStore.listActiveContacts;
    let loading = rootStore.userStore.getIsLoadingActive;
    if (!loading){
      //f not active user 
      if (!activeUsers){
        return (
          <div className="activeUsers">
              YOu Have No Contacts..Try Adding Some In The Search User Menu
          </div>
         );
      } 
      return (
      <div className="activeUsers">
          
          <ul className="users">
              
              {activeUsers.filter((item=>{
                return item.username.toLowerCase().includes(searchText.toLowerCase());
              })).map(user=>{
                
                  return (
                    
                    // {/* <Spinner animation="border" role="status">
                    //   <span className="sr-only">Loading...</span>
                    // </Spinner>
                    // </> */}

                    <ActiveUser  key={user.uuid} user={user}></ActiveUser>
                   
                  );
              })}
          </ul>
      </div>
      );
    }
    else {
      return (
        <SpinnerComponet></SpinnerComponet>
      );
    }
  }
  
  
}

export default inject("rootStore")(observer(ActiveUsers));
