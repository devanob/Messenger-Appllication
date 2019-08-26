
import {configure} from "mobx";
import  MessengerService  from "../Sevices/MessengerService"
import UserStore from "./UserStore"
import UIUserStore from "./UIUsersStore"
import UserMessageStore from "./UserMessagesStore"
configure({ enforceActions: 'observed' })
/**
 * Root Store 
 */
export default class RootStore {
    transportLayer = null;
    userStore = null;
    uiSideBarStore = null;
    constructor(store=null, userNamePassword=null){
        this.transportLayer = new MessengerService();
        this.userStore = new UserStore(this,this.transportLayer);
        this.uiUserStore = new UIUserStore(this);
        this.userMessageStore = new UserMessageStore(this,this.transportLayer)
        this.startAsyncServices().then((num)=>{
        }).catch(error=>{
            console.log(error);
        })
    }
    //Start Async Services That are need as soon a 
    async startAsyncServices(){
        await this.transportLayer.getLoginToken("Devano", "11kingie");
        //await this.transportLayer.setUpWebSocket();
        await this.userStore.asyncLoadData();
        await this.userMessageStore.setContactUsers(this.userStore.listActiveContacts)
        await this.userMessageStore.loadMessages();
        return true;
    }
}