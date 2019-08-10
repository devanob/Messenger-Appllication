import React, {Component} from "react";
import { observer,inject } from "mobx-react"
import "../css/Content.css"

@inject("rootStore")
@observer
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
        <div className="content"> 
        Content
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
