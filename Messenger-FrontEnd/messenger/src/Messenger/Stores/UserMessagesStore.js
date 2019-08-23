import MessagesModel from "../Models/MessagesModel"
import { observable, computed, action, decorate, configure} from "mobx";

configure({ enforceActions: 'observed' })
//IMPORTS
//Model The Users Contacts And Potential Contacts
export default class UserMessageStore{
    /**
     *
     * @param {*} storeOwner-Store Owner-Owned By This Store Instance
     */
    @observable userMesagesModels =  {};// {usename:null, uuid:null};
    @observable isLoadingMesagesFlag= true//observable.box(true);
    @observable loadingMessagesError= false;
    transporLayer = null;
    constructor(store=null,transporLayer=null){
        this.store = store;
        this.transporLayer = transporLayer;
        //this.loadContacts();ls   
    }
    @action
    setContactUsers(listContactUser){
        return new Promise((resolve, reject)=>{
            this.userMesagesModels = {}
            listContactUser.forEach(user=>{
                let userUUID = user.uuid;
                //this.userMesagesModels.push({userUUID : new MessagesModel(this,user)});
                this.userMesagesModels[userUUID] = new MessagesModel(this,user)
            })
            resolve(true);
        })
        
        //console.log(this.userMesages)
    }
    //This returns all the message it is up to the client to  sort what group of messages then want
    @computed get getMessages(){
        return this.userMesagesModels;
    }
    async loadMessages(){
        if (this.userMesagesModels != null ){
            
            return this.transporLayer.getMessages().then(mssgsJson=>{
                for (let key in this.userMesagesModels){
                    this.userMesagesModels[key].bulkAddMessages(mssgsJson);
                }
                // this.userMesagesModels.forEach(model=>{
                //     console.log("loadMssgs");
                //     console.log(model);
                //     model.bulkAddMessages(mssgsJson);
                // })
            })
        }
    }
    asJson(){
      return {

          "MessageModel" : this.userMesagesModels

          }
        
    }
    /**
     * Convert Model To String
     */
    toString(){
        
    }
}

