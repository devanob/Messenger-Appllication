import axios from "axios";
import ReconnectingWebSocket from 'reconnecting-websocket';

export default class MessengerService {

    //LogIn Token Key 
    tokenHeaderReady = null;
    reconnectingWebSocket = null;
    authToken = null;
    constructor(){
        this.headersList = {
        headers:{"Content-Type": 'application/json'},
        };
        //if the usernmae and password is supplied then get the token from the server
       
        
    }
    

    setUpWebSocket(){
        
        let url = `ws://127.0.0.1:8000/ws/messenger/?token=${this.authToken}`;
        this.reconnectingWebSocket = new ReconnectingWebSocket(url);
        this.reconnectingWebSocket.addEventListener('open', () => {
          console.log("Connected To WebSocket");
        });

        this.reconnectingWebSocket.addEventListener('error', (error) => {
            console.log(error);
          });
          
        
    }
    static async createWithLoginToken(usernamePassWord=null){
       
       let  messageService = new MessengerService();
       await messageService.getLoginToken(usernamePassWord.username, usernamePassWord.password).then(mssg=>{
           console.log(mssg);
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
            if (callBack != null){
                callBack();
            }
            this.setUpWebSocket();
            return this.headersList.headers["Authorization"];
            
        });
        
    }


   
    // initAPI(){

        
          
    // }
    // initWebSocket(){
        
    // }
}

