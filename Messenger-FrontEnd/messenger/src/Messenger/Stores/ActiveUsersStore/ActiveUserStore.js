import UserModel from "../../Models/UserModel";
import { observable, computed, action, decorate, configure, when} from "mobx";

configure({ enforceActions: 'observed' })
//IMPORTS
//Manage User Active Friends
export default class ActiveUserStore {
    /**
     *
     * @param {*} storeOwner-Store Owner-Owned By This Store Instance
     */
    currentActiveUser=  null;// {usename:null, uuid:null};
    activeContacts = []
    isLoadingActiveContactsFlag= true//observable.box(true);
    isLoadingPendingContactsFlag= true //observable.box(true);
    loadingActiveError= false;
    transporLayer = null;
    //collection of child store
    childStores ={};
    constructor(store=null,transporLayer=null,uiStore=null){
        this.store = store;
        this.transporLayer = transporLayer;
        if (this.store != null){
            this.store.registerChild("activeUsersStore", this);
        }
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
        //this.loadContacts();ls   
    }
    //Load contacts active and pending from the server using the transport layer
    loadData(){
       
        this.loadContacts().catch(error=>{
            console.log(error);
            this.loadingActiveError = true;
        });
    }

    registerChild(name,storeInstace){
        this.childStores[name]= storeInstace;
    }

    async asyncLoadData(){
       
            await this.loadContacts();
            return true;        
        
    }
    addFriendJson (userJson){

    }
    addFriendModel (userModel){
        this.setUserModel(userModel,true);
    }
    //set loading flags 
    setLoadingActive(bool){
        this.isLoadingActiveContactsFlag = bool;
    }

    get getIsLoadingActive(){
        return this.isLoadingActiveContactsFlag;
    }

    //return if there was an error loading  active contacts
    get getLoadingActiveError(){
        return this.loadingActiveError;
    }
    //return if there was an error loading  active contacts

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
                let newUser = new UserModel(this,user,true);
                if ("contact_id" in user ){
                    newUser.setExtraMeta({"contact_id" : user.contact_id})
                }
                this.activeContacts.push(newUser);
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
                usersContactList.contacts.forEach(user => {
                    this.setUser(user,true);
                });
                this.setLoadingActive(false);
                return;
            }
        );
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
    get getContactUser(){
        return this.currentActiveUser;
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
             }
    }
    /**
     * Convert Model To String
     */
    toString(){
        
    }
}

decorate(ActiveUserStore, {
    activeContacts : observable,
    isLoadingActiveContactsFlag: observable,
    setUser: action,
    loadContacts: action,
    setLoadingActive : action,
    listActiveContacts : computed,
    setActiveContact : action,
    loadingActiveError: observable, 
    currentActiveUser:observable,
    getLoadingActiveError : computed,
    getIsLoadingActive: computed,
    getContactUser:computed,
    addFriendModel  : action 
})