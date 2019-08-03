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
    const {children, rootStore,searchText} = this.props;
    //console.log("Called Again");
   // console.log(rootStore.userStore.activeContacts);
    return (
    <div className="activeUsers">
        <ul className="users">
       
            {rootStore.userStore.listActiveContacts.filter((item=>{
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
  
  
}

export default ActiveUsers;
