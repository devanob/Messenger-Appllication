import { observable, computed, action, decorate, configure, reaction} from "mobx";

configure({ enforceActions: 'observed' })
//IMPORTS
//Model The Users Contacts And Potential Contacts
export default class LogInStore{
    /**
     *
     * @param {*} storeOwner-Store Owner-Owned By This Store Instance
     */
    
    constructor(store=null,transporLayer=null, uiStore= null){
        this.store = store;
        this.transporLayer = transporLayer;
        this.uiStore = uiStore;
        
    }
    //handles loggin in the user from the transport layer side of things 
    logInUser(username=null, password=null){
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