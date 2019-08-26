import React, {Component} from "react";

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
        </div>
  
      );
    }
    
  }
  
  export default Search;