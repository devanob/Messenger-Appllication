import React, {Component} from "react";
import { observable, computed, action, decorate, configure,} from "mobx";
import { inject } from 'mobx-react';
import { observer } from 'mobx-react';

@observer
export default  class MessageInstanceComponet extends Component{
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


 