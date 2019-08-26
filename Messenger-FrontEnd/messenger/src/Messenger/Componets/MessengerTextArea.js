import React, {Component} from "react";
//TextBox Section This Is Where User Input And Sending Messages Will Be Handle On The Ui/Client Side
export default  class MessengerTextArea extends Component{
  textInputEnter = React.createRef();
  constructor(props){
    super(props)
  }   
  componentDidUpdate(){
    let textAreaDOME = this.textInputEnter.current;
    textAreaDOME.addEventListener("keydown", (event)=>{
        if (event.code ==="Enter"){
            console.log("We Good");
        }
    }, false);
    }

  onEnter(event){
    console.log(event);
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


