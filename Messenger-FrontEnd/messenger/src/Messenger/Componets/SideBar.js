import React, {Component} from "react";
import { observer,inject } from "mobx-react"
import "../css/SideBar.css"
import Toggler from "./TogglerComponet/Toggler"
import Search  from "./Search/Search"
import ActiveUsers from "./ActiveUsers/ActiveUsers"
import PendingUsers from "./PendingUsers/PendingUsers"
import ActiveUserComponetToggler from "./ActiveUserToggler/ActiveUserComponetToggler"
//  import css styling 
import "../css/ActiveUser.css"
import "../css/PendingUser.css"
import "../css/Search.css"
import "../css/Toggler.css"
import "../css/LoadingSpinner.css"
import "../css/SearchedUser.css"
import "../css/ActiveComponetToggler.css"
import SearchedUsersComponet from "./SearchUsers/SearchedUsersComponet";
//Manages The Most Top Layer Of The Side Bar U.I
class SideBar extends Component{
  constructor(props){
    super(props);

    this.state = {
        searchText: ""
    };
    
  }
  //Toggles The Side Bar 
  toggleActiveSideBar =()=>{
    this.props.rootStore.uiUserStore.toggleSideBarActive();
  }
  //Handles Text Change in child componet Search 
  setSearchText = (event)=>{
    this.props.rootStore.uiUserStore.setsearchString(event.target.value);
    
      
  }
  searchForUser=()=>{
    this.props.rootStore.userStore.getSearchUserStore.searchForUsers();
  }
  //Set which Ui Componet Should Be Rendered
  setUserUiState =(state)=>{
    this.props.rootStore.uiUserStore.setActiveElement(state);
    
      
    
  }
  //Render Componet
  render() {
    const {/*children,*/ rootStore} = this.props;
    const userStateUI = rootStore.uiUserStore.getActiveElement;
    const viableStates = rootStore.uiUserStore.getViableStates;
    const searchString = this.props.rootStore.uiUserStore.getSearchString;
    let toRender = null;
    if (userStateUI ===  "ACTIVECONTACTS" ){
      toRender = ( <ActiveUsers searchText={searchString }/>);
    }
    else if (userStateUI ===  "PENDINGCONTACTS"){
      toRender = ( <PendingUsers searchText={searchString}/>);
    }
    else if (userStateUI ===  "SEARCHPENDING"){
      //toRender = ( <PendingUsers searchText={this.state.searchText}/>);
      toRender = (<SearchedUsersComponet searchUserStore={rootStore.userStore.getSearchUserStore}  
                  searchText={searchString}/>)
    }
    return (
      <div className={`sidebar ${rootStore.uiUserStore.getIsActive? "active" : ""}`}>
        <Toggler onClickHandlier={this.toggleActiveSideBar}/>
        <ActiveUserComponetToggler viableStates={viableStates} stateChangeHandler={this.setUserUiState}/>
        <Search searchHandlier={this.searchForUser} value={searchString} onChange={this.setSearchText} children={null}/>
        {toRender}
        


      </div>

    );
  }
  //Viables State Changes 
  viableStates = [
    "ACTIVECONTACTS",
    "PENDNGCONTACT",
    "SEARCHUSER",
]
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.log(error);
    console.log(errorInfo);
  }
  
}

export default inject("rootStore")(observer(SideBar));
