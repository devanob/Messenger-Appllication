import { observable, computed, action, decorate, configure, reaction} from "mobx";

configure({ enforceActions: 'observed' })
//IMPORTS
//Provides A Store For User Login And Logout System Communticates With The Messenger Service
export default class LogInStore{
    
    /* 
     * @param {*} store - store manager manages this store instance 
     * @param {*} transporLayer  - the messenger service transporLayer
     * @param {*} uiStore- uid store layer 
     */
    constructor(store=null,transporLayer=null, uiStore= null){
        this.store = store;
        this.transporLayer = transporLayer;
        this.uiStore = uiStore;
        //check if the user is already loggin i.e session authenication
        
    }
    //handles loggin in the user from the transport layer side of things 
    logInUser(username=null, password=null){
        //Does allow empty username and passwords
        if (username == null || password == null){
            ///
        }
        else {
            this.transporLayer.getLoginToken(username=username, password=password).then(flag=>{
                if (flag===true){
                    console.log("we Log in ");
                }
                else {

                }
            })
        }
    }
    /**
     * returns if the current user is logged in or not 
     */
    get isLoggedIn(){
        if (this.transporLayer != null){
            return this.transporLayer.isLoggedIn
        }
        else {
            return false;
        }
    }

    //Load contacts active and pending from the server using the transport layer
   
}

decorate(LogInStore, {
    isLoggedIn: computed,
    logInUser: action
})