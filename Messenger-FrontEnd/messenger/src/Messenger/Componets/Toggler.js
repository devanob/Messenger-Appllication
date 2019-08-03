import React, {Component} from "react";

/**
 * 
 * @param {*} props - incoming props from managing componet
 */
function Toggler(props) {
    const {onClickHandlier = null} = props;
    return (
      <div className="toggler">
        <button  onClick ={onClickHandlier}>toggleMe</button>
      </div>
    );
}

export default Toggler;
