import UserModel from "../Models/UserModel"
import { observable, computed, action, decorate, configure, reaction} from "mobx";

configure({ enforceActions: 'observed' })
//IMPORTS
//Model The Users Contacts And Potential Contacts
export default class SearchUserStore{
    /**
     *
     * @param {*} storeOwner-Store Owner-Owned By This Store Instance
     */
    searchedUsers = []
    nextQueryAdress = null 
    uiSideBar= null
    transporLayer = null;
    constructor(store=null,transporLayer=null, uiStore= null){
        this.store = store;
        this.transporLayer = transporLayer;
        this.uiStore = uiStore;
        // reaction(
        //     ()=>{
                
        //     },
        //     ()=>{

        //     }
        // )
    }
    get getSearchedUsers(){

    }
    setSearchUser(listUser){

    }

    apiSearch(){

    }

    getNextDataSet(){

    }

    //Load contacts active and pending from the server using the transport layer
   
}

decorate(SearchUserStore, {
     searchedUsers:observable,
     setSearchUser: action,
     getNextDataSet : action,
     apiSearch : action, 
})