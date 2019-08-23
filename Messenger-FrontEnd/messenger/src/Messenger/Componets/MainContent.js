import React, {Component} from "react";
import { observer,inject } from "mobx-react"

import "../css/Content.css"
import NavComponet from "./NavComponet";
import MessageComponet from "./MessageComponet";
import TextBoxMessageComponet from "./textBoxMessageComponet";

class MainContent extends Component{
  constructor(props){
    super(props);

    this.state = {
        searchText: ""
    };
    
  }

  toggleActiveSideBar =()=>{
    this.props.rootStore.uiUserStore.toggleSideBarActive();
  }
  setSearchText = (event)=>{
    this.setState(
        {
          searchText : event.target.value 
        }
      )
  } 
  render() {
    const {/*children,*/ rootStore} = this.props;
    //console.log(rootStore.userStore.activeContacts.length);
    return (
        <div className="MainContent"> 
        <NavComponet></NavComponet>
        <MessageComponet></MessageComponet>
        <TextBoxMessageComponet></TextBoxMessageComponet>
        </div>

    );
  }
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.log(error);
    console.log(errorInfo);
  }
  
}

export default  MainContent;
