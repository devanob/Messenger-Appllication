import React, {Component} from "react";
import Toggler from "../TogglerComponet/Toggler";
import { inject} from 'mobx-react';
import LoginComponet from "../Login/LoginComponet";
import "../../css/NavBar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faAlignLeft} from '@fortawesome/free-solid-svg-icons'
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
          <Toggler onClickHandlier = {this.toggleSideBarState} className="main-toggle">
            <FontAwesomeIcon icon={faAlignLeft} />  Open/Close </Toggler>
          <LoginComponet logInStore ={this.props.rootStore.logInStore }></LoginComponet>
      </div>)
  }
  
  
}
export default  inject("rootStore")(NavComponet)

