import React, {Component} from "react";
import { observable, computed, action, decorate, configure,} from "mobx";
import { inject } from 'mobx-react';
import { observer } from 'mobx-react';
import MessageListComponet from "./MessageListComponet";

@inject("rootStore")
@observer
export default  class MessageComponet extends Component{
  constructor(props){
    super(props)
    console.log(props);
  }   

  render() {
    const { rootStore} = this.props;
    let activeUser = rootStore.userStore.currentActiveUser;
    let messages = rootStore.userMessageStore.getMessages
    console.log(messages);
    let  objectToRender = null;
    console.log(activeUser);
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


 