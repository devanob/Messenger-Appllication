import React, {Component} from "react";
import { observer} from "mobx-react"

//Provides A List Of Pending Users
class PendingUser extends Component{
  constructor(props){
    super(props)
    
  }   
  acceptRequest= (user)=>{
    user.acceptRequest();
  }
  denyRequest= (user)=>{
    user.rejectRequest();
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
          <div>{user.username}</div>
         
        </div>
        <div className="pending-user-control">
          <div className="add-contact">
            <button onClick= {()=>{
                this.acceptRequest(user);
            }}>Add</button>
          </div>
          <div className="reject-contact">
            <button onClick= {()=>{
                this.denyRequest(user);
            }}>Reject</button>
          </div>
        </div>
        
      </a>
    </li>
    );
  }
  
  
}
export default observer(PendingUser) ;
