import React, {Component} from "react";
import { observer,inject } from "mobx-react"
import "../css/SideBar.css"
import Toggler from "./Toggler"
import Search  from "./Search"
import ActiveUsers from "./ActiveUsers"
import PendingUsers from "./PendingUsers"
import ActiveUserComponetToggler from "./ActiveUserComponetToggler"

@inject("rootStore")
@observer
class SideBar extends Component{
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
  setUserUiState =(state)=>{
    this.props.rootStore.uiUserStore.setActiveElement(state);
  }
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

export default SideBar ;
