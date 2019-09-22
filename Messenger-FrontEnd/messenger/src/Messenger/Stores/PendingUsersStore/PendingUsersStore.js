import UserModel from "../../Models/UserModel"
import { observable, computed, action, decorate, configure, when} from "mobx";


configure({ enforceActions: 'observed' })
//IMPORTS
//Handles Pending Users
export default class PendingUserStore {
    /**
     *
     * @param {*} storeOwner-Store Owner-Owned By This Store Instance
     */
    pendingContacts = []
    isLoadingPendingContactsFlag= true //observable.box(true);
    loadingPendingError= false;
    transporLayer = null;
    //collection of child store
    childStores ={};
    constructor(store=null,transporLayer=null,uiStore=null, mainStore=null){
        this.store = store;
        this.transporLayer = transporLayer;
        this.uiStore = uiStore;
        when(
            ()=>{
                
                return this.transporLayer.isLoggedIn;
                
            }, 
            ()=>{
                //if the user is logged in then 
                
                   
                    this.asyncLoadData().then(code=>{
                        console.log(code);
                    }).catch(error=>{
                        console.log(error);
                    })
               
            })
            if (this.store != null){
                this.store.registerChild("pendingUsersStore", this);
            }
            if (mainStore  != null){
                mainStore.registerChild("pendingUsersStore", this);
            }
    }
    //Load contacts active and pending from the server using the transport layer
    registerChild(name,storeInstace){
        this.childStores[name]= storeInstace;
    }
    async asyncLoadData(){
       
            //await this.loadContacts();
            await this.loadPendingContacts();
            return true;        
        
    }
    //set loading flags 
    setLoadingPending(bool){
        this.isLoadingPendingContactsFlag = bool;
    }

    get getIsLoadingPending(){
        return this.isLoadingPendingContactsFlag;
    }
    //return if there was an error loading pending contacts
    get getLoadingPendingError(){
        return this.loadingPendingError;
    }
    //set user object using model rather than a json object
    setUserModel(modelObject, isActive=false){
        if (isActive === false){
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
        if (isActive === false ){
            let foundUser = this.pendingContacts.find((element)=>{
                return element.uuid === user.uuid;
            })
            if (foundUser != null){
                foundUser.upDate(user);
            }
            else {
                let newUser = new UserModel(this,user,false);
                if ("contact_id" in user ){
                    newUser.setExtraMeta({"contact_id" : user.contact_id})
                }
                this.pendingContacts.push(newUser);
            }
            
        }
        
    }
    //load user pending contacts
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
            
        )

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
        console.log("here");
        this.transporLayer.acceptContactRequest(userModel.getExtraMeta["contact_id"]).then(action(response=>{
            //if the request was accepted Contact made active
            if (response){
                //splice  from pending here
                userModel.areActiveContact=true;
                let modifiledPending= this.pendingContacts.filter(element=>{
                    return element.uuid !== userModel.uuid;
                });
                this.pendingContacts.replace(modifiledPending);
                this.store.getChildStore["activeUsersStore"].addFriendModel(userModel);
                //this.setUserModel(userModel, userModel.areActiveContact);
            }
            else {

            }
        })
        )
    }
    //Accept A Model To Accepted Into The Active List Of Contacts
    //Handles Accepting Of Contact Request
    requestDenyHandlier(userModel){
        this.transporLayer.denyContactRequest(userModel.getExtraMeta["contact_id"]).then(action(response=>{
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
    


    /**
     * Convert The Internel Data to A Json Object
     */
    asJson(){
      return {
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

decorate(PendingUserStore, {
    pendingContacts : observable,
    isLoadingActiveContactsFlag: observable,
    isLoadingPendingContactsFlag: observable,
    setUser: action,
    setLoadingPending : action,
    loadingPendingError: observable,
    listPendingContacts: computed, 
    requestAcceptHandlier : action,
    requestDenyHandlier: action,
    getLoadingPendingError: computed,
    getIsLoadingPending : computed,
})