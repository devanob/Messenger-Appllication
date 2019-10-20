import React, {Component} from "react";
import { inject } from 'mobx-react';
import { observer } from 'mobx-react';
import MessageListComponet from "./MessageListComponet";
import InfoComponet from '../InfoComponet/InfoComponet';
//Manages The Ui Componet 
class MessageComponet extends Component{
  constructor(props){
    super(props)
  }   

  render() {
    const { rootStore} = this.props;
    let activeUser = rootStore.userStore.getContactUser;
    let messages = rootStore.userMessageStore.getMessagesActiveUser
    let  objectToRender = null;
    if (activeUser == null ){
        objectToRender = <InfoComponet className="no-active-user">No Active User</InfoComponet>
    }
    else {
        let uuidUser = activeUser.uuid;
        let userModelMessages = messages;
        if (userModelMessages === null){
            objectToRender = <InfoComponet className="no-active-user">Loading Messages</InfoComponet>
        }
        else {
            objectToRender = <MessageListComponet 
                    messages={userModelMessages.messages}
                    activeUser = {uuidUser}
                ></MessageListComponet>
            }
        


    }
    
    return (
        <div className = "message-componet">
            {objectToRender}
        </div>
    )
  }
  
  
}

export default  inject("rootStore")(observer(MessageComponet));

 