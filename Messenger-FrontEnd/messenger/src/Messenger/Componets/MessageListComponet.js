import React, {Component} from "react";
import { observable, computed, action, decorate, configure,} from "mobx";
import { inject } from 'mobx-react';
import { observer } from 'mobx-react';
import MessageInstanceComponet from "./MessageInstanceComponet";

@inject("rootStore")
@observer
export default  class MessageListComponet extends Component{
  constructor(props){
    super(props)
  }   

  render() {
    const {messages = null, activeUser = null} = this.props;
    console.log("SEMI-Colons");
    console.log(messages);
    console.log(activeUser);    
    return (
        <ul className="message-list-area">
             {messages.map(mssg=>{
                    return (
                        <MessageInstanceComponet 
                            message={mssg}
                            activeUser = {activeUser}
                        >

                        </MessageInstanceComponet>
                        )
            })}
        </ul>
    )
  }
  
  
}


 