import UserModel from "../Models/UserModel"
import { observable, computed, action, decorate, configure, when} from "mobx";
import SearchUserStore from './SearchUserStore';
import ActiveUserStore from './ActiveUsersStore/ActiveUserStore';
import PendingUserStore from './PendingUsersStore/PendingUsersStore';

configure({ enforceActions: 'observed' })
//IMPORTS
//Model The Users Contacts And Potential Contacts
export default class UserStore {
    /**
     *
     * @param {*} storeOwner-Store Owner-Owned By This Store Instance
     */
    currentActiveUser=  null;// {usename:null, uuid:null};
    activeContacts = []
    pendingContacts = []
    isLoadingActiveContactsFlag= true//observable.box(true);
    isLoadingPendingContactsFlag= true //observable.box(true);
    loadingActiveError= false;
    loadingPendingError= false;
    transporLayer = null;
    searchStore  = null;
    //collection of child store
    childStores ={};
    constructor(store=null,transporLayer=null,uiStore=null){
        this.store = store;
        this.transporLayer = transporLayer;
        this.searchStore = new SearchUserStore(this,this.transporLayer,uiStore);
        this.activeUserStore = new ActiveUserStore(this,this.transporLayer,uiStore);
        this.pendingUserStore = new PendingUserStore(this,this.transporLayer,uiStore);
        
    }
    //Load contacts active and pending from the server using the transport layer
    loadData(){
       
        // this.loadContacts().catch(error=>{
        //     console.log(error);
        //     this.loadingActiveError = true;
        // });
        this.loadPendingContacts();
    }
    registerChild(name,storeInstace){
        this.childStores[name]= storeInstace;
    }

    async asyncLoadData(){
       
            //await this.loadContacts();
            await this.loadPendingContacts();
            return true;        
        
    }
    get getSearchUserStore(){
        return this.searchStore;
    }
    //set loading flags 
    setLoadingActive(bool){
        this.isLoadingActiveContactsFlag = bool;
    }
    //set loading flags 
    setLoadingPending(bool){
        this.isLoadingPendingContactsFlag = bool;
    }

    get getIsLoadingActive(){
        //return this.isLoadingActiveContactsFlag;
        return this.childStores["activeUsersStore"].getIsLoadingActive;
    }

    get getIsLoadingPending(){
        return this.childStores["pendingUsersStore"].getIsLoadingPending
    }
    //return if there was an error loading  active contacts
    get getLoadingActiveError(){
        return this.childStores["activeUsersStore"].getLoadingActiveError;
    }
    //return if there was an error loading  active contacts
    get getLoadingPendingError(){
        return this.childStores["pendingUsersStore"].getLoadingPendingError;
    }
    //set user object using model rather than a json object
 
    
  
    get listActiveContacts(){
        return  this.childStores["activeUsersStore"].listActiveContacts;
    }
    get listPendingContacts(){
       return this.childStores["pendingUsersStore"].listPendingContacts;
    }

    get getContactUser(){
        return  this.childStores["activeUsersStore"].getContactUser;
    }

    /**
     * Convert The Internel Data to A Json Object
     */
    asJson(){
      return {
          "activeContacts": this.activeContacts.map((user)=>{
              return user.asJson();
          }),
          "pendingContacts": this.pendingContacts.map((user)=>{
            return user.asJson();
          }),
        }
    }
    /**
     * Convert Model To String
     */
    toString(){
        
    }
    get getChildStore(){
        return this.childStores;
    }
}

decorate(UserStore , {
    activeContacts : observable,
    pendingContacts : observable,
    isLoadingActiveContactsFlag: observable,
    isLoadingPendingContactsFlag: observable,
    setUser: action,
    loadContacts: action,
    setLoadingActive : action,
    setLoadingPending : action,
    listActiveContacts : computed,
    setActiveContact : action,
    loadingActiveError: observable,
    loadingPendingError: observable,
    listPendingContacts: computed, 
    currentActiveUser:observable,
    requestAcceptHandlier : action,
    requestDenyHandlier: action,
    getLoadingActiveError : computed,
    getLoadingPendingError: computed,
    getIsLoadingPending : computed,
    getIsLoadingActive: computed,
    getContactUser: computed,
})