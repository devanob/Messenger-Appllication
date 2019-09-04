import React, {Component} from "react";
import "../css/Content.css"
import NavComponet from "./NavComponet/NavComponet";
import MessageComponet from "./Messages/MessageComponet";
import TextBoxMessageComponet from "./textBoxMessageComponet";
import { inject, observer } from 'mobx-react';

//Handles The Main Content 
class MainContent extends Component{
  constructor(props){
    //Set internel state for any text chage by the user 
    super(props);
    this.state = {
        searchText: ""
    };
    
  }
  //Toggle The SideBar in the store
  toggleActiveSideBar =()=>{
    this.props.rootStore.uiUserStore.toggleSideBarActive();
  }
  //Handles Text Chnage Events
  setMessageToSend= (event)=>{
    
    let messageText = event.target.value;
    const {rootStore} = this.props;
    if (messageText.trim().length > 0 ){
      rootStore.userMessageStore.setMessageText(messageText);
    }
    else {
      rootStore.userMessageStore.setMessageText("");
    }
    
      
  }
  sendMessageHandlier =()=>{
    const {rootStore} = this.props;
    const userMessageStore = rootStore.userMessageStore;
    userMessageStore.sendMessage();
  }
  render() {
    const {rootStore} = this.props;
    const messgObject = rootStore.userMessageStore;
    //For Text Input 
    //const messageStore = rootStore.
    //console.log(rootStore.userStore.activeContacts.length);
    return (
        <div className="MainContent"> 
          <NavComponet></NavComponet>
          <MessageComponet></MessageComponet>
          <TextBoxMessageComponet
              messgObject = {messgObject}
              onTextChange={this.setMessageToSend}
              sendMessageHandlier = {this.sendMessageHandlier}
          ></TextBoxMessageComponet>
        </div>

    );
  }
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.log(error);
    console.log(errorInfo);
  }
  
}

export default inject("rootStore")(MainContent);
