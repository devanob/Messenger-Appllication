import React, {Component} from "react";
import MessengerTextArea from "./MessengerTextArea";
import { inject, observer } from 'mobx-react';
//TextBox Section This Is Where User Input And Sending Messages Will Be Handle On The Ui/Client Side
class TextBoxMessageComponet extends Component{
  constructor(props){
    super(props)
  }   
  
  render() {
    const {onTextChange=null, messgObject=null} = this.props;
    const text =  messgObject.contructedMessageInternelMessage;
    return (
      <div className = "text-box-message-componet">
        <MessengerTextArea  
              text = {text}
              onTextChange={onTextChange}></MessengerTextArea>
      </div>
    )
  }
  
  
}

export default observer(TextBoxMessageComponet)




