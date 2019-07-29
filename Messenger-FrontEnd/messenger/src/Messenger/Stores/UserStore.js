import UserModel from "../Models/UserModel"
import { observable,observer, computed, action, decorate,useStrict, configure, isObservableArray} from "mobx";

configure({ enforceActions: 'observed' })
//IMPORTS
//Model The Users Contacts And Potential Contacts
export default class UserStore {
    /**
     *
     * @param {*} storeOwner-Store Owner-Owned By This Store Instance
     */
    
    currentActiveUser= null;// {usename:null, uuid:null};
    activeContacts = []
    pendingContacts = []
    isLoadingActiveContactsFlag= true//observable.box(true);
    isLoadingPendingContactsFlag= true //observable.box(true);
    loadingActiveError= false;
    loadingPendingError= false;
    transporLayer = null;
    constructor(store=null,transporLayer=null){
        this.store = store;
        this.transporLayer = transporLayer;
        console.log(this.transporLayer);
        //this.loadContacts();

       
        
    }
    //Load contacts active and pending from the server using the transport layer
    loadData(){
       
        this.loadContacts();
        this.loadPendingContacts();
    }
    async asyncLoadData(){
        console.log("Async load Data");
        await this.loadContacts();
        await this.loadPendingContacts();
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
        return this.isLoadingActiveContactsFlag;
    }

    get getIsLoadingPending(){
        return this.isLoadingPendingFlag;
    }

    setUser(user, isActive=true){
        if (isActive == true){
            foundUser = this.activeContacts.find((element)=>{
                element.uuid = user.uuid;
            })
            if (foundUser != null){
                foundUser.upDate(user);
            }
            else {
                this.activeContacts.push(new UserModel(this,user,true));
            }
            
        }
        else {
            foundUser = this.activeContacts.find((element)=>{
                element.uuid = user.uuid;
            })
            if (foundUser != null){
                foundUser.upDate(user);
            }
            else {
                this.activeContacts.push(new UserModel(this,user,false));
            }
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
            //console.log(error.response);
            this.loadingActiveError = true;
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
            }
        ).catch(error=>{
            //console.log(error);
            this.loadingPendingError = false;
        })

    }
    setActiveContact(idUsername){
        if (this.activeContacts.length == 0){
            return false; 
        }
        else {
            let user = this.activeContacts.find((user)=>{
                return user.uuid == idUsername || user.username == idUsername;
            });
            if (user == null){
                return false;
            }
            else {
                this.currentActiveUser = user;
                return true;
            }
        }
    }
    get listActiveContacts(){
        if (this.currentActiveUser == null || this.activeContacts.length == 0){
            return this.activeContacts;
        }   
        else{
            let activeUser = this.currentActiveUser;
            console.log("Running");
            //  this.activeContacts.sort((a,b)=>{
            //     b == activeUser;
            // });
            return this.activeContacts.sort((a,b)=>{
                return b.uuid == activeUser.uuid;
            });
            
            
        }
    }


    /**
     * Convert The Internel Data to A Json Object
     */
    asJson(){
      return {
          "activeContacts": this.activeContacts.map((user)=>{
              return user.toString();
          }),
          "pendingContacts": this.pendingContacts.map((user)=>{
            return user.toString();
          }),
        }
    }
    /**
     * Convert Model To String
     */
    toString(){
        
    }
}

decorate(UserStore , {
    activeContacts : observable,
    pendingContacts : observable,
    isLoadingActiveContactsFlag: observable,
    isLoadingPendingContactsFlag: observable,
    setUser: action,
    loadContacts: action,
    loadContacts:action,
    setLoadingActive : action,
    setLoadingPending : action,
    currentActiveUser : observable,
    listActiveContacts : computed,
    setActiveContact : action,
    loadingActiveError: observable,
    loadingPendingError: observable
})