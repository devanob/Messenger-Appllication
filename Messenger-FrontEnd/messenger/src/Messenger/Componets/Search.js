import React, {Component} from "react";
class Search extends Component{
    constructor(props){
      super(props)
      // console.log(props);
      
    }
    render() {
      const {value=null, onChange=null, children=null} = this.props;
      return (
        <div className="search">
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