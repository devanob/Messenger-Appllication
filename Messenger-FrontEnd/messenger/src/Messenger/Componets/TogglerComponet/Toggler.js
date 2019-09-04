import React from "react";

/**
 * 
 * @param {*} props - incoming props from managing componet
 */
//Provides Toggling/Button Abilities
function Toggler(props) {
    const {onClickHandlier = null} = props;
    if (onClickHandlier == null){
      
    }
    return (
      <div className="toggler">
        <button  onClick ={onClickHandlier}>Close</button>
      </div>
    );
}

export default Toggler;
