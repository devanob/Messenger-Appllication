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
                    this.setMessageText("");
                    this.setMessageUser(user);
                    // console.log(this.contructedMessage)
                }
             )
            if (this.transporLayer!== null){
                this.transporLayer.addEventListenerHandlier(
                    "message",this.receiveMessage
                    )
            }
        }
        
    }
    receiveMessage = (event)=>{
        let to_UserModel = this.userMesagesModels[event.to_User];
        let from_UserModel = this.userMesagesModels[event.from_User]
        if (to_UserModel !== null & typeof to_UserModel !== "undefined"){
            to_UserModel.addMessage(event);
        }
        if (from_UserModel !== null & typeof from_UserModel !== "undefined"){
            from_UserModel.addMessage(event);
        }
        else {
            console.log("Not A Contact")
        }
    }
    //sends the current message 
    sendMessage(){
        //make sure the current active user and the cached message are the same
        if (this.contructedMessage.toUser === null){
            return;
        }
        if (this.contructedMessage.toUser.uuid === this.store.userStore.currentActiveUser.uuid 
            & this.contructedMessageInternelMessage.trim().length > 0 ){
            let messageJson = this.constructMessageToSend() 
            console.log(messageJson);
            this.transporLayer.sendMessageWebSocket(messageJson);

        }
        //seems they are not in sync time to fix that 
        else{
            console.log("reset");
            this.setMessageText("");
            this.setMessageUser(this.store.userStore.currentActiveUser);
        }
    }
    constructMessageToSend(){
        let messageAsJson = {
            toUser: this.contructedMessage.toUser.uuid,
            message : this.contructedMessage.message.trim()
        }
        return messageAsJson;
    }
    get contructedMessageInternelMessage(){
        return this.contructedMessage.message;
    }
    setMessageText(textMessage){
        this.contructedMessage.message = textMessage
    }
    setMessageUser(currentActiveUser){
        this.contructedMessage.toUser = currentActiveUser;
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
    contructedMessageInternelMessage : computed,
    setMessageUser: action,
    sendMessage : action

})

export default UserMessageStore;