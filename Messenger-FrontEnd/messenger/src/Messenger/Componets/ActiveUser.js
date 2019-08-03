import React, {Component} from "react";
import { observer,inject } from "mobx-react"
@inject("rootStore")
@observer
class ActiveUser extends Component{
  constructor(props){
    super(props)
    
  }   
  setActive= ()=>{
    //console.log("componet");
    //console.log(this.props.user);
    this.props.user.setUserActive();
  }
  render() {
    const {children, user=null} = this.props;
    
    return (
    <li onClick={this.setActive}>
        {user.username}
        {children}
    </li>
    );
  }
  
  
}

export default ActiveUser;
