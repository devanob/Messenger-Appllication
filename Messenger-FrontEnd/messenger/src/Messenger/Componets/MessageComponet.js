import React, {Component} from "react";
import { inject } from 'mobx-react';
import { observer } from 'mobx-react';
import MessageListComponet from "./MessageListComponet";
//Manages The Ui Componet 
class MessageComponet extends Component{
  constructor(props){
    super(props)
  }   

  render() {
    const { rootStore} = this.props;
    let activeUser = rootStore.userStore.currentActiveUser;
    let messages = rootStore.userMessageStore.getMessages
    let  objectToRender = null;
    if (activeUser == null ){
        objectToRender = <div>No Active User Click On One</div>
    }
    else {
        let uuidUser = activeUser.uuid;
        let userModelMessages = messages[uuidUser];
        if (userModelMessages === null){
            objectToRender = <div> Still Loading MEssages </div>
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

 