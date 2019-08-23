import React, {Component} from "react";
export default  class NavComponet extends Component{
  constructor(props){
    super(props)
    console.log(props);
  }   

  render() {
    const {/*children,*/ rootStore,searchText} = this.props;
    return (<div className = "nav-bar-componet">

    </div>)
  }
  
  
}


