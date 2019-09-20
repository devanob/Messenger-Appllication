import React, { Component } from "react";
import { observer} from "mobx-react"

//Active User Componet Keep. UI Componet For User Instance 
class ActiveUser extends Component {
    constructor(props) {
        super(props)

    }
    //Set the active user by calling internel method belong to the user model
    setActive = () => {
        this.props.user.setUserActive();
    }
   
    render() {
        const {user = null, messageModel=null } = this.props;
        let message = "";
        if (messageModel != null){
            message=messageModel.getMessageModel(user.uuid).getLastMessage.message;
            if (message != null){
                message=message;
            }
        }

        return ( 
            <li onClick = { this.setActive } >
                <a href = "#" >
                    <div className = "profile-img">
                        <img src = "https://via.placeholder.com/500" alt = { `user-profile ${user.username}` }/>  
                    </div > 
                    <div className = "contact-info" >
                        <div className="name"> { user.username } </div> 
                        <div className="online-status"><div className="indicator"> </div></div> 
                        <div className="last-message">
                            <div className="inner-last-message">{message}</div>
                        </div>
                    </div >
                   
                </a> 
            </li >
        );
    }


}

export default observer(ActiveUser);