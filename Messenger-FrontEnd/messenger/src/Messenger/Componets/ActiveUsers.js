import React, {Component} from "react";
import { observer,inject } from "mobx-react"
import ActiveUser from "./ActiveUser"
@inject("rootStore")
@observer
class ActiveUsers extends Component{
  constructor(props){
    super(props)
    console.log(props);
  }   

  render() {
    const {/*children,*/ rootStore,searchText} = this.props;
    let activeUsers = rootStore.userStore.listActiveContacts;
    let loading = rootStore.userStore.getIsLoadingActive;
    if (!loading){
      if (!activeUsers){
        return (
          <div className="activeUsers">
              YOu Have No Contacts
          </div>
         );
      } 
      return (
      <div className="activeUsers">
          
          <ul className="users">
              
              {activeUsers.filter((item=>{
                return item.username.toLowerCase().includes(searchText.toLowerCase());
              })).map(user=>{
                
                  return (
                      <ActiveUser  key={user.uuid} user={user}/>
                  )
              })}
          </ul>
      </div>
      );
    }
    else {
      return (
        <div className="activeUsers">Loading..........</div>
      );
    }
  }
  
  
}

export default ActiveUsers;
