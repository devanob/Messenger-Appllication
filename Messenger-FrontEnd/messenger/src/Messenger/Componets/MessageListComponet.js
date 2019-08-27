import React, {Component} from "react";
import { inject } from 'mobx-react';
import { observer } from 'mobx-react';
import MessageInstanceComponet from "./MessageInstanceComponet";

//Handles MessageInstance For Each User-ie Provides A List Of Message Depending On The Active User
class MessageListComponet extends Component{
  constructor(props){
    super(props)
    this.ulRef = React.createRef();
  }   
  componentDidUpdate(){
    this.ulRef.current.scrollTop =  this.ulRef.current.scrollHeight;
    console.log( this.ulRef.current.scrollHeight);
    
    
  }
  componentDidMount(){
    this.ulRef.current.scrollTop =  this.ulRef.current.scrollHeight;
    console.log( this.ulRef.current.scrollHeight);
  }
  render() {
    const {messages = null, activeUser = null} = this.props;   
    return (
        <ul ref={this.ulRef } className="message-list-area">
             {messages.map(mssg=>{
                    return (
                        <MessageInstanceComponet
                            key = {mssg.id}
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

export default  inject("rootStore")(observer(MessageListComponet))
 