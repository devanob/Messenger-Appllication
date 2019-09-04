import React, {Component} from "react";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { observer } from "mobx-react";
class LoginComponet extends Component{
    
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
        return (
        <>
            <Button variant="primary" onClick={this.handleShow}>
                {logInStore.isLoggedIn ? "LogOut" : "LogIn"}
            </Button>
            <Modal className="text-center" show={this.state.show} onHide={this.handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title className="text-center" >Messenger LogIn</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control value={this.state.username} onChange={this.onChangeEmail}  placeholder="Enter email/username" />
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.Not Even You
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={this.onChangePassword} value={this.state.password}  type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group controlId="formBasicChecbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button onClick={this.logInHandlier} variant="primary" type="submit">
                    Login
                </Button>
            </Form>
            </Modal.Body>
            {/* <Modal.Footer>
            
            </Modal.Footer> */}
            </Modal>
        </>
        );
    }
  }
  
  export default observer(LoginComponet);