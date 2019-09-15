import React from 'react';

const  InfoComponet = (props)=>{
  
  return (
    <div className="containerLoading">
        <div className={`Info ${props.className ? props.className : ""}`}>
            {props.children}
        </div>
        
    </div>
  );
}
export default InfoComponet;