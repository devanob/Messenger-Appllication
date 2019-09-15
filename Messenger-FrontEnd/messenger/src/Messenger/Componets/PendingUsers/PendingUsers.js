import React, {Component} from "react";
import { observer,inject } from "mobx-react"
import PendingUser from "./PendingUser"
import SpinnerComponet from "../LoadingSpinner/SpinnerComponet";
import InfoComponet from "../InfoComponet/InfoComponet";
//Manages A List Of Pending Users Instances
class PendingUsers extends Component{
  constructor(props){
    super(props)
  }   

  render() {
    const {/*children,*/ rootStore,searchText} = this.props;
    let pendingUsers = rootStore.userStore.listPendingContacts;
    let loading = rootStore.userStore.getIsLoadingPending;
    if (!loading){
      if (!pendingUsers){
          return (
            <InfoComponet>No Pending Users</InfoComponet>
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
        <SpinnerComponet></SpinnerComponet>
      );
    }
  }
  
  
}

export default inject("rootStore")(observer(PendingUsers));
