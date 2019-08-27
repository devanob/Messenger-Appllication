import React, {Component} from "react";
//TextBox Section This Is Where User Input And Sending Messages Will Be Handle On The Ui/Client Side
export default  class MessengerTextArea extends Component{
  textInputEnter = React.createRef();
  constructor(props){
    super(props)
  }   
  componentDidUpdate(){
    let textAreaDOME = this.textInputEnter.current;
    textAreaDOME.addEventListener("keyup",this.onEnter, false);
  }

  onEnter= (event)=>{
    const {sendMessageHandlier=null} = this.props;
    if (event.code === "Enter"){
      if (sendMessageHandlier != null){
        sendMessageHandlier();
      }
  }
  }
  render() {
    const {text = null , onTextChange= null} = this.props;
    return (
     <div className="textBox">
        <textarea ref={this.textInputEnter} onChange={onTextChange} value= {text}> </textarea>
      </div>
    )
  }
  
  
}


