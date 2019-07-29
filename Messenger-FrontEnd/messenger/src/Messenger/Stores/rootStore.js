
import { observable,observer, computed, action, decorate,useStrict, configure, isObservableArray} from "mobx";
import  MessengerService  from "../Sevices/MessengerService"
import UserStore from "./UserStore"
configure({ enforceActions: 'observed' })
/**
 * Root Store 
 */
export default class RootStore {
    transportLayer = null;
    userStore = null;
    constructor(store=null, userNamePassword=null){
        this.transportLayer = new MessengerService();
        this.userStore = new UserStore(this,this.transportLayer);
        
    
        
     
        //Now To Intial Our Stores
        //UserStore
        //this.userStore = new UserStore(this,this.transportLayer);


    }
    //Start Async Services That are need as soon a 
    async startAsyncServices(){
        await this.transportLayer.getLoginToken("Devano", "11kingie");
        await this.userStore.asyncLoadData();
        return true;
    }
}