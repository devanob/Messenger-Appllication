import React, {Component} from "react";
import { observer } from 'mobx-react';


//Handles One UI Message Instance ie. MessageBox 
class MessageInstanceComponet extends Component{
  constructor(props){
    super(props)
  }   

  render() {
    const {message = null, activeUser = null} = this.props;
    let orientationString = null
    if (message.from_User === activeUser){
        orientationString = "left";
    }
    else {
        orientationString = "right";
    }
    let fullClassOrientation = `message ${orientationString}`;
    return (
        <li key={message.id} className={fullClassOrientation}>
            <div className = "message-box" >
                {message.message}
            </div>
        </li>
           
    )
  }
  
  
}

export default  observer(MessageInstanceComponet);
 