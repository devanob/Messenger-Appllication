import React, {Component} from "react";
import Button from 'react-bootstrap/Button'
import { observer } from "mobx-react";
import LoginComponet from "./LoginComponet";
import AccountButton from './AccountButton';
/***
 * Higher Level Or Parent Componet For Handling User Account Management
 */
class AccountComponet extends Component{
    
    constructor(props){
      super(props)
      this.state = 
      {
          "show": false,
          "username": "",
          "password": ""

      };

    }
    logInHandlier=()=>{
        const {logInStore=null} = this.props;
        logInStore.logInUser(this.state.username, this.state.password);
        
    }
    setShow(bool){
        this.setState( 
            
                (previousState)=>{
                    return {show: bool, password: bool ? previousState.password : ""}
                }
            
        );
    }
    onChangeEmail = (event)=>{
        this.setState( 
            {
                "username": event.target.value
            }
        );
    }
    onChangePassword = (event)=>{
        this.setState( 
            {
                "password": event.target.value
            }
        );
    }
    handleClose = () => this.setShow(false);
    handleShow = () => this.setShow(true);
    render(){
        const {logInStore=null} = this.props;
        const isLoggedIn = logInStore.isLoggedIn
        return (
        <>  
            <AccountButton
                onClick={this.handleShow} 
            >
                {!isLoggedIn ? "LOGIN" : "LOGOUT"}
            </AccountButton>
            <LoginComponet
                show ={!isLoggedIn && this.state.show}
                onHide={this.handleClose}
                username = {this.state.username}
                password = {this.state.password}
                onChangeEmail={this.onChangeEmail}
                onChangePassword = {this.onChangePassword}
                logInHandlier = {this.logInHandlier}
            >

            </LoginComponet>
            
        </>
        );
    }
  }
  
  export default observer(AccountComponet);