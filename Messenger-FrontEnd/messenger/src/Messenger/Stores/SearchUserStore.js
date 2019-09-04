import UserModel from "../Models/UserModel"
import { observable, computed, action, decorate, configure} from "mobx";

configure({ enforceActions: 'observed' })
//IMPORTS
//Model The Users Contacts And Potential Contacts
export default class SearchUserStore{
    /**
     *
     * @param {*} storeOwner-Store Owner-Owned By This Store Instance
     */
    searchedUsers = [];
    nextQueryAddress= null ;
    uiSideBar= null;
    transporLayer = null;
    loadingUsers= false;
    loadUserError=false;
    constructor(store=null,transporLayer=null, uiStore= null){
        this.store = store;
        this.transporLayer = transporLayer;
        this.uiStore = uiStore;
        
    }
    get getloadingUser() {
        return this.loadingUsers;
    }
    get getloadingUserError() {
        return this.loadUserError;
    }
    get getNextQueryAddress(){
        return this.nextQueryAddress;
    }
    get getSearchedUsers(){
        if (this.searchedUsers.length < 1){
            return false;
        }
        else {
            return this.searchedUsers;
        }
    }
    setSearchUsers(listUser){
        let mappedUsers = listUser.map(user=>{
            let userModelInstance = new UserModel(this,user,false);
            userModelInstance.setExtraMeta(
                {"canSendRequest": true}
            );
            return userModelInstance;
        });
        this.searchedUsers.push(...mappedUsers);
    }
    //makes a request to the server api for list user with matching queries
    searchForUsers(){
        let searchUserQuery = this.uiStore.getSearchString;
        //cannot make empty string queries
        if (searchUserQuery.trim().length < 1 ){
            return;
        }
        //reset query to empty
        this.loadingUsers = true;
        this.searchedUsers = []
        this.loadUserError = false;
        this.transporLayer.searchUsers(searchUserQuery).then(action(data=>{
            this.setSearchUsers(data.results);
            this.nextQueryAddress = data.next;
            this.loadUserError = false;
            this.loadingUsers = false;
        })).catch(action(error=>{
            this.loadUserError = true;
            this.loadingUsers = false;
        }));
    }
    /**
     * 
     * @param {*} useModel reference to a user model..Processes A Request
     */
    sendContactRequest(userModel){
        this.transporLayer.sendContactRequest(userModel.uuid).then(action(data=>{
            if(data.status === 201){
                this.searchedUsers=this.searchedUsers.filter(user=>{
                    return user.uuid !== userModel.uuid
                });
            }
            else if(data.status!==201 &&  data.status < 300){
                userModel.setExtraMeta({"canSendRequest": false});
                
            }
        }));
    }
    getNextDataSet(){
        this.transporLayer.getNextUsersSet(this.nextQueryAddress)
        .then(action(data=>{
            this.setSearchUsers(data.results);
            this.nextQueryAddress = data.next;
        })).catch(error=>{

        });
    }

    //Load contacts active and pending from the server using the transport layer
   
}

decorate(SearchUserStore, {
     searchedUsers:observable,
     setSearchUsers: action,
     getNextDataSet : action,
     apiSearch : action,
     getloadingUser: computed,
     getloadingUserError: computed,
     getSearchedUsers: computed,
     searchForUsers: action,
     loadingUsers : observable,
    loadUserError:observable,

})