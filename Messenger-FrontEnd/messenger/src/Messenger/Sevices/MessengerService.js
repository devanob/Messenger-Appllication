import axios from "axios";
import ReconnectingWebSocket from 'reconnecting-websocket';
 import {observable, action, configure, decorate, reaction, computed, when} from "mobx";

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
    eventListener = {};
    constructor(){
        this.headersList = {
            headers:{"Content-Type": 'application/json'},
        };
        //check for login changes
        when (
            //when we know the user is logged then run the predicate
            ()=>{
                return this.isLoggedIn;
            },
            ()=>{
                this.setUpWebSocket();
            }

        
        )
        
    }
    /**
     * Handlier Adding Event For Varius Application Such As Message
     */
    addEventListenerHandlier(eventType = null, functionHandlier =null){

        if (eventType === null | functionHandlier === null | !eventType instanceof String){
        // it's a string){
            console.log("Cannot Add Empty Event Or Handliers or null or not string");
        }
        else {
            let arrayHandliers = this.eventListener[eventType];
            if (arrayHandliers !== null & typeof arrayHandliers !== 'undefined' ){
                //push an an event  to the current event handier queue
                arrayHandliers.push(functionHandlier);
            }
            else {
                this.eventListener[eventType] = [];
                this.eventListener[eventType].push(functionHandlier)
            }


        }
        
        
    }
    //handles events from the web-socket
    eventReceiverHandlier =(event)=>{
        let eventJson = JSON.parse(event.data);
        let eventType = eventJson.type.trim().toLowerCase();
        if (typeof eventType !== 'undefined' | eventType !== null ){
            let arrayHandliers= this.eventListener[eventType];
            if (arrayHandliers !== null | typeof arrayHandliers !== 'undefined' ){
                arrayHandliers.forEach(handlier=>{
                    try {
                        if (handlier.length  < 1){
                            handlier();
                        }
                        else {
                            handlier(eventJson);
                        }
                    }
                    catch(error){
                        console.log(error);
                    }
                })
            }
        }
    }
    get isLoggedIn(){
        return this.isLoggin;
    }
    ///send message vio websocket to the host
    sendMessageWebSocket(message){
         //add message type 
         return new Promise((resolve,reject)=>{
             //if we are connected to the server
            if (this.webSocketisConnected){
                message['type'] = "message"
                message = JSON.stringify(message)
                this.reconnectingWebSocket.send(message);
                resolve(true); //we were able to send the message
            }
            else { //we are not connected to the server 
                reject(false);
            }
         })
        
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
            //this.setErrorWebSocketFlag(false);
        });

        this.reconnectingWebSocket.addEventListener('error', (error) => {
            console.log(error);
            this.setConnectedWebSocketFlag(false);
            //this.setErrorWebSocketFlag(true);
        });

        this.reconnectingWebSocket.addEventListener('close', (mssg) => {
            console.log("Disconnected To WebSocket");
            this.setConnectedWebSocketFlag(false);
        });
        this.reconnectingWebSocket.addEventListener('message', this.eventReceiverHandlier )
            
          
        
    }
    //
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
    setWebSocketError: action,
    isLoggedIn: computed

})
export default MessengerService
