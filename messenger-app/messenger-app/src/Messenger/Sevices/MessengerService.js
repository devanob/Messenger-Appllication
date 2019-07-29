import axios from "axios";


export default class MessengerService {

    //LogIn Token Key 
    //tokenKey = null
    constructor(){
        this.headersList = {
        headers:{"Content-Type": 'application/json'},
        // Authorization: `Bearer ${token}`,
        };
    }
    getContacts(){
        return axios.get('http://127.0.0.1:8000/user/api/users/active_contacts/',
        this.headersList
        ).then((response)=>{
                return response.data;
            }
        ).catch(error=>{
            console.log(error);
        })
      
    }
    getPendingContacts(){
        return axios.get('http://127.0.0.1:8000/user/api/users/pending_contacts/',
        this.headersList
        ).then((response)=>{
            return response.data;
        }
        ).catch(error=>{
            return error;
        })
        
    }
    getLoginToken(){
        //"session-login":1
        return  axios.post('http://127.0.0.1:8000/user/api/auth/login/',
        {"username":"Devano", "password":"11kingie"},
        this.headersList
        ).then((response)=>{
            let userLoginInfo = response.data;
            this.headersList.headers["Authorization"] = `Token ${userLoginInfo.token}`;
            //console.log(this.headersList);
        }).catch(error=>{
           // console.log(error);
        });
        
    }
    // initAPI(){

        
          
    // }
    // initWebSocket(){
        
    // }
}

