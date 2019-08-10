import React from "react";
/**
 * 
 * @param {*} props - incoming props from managing componet
 */

function ActiveUserComponetToggler(props) {
    const {stateChangeHandler= null} = props;
    console.log(stateChangeHandler);
    return (
      <div className="users-type-toggler">
        <ul className="users-type-toggler-list">
            <li>
                <button  onClick ={()=>stateChangeHandler("ACTIVECONTACTS")}>Active User</button>
            </li>
            <li> 
                <button  onClick ={()=>stateChangeHandler("PENDNGCONTACT")}>Pending User</button>
            </li>
            <li>
                <button  onClick ={()=>stateChangeHandler("SEARCHUSER")}>Search Users</button>
            </li>
        </ul>
      </div>
    );
}

export default ActiveUserComponetToggler;
