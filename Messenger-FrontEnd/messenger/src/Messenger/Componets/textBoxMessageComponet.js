import React, {Component} from "react";
export default  class TextBoxMessageComponet extends Component{
  constructor(props){
    super(props)
    console.log(props);
  }   

  render() {
    const {/*children,*/ rootStore,searchText} = this.props;
    return (<div className = "text-box-message-componet">

    </div>)
  }
  
  
}


