import React, {Component} from "react";
import { observer,inject } from "mobx-react"
import PendingUser from "./PendingUser"
@inject("rootStore")
@observer
class PendingUsers extends Component{
  constructor(props){
    super(props)
    console.log(props);
  }   

  render() {
    const {/*children,*/ rootStore,searchText} = this.props;
    let pendingUsers = rootStore.userStore.listPendingContacts;
    let loading = rootStore.userStore.getIsLoadingPending;
    if (!loading){
      if (!pendingUsers){
          return (
            <div className="pendingUsers">
                YOu Have Pending Contact
            </div>
           );
      }
      return (
      <div className="pendingUsers">
          
          <ul className="users">
              
              {pendingUsers.filter((item=>{
                return item.username.toLowerCase().includes(searchText.toLowerCase());
              })).map(user=>{
                
                  return (
                      <PendingUser  key={user.uuid} user={user}/>
                  )
              })}
          </ul>
      </div>
      );
    }
    else {
      return (
        <div className="pendingUsers">Loading..........</div>
      );
    }
  }
  
  
}

export default PendingUsers;
