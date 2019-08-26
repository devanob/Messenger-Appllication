import React, {Component} from "react";
import { observer} from "mobx-react"

//Provides A List Of Pending Users
class PendingUser extends Component{
  constructor(props){
    super(props)
    
  }   
  setActive= ()=>{
    //console.log("componet");
    //console.log(this.props.user);
    //this.props.user.setUserActive();
  }
  render() {
    const {user=null} = this.props;
    
    return (
      <li onClick={this.setActive} >
      <a href="#" >
        <div className="profile-img">
          <img src="https://via.placeholder.com/500" alt={`user-profile ${user.username}`} /> 
        </div>
        <div className="contact-info">
          <h3>{user.username}</h3>
          <p></p>
        </div>
        
      </a>
    </li>
    );
  }
  
  
}
export default observer(PendingUser) ;
