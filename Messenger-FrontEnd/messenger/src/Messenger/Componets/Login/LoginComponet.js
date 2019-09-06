import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import React from "react"
import Button from 'react-bootstrap/Button'
export default function LoginComponet (props){
    return (
        <Modal className="text-center" show={props.show} onHide={props.onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title className="text-center" >Messenger LogIn</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control value={props.username} onChange={props.onChangeEmail}  placeholder="Enter Username" />
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.Not Even You
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={props.onChangePassword} value={props.password}  type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group controlId="formBasicChecbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button onClick={props.logInHandlier} variant="primary" type="submit">
                    Login
                </Button>
            </Modal.Body>
            {/* <Modal.Footer>
            
            </Modal.Footer> */}
            </Modal>
    );
}