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
        const {user = null } = this.props;

        return ( 
            <li onClick = { this.setActive } >
                <a href = "#" >
                    <div className = "profile-img">
                        <img src = "https://via.placeholder.com/500" alt = { `user-profile ${user.username}` }/>  
                    </div > 
                    <div className = "contact-info" >
                        <h3> { user.username } </h3> 
                        <p> </p> 
                    </div >
                </a> 
            </li >
        );
    }


}

export default observer(ActiveUser);