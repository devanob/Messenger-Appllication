import React, {Component} from "react";
import { observer,inject } from "mobx-react"
import SpinnerComponet from "../LoadingSpinner/SpinnerComponet";
import SearchedUser from "./SearchedUser";
//Manages A List Of Pending Users Instances
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown} from '@fortawesome/free-solid-svg-icons'
import InfoComponet from '../InfoComponet/InfoComponet';
class SearchedUsers extends Component{
  
  constructor(props){
    super(props);
    this.ulRefSearchedUsers = React.createRef();
    this.heightList = 0;
  }
  //Handles Click Event When User Request For More Users
  handlierLoadMoreUsers = (event)=>{
    const {searchUserStore=null} = this.props;
    if (searchUserStore != null){
      searchUserStore.getNextDataSet();
    }
  }
  // trackHeightPostion(event){
  //   // console.log(event);
  // }
  // componentDidMount(){
  //   // this.ulRefSearchedUsers .current.scrollTop =  this.ulRef.current.scrollHeight;
  //   console.log(this.ulRefSearchedUsers.current);
  //   if(this.ulRefSearchedUsers.current !== null){
  //     this.ulRefSearchedUsers.current.addEventListener("scroll", this.trackHeightPostion);
  //   }
  // }
  // componentDidUpdate(){
  //   console.log(this.ulRefSearchedUsers.current);
  //   //this.ulRefSearchedUsers.current.addEventListener("scroll", this.trackHeightPostion);
  // }
  // componentWillUnmount(){
  //   this.ulRefSearchedUsers.current.removeEventListener("scroll", this.trackHeightPostion);
  // }
  
  render() {
    //searchUserStore
    const {/*children,*/ searchUserStore=null,searchText=null} = this.props;
    if (searchUserStore == null){
      return (<div>Seems The RootStore Was Not Provided</div>)
    }
    const searchUsers = searchUserStore.getSearchedUsers;
    const loading = searchUserStore.getloadingUser;
    const moreUsersLoad= searchUserStore.getNextQueryAddress
    if (!loading){
      if (!searchUsers){
          return (
            <div className="searchUsers">
                <InfoComponet className="no-search-user">Search Users Using The Search Bar</InfoComponet>
            </div>
           );
      }
      return (
      <div className="searchUsers">
          
          <ul ref={this.ulRefSearchedUsers} className="users">
              
              {searchUsers.map((user=>{
                return(
                        <SearchedUser  key={user.uuid} user={user}/>
                      )
              }))}
             {moreUsersLoad &&
              <li className="loadContact" onClick={this.handlierLoadMoreUsers}>
                <div className="loading-contacts-container">
                  <div className="load-more-contacts" >
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                </div>
              </li>
             }
          </ul>
      </div>
      );
    }
    else {
      return (
        
        <SpinnerComponet></SpinnerComponet>
      );
    }
  }
  
  
}

export default inject("rootStore")(observer(SearchedUsers));
