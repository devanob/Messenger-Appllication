import React, {Component} from "react";
import Toggler from "./Toggler";
import { inject, observer } from 'mobx-react';
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
    const {/*children,*/ rootStore,searchText} = this.props;
    return (
      <div className = "nav-bar-componet">
          <Toggler onClickHandlier = {this.toggleSideBarState} ></Toggler>
      </div>)
  }
  
  
}
export default  inject("rootStore")(NavComponet)

