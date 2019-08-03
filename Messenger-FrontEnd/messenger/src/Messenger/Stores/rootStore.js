
import {configure} from "mobx";
import  MessengerService  from "../Sevices/MessengerService"
import UserStore from "./UserStore"
import UIUserStore from "./UIUsersStore"
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
        this.startAsyncServices().then(()=>{
            console.log("Done Loading");
        })
    }
    //Start Async Services That are need as soon a 
    async startAsyncServices(){
        await this.transportLayer.getLoginToken("Devano", "11kingie");
        await this.userStore.asyncLoadData();
        return true;
    }
}