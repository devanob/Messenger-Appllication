import React from "react";
/**
 * 
 * @param {*} props - incoming props from managing componet
 */
//Toggler That Provides User With Ui Option Chnages Such As Active Contact or a list of pending contact
function ActiveUserComponetToggler(props) {
    const {stateChangeHandler= null, viableStates=null} = props;
    if (viableStates == null){
        return (<div>Viable States Werent Given:Error</div>)
    }
    return (
      <div className="users-type-toggler">
        <ul className="users-type-toggler-list">
            {viableStates.map(viableState=>{
                return (
                <li id={viableState.stateName+"Id"} key={viableState.stateName+"Id"} 
                        className="item-type">
                    <button   onClick ={
                        ()=>stateChangeHandler(viableState.stateName)}>
                        {viableState.uiName}
                    </button>
                </li >)
            })}
        </ul>
      </div>
    );
}

export default ActiveUserComponetToggler;
