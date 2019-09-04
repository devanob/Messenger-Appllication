import React, {Component} from "react";
import { observer } from 'mobx-react';
//Provides A List Of Pending Users
class SearchedUser extends Component{
  constructor(props){
    super(props)
    
  }   
  sendContactRequest= (user)=>{
    if (user !== null){
      user.sendContactRequest();
    }
  }
  
  render() {
    const {user=null} = this.props;
    const canAddStatus = user.getExtraMeta.canSendRequest;
    return (
      <li onClick={this.setActive} >
      <a href="#" >
        <div className="profile-img">
          <img src="https://via.placeholder.com/500" alt={`user-profile ${user.username}`} /> 
        </div>
        <div className="contact-info">
          <div>{user.username}</div>
         
        </div>

       {canAddStatus && <div className="add-user-container">
          <div className="add-contact">
            <button onClick={()=>{
              this.sendContactRequest(user);
            }}>Send Request</button>
          </div>
        </div>
       }
        
      </a>
    </li>
    );
  }
  
  
}
export default observer(SearchedUser) ;
