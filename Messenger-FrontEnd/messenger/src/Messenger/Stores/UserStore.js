import UserModel from "../Models/UserModel"
import { observable, computed, action, decorate, configure, when} from "mobx";
import SearchUserStore from './SearchUserStore';

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
    constructor(store=null,transporLayer=null,uiStore=null){
        this.store = store;
        this.transporLayer = transporLayer;
        this.uiSideBarStore = new SearchUserStore(this,this.transporLayer,uiStore);
        when(
            ()=>{
                
                return this.transporLayer.isLoggedIn;
                
            }, 
            (isLoggedIn)=>{
                //if the user is logged in then 
                
                    console.log("loaddata");
                    this.asyncLoadData().then(code=>{
                        console.log(code);
                    }).catch(error=>{
                        console.log(error);
                    })
               
            })
        //this.loadContacts();ls   
    }
    //Load contacts active and pending from the server using the transport layer
    loadData(){
       
        this.loadContacts();
        this.loadPendingContacts();
    }
    async asyncLoadData(){
        try{
            await this.loadContacts();
            await this.loadPendingContacts();
            return true
        }
        catch(error){
            return false;
        }
        
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
    //return if there was an error loading  active contacts
    get getLoadingActiveError(){
        return this.loadingActiveError;
    }
    //return if there was an error loading  active contacts
    get getLoadingPendingError(){
        return this.loadingPendingError;
    }
    //set user object using model rather than a json object
    setUserModel(modelObject, isActive=true){
        if (isActive === true){
            let foundUser = this.activeContacts.find((element)=>{
                return element.uuid === modelObject.uuid;
            })
            if (foundUser != null){
                foundUser.upDate(modelObject);
            }
            else {
                this.activeContacts.push(modelObject);
            }
            
        }
        else {
            let foundUser = this.pendingContacts.find((element)=>{
                return element.uuid === modelObject.uuid;
            })
            if (foundUser != null){
                foundUser.upDate(modelObject);
            }
            else {
                this.pendingContacts.push(modelObject);
            }
        }
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
            return this.activeContacts;
            
            
        }
    }
    get listPendingContacts(){
        if (this.pendingContacts === null || this.pendingContacts.length === 0){
            return false;
        }   
        else{
            return this.pendingContacts;
            
            
        }
    }

    requestAcceptHandlier(userModel){
        this.transporLayer.acceptContactRequest(userModel.uuid).then(action(response=>{
            //if the request was accepted Contact made active
            if (response){
                //splice  from pending here
                userModel.areActiveContact=true;
                let modifiledPending= this.pendingContacts.filter(element=>{
                    return element.uuid !== userModel.uuid;
                });
                this.pendingContacts.replace(modifiledPending);
                this.setUserModel(userModel, userModel.areActiveContact);
            }
            else {

            }
        })
        )
    }
    //Accept A Model To Accepted Into The Active List Of Contacts
    //Handles Accepting Of Contact Request
    requestDenyHandlier(userModel){
        this.transporLayer.denyContactRequest(userModel.uuid).then(action(response=>{
            //if the request was accepted Contact made active
            if (response){
                //splice  from pending here
                let modifiledPending= this.pendingContacts.filter(element=>{
                    return element.uuid !== userModel.uuid;
                });
                this.pendingContacts.replace(modifiledPending);
            }
            else {

            }
        })
        )
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
    getIsLoadingActive: computed
})