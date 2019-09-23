import React, {Component} from "react";
import { observer,inject } from "mobx-react"
import ActiveUser from "./ActiveUser"
import Spinner from 'react-bootstrap/Spinner';
import SpinnerComponet from "../LoadingSpinner/SpinnerComponet"
import RootStore from '../../Stores/rootStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown} from '@fortawesome/free-solid-svg-icons'

//Manages UI Active Users Displayed To The User
class ActiveUsers extends Component{
  constructor(props){
    super(props)
  }   
  loadNextUserSet=()=>{
    let activeUserStore= this.props.rootStore.getStore("activeUsersStore");
    activeUserStore.loadNextUserSet();
  }
  render() {
    const {rootStore,searchText} = this.props;
    const activeUsers = rootStore.userStore.listActiveContacts;
    const messageModel= rootStore.userMessageStore;
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

                    <ActiveUser messageModel={messageModel} key={user.uuid} user={user}></ActiveUser>
                   
                  );
              })}
              <li className="loadContact" onClick={this.loadNextUserSet}>
                <div className="loading-contacts-container">
                  <div className="load-more-contacts" >
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                </div>
              </li>
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
