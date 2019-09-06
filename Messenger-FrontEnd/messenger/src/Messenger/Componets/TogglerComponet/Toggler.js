import React from "react";

/**
 * 
 * @param {*} props - incoming props from managing componet
 */
//Provides Toggling/Button Abilities
function Toggler(props) {
    const {onClickHandlier = null, children=null, text=null, className=null} = props;
    if (onClickHandlier == null){
      
    }
    return (
      <div className={`toggler ${className}`}>
        <button  onClick ={onClickHandlier}>
        {text}
        {children}</button>
      </div>
    );
}

export default Toggler;
