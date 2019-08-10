import UserModel from "../Models/UserModel"
import { observable, computed, action, decorate, configure} from "mobx";

configure({ enforceActions: 'observed' })
//IMPORTS
//Model The Users Contacts And Potential Contacts
export default class UserStore {
    /**
     *
     * @param {*} storeOwner-Store Owner-Owned By This Store Instance
     */
    @observable currentActiveUser=  null;// {usename:null, uuid:null};
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
        //this.loadContacts();ls   
    }
    //Load contacts active and pending from the server using the transport layer
    loadData(){
       
        this.loadContacts();
        this.loadPendingContacts();
    }
    async asyncLoadData(){
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
        return this.isLoadingPendingContactsFlag;
    }

    setUser(user, isActive=true){
        if (isActive === true){
            let foundUser = this.activeContacts.find((element)=>{
                return element.uuid === user.uuid;
            })
            if (foundUser != null){
                foundUser.upDate(user);
            }
            else {
                this.activeContacts.push(new UserModel(this,user,true));
            }
            
        }
        else {
            let foundUser = this.pendingContacts.find((element)=>{
                return element.uuid === user.uuid;
            })
            if (foundUser != null){
                foundUser.upDate(user);
            }
            else {
                this.pendingContacts.push(new UserModel(this,user,false));
            }
        }
    }

    loadContacts(){
        this.setLoadingActive(true);
        
        return this.transporLayer.getContacts().then(usersContactList=>{
                //console.log(usersContactList);
                if (usersContactList.length === 0){
                    this.setLoadingActive(false);
                    return;
                }
                usersContactList.forEach(user => {
                    this.setUser(user,true);
                });
                this.setLoadingActive(false);
                return;
            }
        ).catch(error=>{
            console.log(error);
            this.loadingActiveError = true;
        })
    }
    loadPendingContacts(){
        this.setLoadingPending(true);
        return this.transporLayer.getPendingContacts().then(usersContactPendingList=>{
                if (usersContactPendingList.length === 0){
                    this.setLoadingPending(false);
                    return;
                }
                usersContactPendingList.forEach(user => {
                    this.setUser(user,false);
                });
                this.setLoadingPending(false);
                return;
            }
            
        ).catch(error=>{
            console.log(error);
            this.loadingPendingError = true;
        })

    }
    setActiveContact(idUsername){
        //console.log("Here");
        //console.log("Active Contact");
        //console.log(idUsername);
        if (this.activeContacts.length === 0 || idUsername === null){
            return false; 
        }
        else {
            //console.log(idUsername);
            let user = this.activeContacts.find((user)=>{
                return user.uuid === idUsername.uuid || user.username === idUsername.username;
            });
            //console.log("Found User" + user);
            //console.log(user.asJson());
            if (user === null){
                return false;
            }
            else {
                //console.log("Came here somehow");
                this.currentActiveUser = user;
                this.generateActiveUserList()
                return true;
            }
        }
    }
    get listActiveContacts(){
        if (this.activeContacts.length === 0){
            return false;
        }   
        else{
            console.log("we have Active user");
            return this.activeContacts;
            
            
        }
    }
    get listPendingContacts(){
        if (this.pendingContacts === null || this.pendingContacts.length === 0){
            //console.log("NO Active user");
            return false;
        }   
        else{
            console.log("we have Active user");
            return this.pendingContacts;
            
            
        }
    }
    
    generateActiveUserList() {
       let newUsersActives = this.activeContacts.filter(item=>{
           return item.uuid !== this.currentActiveUser.uuid;
       });
       newUsersActives.unshift(this.currentActiveUser);
       this.activeContacts = newUsersActives;
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
    setLoadingActive : action,
    setLoadingPending : action,
    listActiveContacts : computed,
    setActiveContact : action,
    loadingActiveError: observable,
    loadingPendingError: observable,
    listPendingContacts: computed
})