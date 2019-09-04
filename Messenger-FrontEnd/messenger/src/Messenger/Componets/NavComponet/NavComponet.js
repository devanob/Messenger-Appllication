import React, {Component} from "react";
import Toggler from "../TogglerComponet/Toggler";
import { inject} from 'mobx-react';
import LoginComponet from "../Login/LoginComponet";
//Proves NavBar Functinality For The User
class NavComponet extends Component{
  constructor(props){
    super(props)
   
  } 
  //Toggles The State Of The NavBar
  toggleSideBarState= ()=>{
    this.props.rootStore.uiUserStore.toggleSideBarActive();
  }
  render() {
    const {/*children,*/searchText} = this.props;
    return (
      <div className = "nav-bar-componet">
          <Toggler onClickHandlier = {this.toggleSideBarState} ></Toggler>
          <LoginComponet logInStore ={this.props.rootStore.logInStore }></LoginComponet>
      </div>)
  }
  
  
}
export default  inject("rootStore")(NavComponet)

