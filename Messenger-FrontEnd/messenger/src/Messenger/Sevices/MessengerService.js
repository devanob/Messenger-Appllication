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
    current_auth_user ="";
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
        this.checkUserLoggedIn().then(user=>{
            if (user != null){
                this.current_auth_user = user;
                this.setLoggedIn(true);
            }
            else {
                this.setLoggedIn(false);
            }
        })
        
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
    //action sets the user loggined flag
    //  isLoggedIn(bool){
    //     this.isLoggin = bool;
    // }
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
    //gets the current active user a list of contacts
    getContacts(){
        return axios.get('http://127.0.0.1:8000/api/active-contacts/',
        this.headersList
        ).then((response)=>{
                let activeUser = this.current_auth_user.uuid;
                let contacts = response.data.results.map(contact=>{
                    //filter out the current user instances 
                    let contactJson = contact.friend.uuid === activeUser ? contact.friend_ship_initiator : contact.friend;
                    contactJson["contact_id"] = contact.id;
                    return contactJson;
                })
                return {"contacts":contacts,"next":response.data.next};
            }
        )
      
    }
    getPendingContacts(){
        return axios.get('http://127.0.0.1:8000/api/pending-contacts/',
        this.headersList
        ).then((response)=>{
                let activeUser = response.data.current_user;
                
                let contacts = response.data.contacts.map(contact=>{
                    //filter out the current user instances 
                    let contactJson = contact.friend.uuid === activeUser ? contact.friend_ship_initiator : contact.friend;
                    contactJson["contact_id"] = contact.id;
                    return contactJson;
                })

                console.log(contacts);
                return contacts;
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
    getMessagesUUID(data){
        return  axios.post('http://127.0.0.1:8000/api/message/getMessageUUID/',
        data,
        this.headersList
        ).then((response)=>{
            return response.data;
            
        });
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
        //login the given user correct 
        return  axios.post('http://127.0.0.1:8000/user/api/auth/login/',
        {"username":username, "password": password},
        this.headersList
        ).then((response)=>{
            let userLoginInfo = response.data;
            this.headersList.headers["Authorization"] = `Token ${userLoginInfo.token}`;
            this.tokenHeaderReady = true;
            this.authToken = userLoginInfo.token;
            this.current_auth_user = userLoginInfo.user;
            console.log(this.current_auth_user);
            this.setLoggedIn(true);
            return this.headersList.headers["Authorization"];
        
        });
        
    }
    //send a request to the api to accep the given user contact request with the given id
    //**
    /* 
     * @param {*} user_uuid accepted user uuid 
     */

    acceptContactRequest(contact_id){
        let putRequest = `http://127.0.0.1:8000/api/pending-contacts/${contact_id}/`
        return axios.put(putRequest,{},this.headersList ).then(response=>{
            ///if the resource was modified then return the user data
            if (response.status === 200){
                return response.data;
            }
            //else return a false;
            else {
                return false;
            }
        });
    }
    //send a request to the api to reject the given user contact request with the given uuid
    //**
    /* 
     * @param {*} user_uuid rejected user uuid 
     */
    denyContactRequest(user_uuid){
        console.log(user_uuid);
        console.log(this.headersList);
        let putRequest = `http://127.0.0.1:8000/api/pending-contacts/${user_uuid}/`
        return axios.delete(putRequest,this.headersList ).then(response=>{
            ///if the resource was modified then return the user data
            if (response.status === 200){
                return response.data;
            }
            //else return a false;
            else {
                return false;
            }
        });
    }
    /**
     * Queiries the api for user with the given pattern match querySearch - Will Not Return user already pending or contact
     * @param {*} querySearch  - the get param for api user queries search 
     */
    searchUsers(querySearch){
        return axios.get(`http://127.0.0.1:8000/api/users/?search=${querySearch}`, this.headersList).
            then(response=>{
                return response.data;
        })
    }
    //send a contact request to the user with the given uuid
    sendContactRequest(userUUID){
        
        return  axios.post('http://127.0.0.1:8000/api/pending-contacts/',
        {"uuid":userUUID},
        this.headersList
        ).then((response)=>{
           return response;
           
        });
        
    }
    //queries for the next user search query
    getNextUsersSet(queryString){
        return axios.get(queryString, this.headersList).
        then(response=>{
            return response.data;
        })
    }
    /**Check if the user is logged in using the api 
     * 
        
     */
    checkUserLoggedIn(){
        return this.checkLoggedInAPI().then(response=>{
            //user is logged
            if (response.status === 200 && response.data.isLoggedIn === true ){
                return response.data.user
            }
            else {
                return null;
            }
        })
    }
    checkLoggedInAPI(){
        return axios.get("http://127.0.0.1:8000/api/auth/islogin/", this.headersList).
            then(response=>{
                return response;
            })
    }






   
    // initAPI(){

        
          
    // }
    // initWebSocket(){
        
    // }
}


decorate(MessengerService, {
    isLoggin :observable,
    webSocketisConnected : observable, 
    setConnectedWebSocketFlag: action,
    setLoggedIn: action,
    setWebSocketError: action,
    isLoggedIn: computed,

})
export default MessengerService