import MessagesModel from "../Models/MessagesModel"
import { observable, computed,
        action, decorate, 
        configure, reaction} from "mobx";

configure({ enforceActions: 'observed' })
//IMPORTS
//Model The Users Contacts And Potential Contacts

//Manages User Messages Store Data Oritented Container To Manager User Message
class UserMessageStore{
    /**
     *
     * @param {*} storeOwner-Store Owner-Owned By This Store Instance
     */
    userMesagesModels =  {};// list of users json and there corrsponing messages 
    isLoadingMesagesFlag= true // if loading messages from server and setting up
    loadingMessagesError= false; // error loading messages
    transporLayer = null;
    //This is the message with user that will be sent over websocket
    contructedMessage = {toUser: null , message : ""};
    constructor(store=null,transporLayer=null){
        this.store = store;
        this.transporLayer = transporLayer;
        if (this.store != null){
            //react to active user changes 
            //reset message content
            reaction ( 
                ()=>{
                    return this.store.userStore.currentActiveUser;
                }, 
                user=>{
                    this.contructedMessage.message = "";
                    this.contructedMessage.toUser= user;
                    console.log(this.contructedMessage)
                }
             )
        }
        
    }
    get contructedMessageInternelMessage(){
        return this.contructedMessage.message;
    }
    setMessageText(textMessage){
        this.contructedMessage.message = textMessage
    }
    setContactUsers(listContactUser){
        return new Promise((resolve, reject)=>{
            this.userMesagesModels = {}
            listContactUser.forEach(user=>{
                let userUUID = user.uuid;
                this.userMesagesModels[userUUID] = new MessagesModel(this,user)
            })
            resolve(true);
        })
        
        
    }
    //This returns all the message it is up to the client to  sort what group of messages then want
    get getMessages(){
        return this.userMesagesModels;
    }
    async loadMessages(){
        if (this.userMesagesModels != null ){
            
            return this.transporLayer.getMessages().then(mssgsJson=>{
                for (let key in this.userMesagesModels){
                    this.userMesagesModels[key].bulkAddMessages(mssgsJson);
                }
               
            })
        }
    }
    get getContructedMessage(){
        return this.contructedMessage;
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

decorate(UserMessageStore, {
    userMesagesModels: observable,
    isLoadingMesagesFlag:observable, 
    loadingMessagesError:observable,
    setContactUsers : action,
    getMessages: computed,
    contructedMessage : observable,
    getContructedMessage: computed,
    setMessageText : action,
    contructedMessageInternelMessage : computed
})

export default UserMessageStore;