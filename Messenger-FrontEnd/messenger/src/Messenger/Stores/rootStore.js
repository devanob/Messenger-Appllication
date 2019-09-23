
import {configure} from "mobx";
import  MessengerService  from "../Sevices/MessengerService"
import UserStore from "./UserStore"
import UIUserStore from "./UIUsersStore"
import UserMessageStore from "./UserMessagesStore"
import LogInStore from './LoginStore';
configure({ enforceActions: 'observed' })
/**
 * Root Store - Top Manager For Every Store Provides Dependecy Control And Injections 
 */
export default class RootStore {
    transportLayer = null;
    userStore = null;
    uiSideBarStore = null;
    //All child and sub -tore stores. 
    allStores = {};
    /**
     * 
     * @param {*} store - tries to log in the user if a user name and passord is given (to be scrapped)
     * @param {*} userNamePassword 
     */
    constructor(store=null, userNamePassword=null){
        this.transportLayer = new MessengerService();
        this.uiUserStore = new UIUserStore(this, this);
        this.userStore = new UserStore(this,this.transportLayer, this.uiUserStore, this );
        this.userMessageStore = new UserMessageStore(this,this.transportLayer,this.userStore, this );
        this.logInStore = new LogInStore(this,this.transportLayer,this.uiSideBarStore, this);
        this.startAsyncServices().then((num)=>{
        }).catch(error=>{
            console.log(error);
        })
    }
    /**
     * 
     * @param {*} name - class json name
     * @param {*} instance  - class instance 
     */
    registerChild(name, instance){
        this.allStores[name] = instance;
    }
    getStore(name){
        if (name in this.allStores){
            return this.allStores[name];
        }
        else {
            return null;
        }
    }
    //Start Async Services That are need as soon a 
    async startAsyncServices(){
        await this.transportLayer.getLoginToken("Devano", "11kingie");
        //await this.userStore.asyncLoadData();
        //await this.userMessageStore.setContactUsers(this.userStore.listActiveContacts)
        //await this.userMessageStore.loadMessages();
        return true;
    }
    
}