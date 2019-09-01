import React, {Component} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
//Provides Search Functionality Throught TextInput Send Text Event To Handlier(Parent-)
class Search extends Component{
    constructor(props){
      super(props);

    }
    render() {
      const {value=null, onChange=null, children=null} = this.props;
      return (
       
        <div className="search-users">
            <form>
                {children}<input
                type = "text"
                value = {value}
                onChange = {onChange}
                />
            </form>
            <div className="search-button-container">
              <div className="searchButton">
                <FontAwesomeIcon icon={faSearch} />
              </div>
            </div>
        </div>
        
        
  
      );
    }
    
  }
  
  export default Search;