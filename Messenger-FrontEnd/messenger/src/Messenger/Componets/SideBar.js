import React, {Component} from "react";


class SideBar extends Component{
  constructor(props){
    super(props)
    console.log(props);
    
  }
  render() {
    const {children} = this.props;
    return (
      <div class="sidebar active">
          {children}
      </div>

    );
  }
  
}

export default SideBar ;
