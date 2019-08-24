import React, {Component} from "react";
import Toggler from "./Toggler";

import { inject } from 'mobx-react';
@inject("rootStore")
export default  class NavComponet extends Component{
  constructor(props){
    super(props)
    console.log(props);
  }   
  toggleSideBarState= ()=>{
    this.props.rootStore.uiUserStore.toggleSideBarActive();
  }
  render() {
    const {/*children,*/ rootStore,searchText} = this.props;
    return (<div className = "nav-bar-componet">
        <Toggler onClickHandlier = {this.toggleSideBarState} ></Toggler>
    </div>)
  }
  
  
}


