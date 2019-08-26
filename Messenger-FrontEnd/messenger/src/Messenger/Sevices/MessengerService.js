import axios from "axios";
import ReconnectingWebSocket from 'reconnecting-websocket';
 import {observable, action, configure, decorate, reaction, computed} from "mobx";

configure({ enforceActions: 'observed' })

class MessengerService {

    //LogIn Token Key 
    tokenHeaderReady = null;
    reconnectingWebSocket = null;
    //Check if the websocket is connected yet yet?
    webSocketisConnected = false;
    webSocketisError = false;
    isLoggin = false;
    authToken = null;
    constructor(){
        this.headersList = {
            headers:{"Content-Type": 'application/json'},
        };
        //if the usernmae and password is supplied then get the token from the server
       
        
    }
    setWebSocketError(value){
        this.webSocketisError = value;
    }
    setLoggedIn(value){
        this.isLoggin = value;
    }
    setConnectedWebSocketFlag(value){
       this.webSocketisConnected = true;
    }
  
    async setUpWebSocket(){
        
        let url = `ws://127.0.0.1:8000/ws/messenger/?token=${this.authToken}`;
        this.reconnectingWebSocket = new ReconnectingWebSocket(url);
        this.reconnectingWebSocket.addEventListener('open', () => {
            console.log("Connected To WebSocket");
            this.setConnectedWebSocketFlag(true);
            this.setErrorWebSocketFlag(false);
        });

        this.reconnectingWebSocket.addEventListener('error', (error) => {
            console.log(error);
            this.setConnectedWebSocketFlag(false);
            this.setErrorWebSocketFlag(true);
        });

        this.reconnectingWebSocket.addEventListener('close', (mssg) => {
            console.log("Disconnected To WebSocket");
            this.setConnectedWebSocketFlag(false);
        });
          
        
    }
    static async createWithLoginToken(usernamePassWord=null){
       
       let  messageService = new MessengerService();
       await messageService.getLoginToken(usernamePassWord.username, usernamePassWord.password).then(mssg=>{
           console.log("hbfhjfhjejehjhefvh");
       }).catch(error=>{
           console.log(error);
       });
       return messageService;
    }
    getContacts(){
        return axios.get('http://127.0.0.1:8000/user/api/users/active_contacts/',
        this.headersList
        ).then((response)=>{
                return response.data;
            }
        )
      
    }
    getPendingContacts(){
        return axios.get('http://127.0.0.1:8000/user/api/users/pending_contacts/',
        this.headersList
        ).then((response)=>{
            return response.data;
        }
        )
        
    }

    getMessages(){
        return axios.get('http://127.0.0.1:8000/api/message/',
        this.headersList
        ).then((response)=>{
            return response.data;
        }
        );
    }

    getLoginToken(username=null, password=null, callBack = null){
        if (username == null || password == null){
            return new Promise((resolve, reject)=>{
                if (this.tokenHeaderReady){
                    resolve(true);
                }
                else {
                    reject(false);
                }
            })
        }
        return  axios.post('http://127.0.0.1:8000/user/api/auth/login/',
        {"username":username, "password": password},
        this.headersList
        ).then((response)=>{
            let userLoginInfo = response.data;
            this.headersList.headers["Authorization"] = `Token ${userLoginInfo.token}`;
            this.tokenHeaderReady = true;
            this.authToken = userLoginInfo.token;
            this.setLoggedIn(true)
            return this.headersList.headers["Authorization"];
            
        });
        
    }


   
    // initAPI(){

        
          
    // }
    // initWebSocket(){
        
    // }
}


decorate(MessengerService, {
    webSocketisConnected : observable,
    isLoggin :observable,
    webSocketisConnected : observable, 
    setConnectedWebSocketFlag: action,
    setLoggedIn: action,
    setWebSocketError: action

})
export default MessengerService
