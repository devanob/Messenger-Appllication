import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser} from '@fortawesome/free-solid-svg-icons'
import "../../css/Account.css"
import React from "react"
export default function AccountButton (props){
    return (
        <div className={`account-section ${props.className}`}>
                <button onClick={props.onClick}>
                <FontAwesomeIcon icon={faUser} />
                    {props.children}
                </button>
            </div>
    );
}