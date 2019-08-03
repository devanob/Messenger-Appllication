import React, {Component} from "react";
import { observer,inject } from "mobx-react"
import "../css/SideBar.css"
import Toggler from "./Toggler"
import Search  from "./Search"
import ActiveUsers from "./ActiveUsers"
@inject("rootStore")
@observer
class SideBar extends Component{
  constructor(props){
    super(props)
    console.log(props);

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
    const {children, rootStore} = this.props;
    //console.log(rootStore.userStore.activeContacts.length);
    return (
      <div className={`sidebar ${rootStore.uiUserStore.getIsActive? "active": ""}`}>
        <Toggler onClickHandlier={this.toggleActiveSideBar}/>
        <Search value={this.state.searchText} onChange={this.setSearchText} children={null}/>
        <ActiveUsers searchText={this.state.searchText}/>
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

export default SideBar ;
