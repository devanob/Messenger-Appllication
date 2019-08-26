import React, {Component} from "react";
import { observer,inject } from "mobx-react"
import "../css/SideBar.css"
import Toggler from "./Toggler"
import Search  from "./Search"
import ActiveUsers from "./ActiveUsers"
import PendingUsers from "./PendingUsers"
import ActiveUserComponetToggler from "./ActiveUserComponetToggler"

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
    this.setState(
        {
          searchText : event.target.value 
        }
      )
  } 
  //Set which Ui Componet Should Be Rendered
  setUserUiState =(state)=>{
    this.props.rootStore.uiUserStore.setActiveElement(state);
  }
  //Render Componet
  render() {
    const {/*children,*/ rootStore} = this.props;
    let userStateUI = rootStore.uiUserStore.getActiveElement;
    let toRender = null;
    if (userStateUI ===  "ACTIVECONTACTS" ){
      toRender = ( <ActiveUsers searchText={this.state.searchText}/>);
    }
    else if (userStateUI ===  "PENDNGCONTACT"){
      toRender = ( <PendingUsers searchText={this.state.searchText}/>);
    }
    return (
      <div className={`sidebar ${rootStore.uiUserStore.getIsActive? "active": ""}`}>
        <Toggler onClickHandlier={this.toggleActiveSideBar}/>
        <ActiveUserComponetToggler stateChangeHandler={this.setUserUiState}/>
        <Search value={this.state.searchText} onChange={this.setSearchText} children={null}/>
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
