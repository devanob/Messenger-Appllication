import UserModel from "../Models/UserModel"
import { observable,observer, computed, action, decorate,useStrict, configure} from "mobx";

configure({ enforceActions: 'observed' })
//IMPORTS
//Model The Users Contacts And Potential Contacts
export default class UserStore {
    /**
     *
     * @param {*} storeOwner-Store Owner-Owned By This Store Instance
     */
    activeContacts = []
    pendingContacts = []
    isLoadingActiveContactsFlag=observable.box(true);;
    isLoadingPendingContactsFlag=observable.box(true);
    transporLayer = null;
    constructor(store=null,transporLayer=null){
        this.store = store;
        this.transporLayer = transporLayer; 
    }
    setLoadingActive(bool){
        this.isLoadingActiveContactsFlag.set(bool);
    }
    setLoadingPending(bool){
        this.isLoadingPendingContactsFlag.set(bool);
    }
    get getIsLoadingActive(){
        return this.isLoadingActiveContactsFlag;
    }

    get getIsLoadingPending(){
        return this.isLoadingPendingFlag;
    }
    setUser(user, isActive=true){
        if (isActive == true){
            this.activeContacts.push(new UserModel(this,user,true));
        }
        else {
            this.pendingContacts.push(new UserModel(this,user,false));
        }
    }
    loadContacts(){
        this.setLoadingActive(true);
        return this.transporLayer.getContacts().then(usersContactList=>{
                if (usersContactList.length == 0){
                    this.setLoadingActive(false);
                    return;
                }
                usersContactList.forEach(user => {
                    this.setUser(user,true);
                });
                this.setLoadingActive(false);
            }
        ).catch(error=>{
            console.log(error);
        })
    }
    loadPendingContacts(){
        this.setLoadingPending(true);
        return this.transporLayer.getPendingContacts().then(usersContactPendingList=>{
                if (usersContactPendingList.length == 0){
                    this.setLoadingPending(false);
                    return;
                }
                usersContactPendingList.forEach(user => {
                    this.setUser(user,false);
                });
                this.setLoadingPending(true);
            }
        ).catch(error=>{
            console.log(error);
        })

    }



    /**
     * Convert The Internel Data to A Json Object
     */
    asJson(){
      
    }
    /**
     * Convert Model To String
     */
    toString(){
        
    }
}

decorate(UserStore, {
    activeContacts : observable,
    pendingContacts : observable,
    isLoadingActiveContactsFlag: observable,
    isLoadingPendingFlag: observable,
    getIsLoadingActive:computed,
    getIsLoadingPending:computed,
    setUser: action,
    loadContacts: action,
    loadContacts:action,
    setLoadingActive: action,
    setLoadingPending:action
})