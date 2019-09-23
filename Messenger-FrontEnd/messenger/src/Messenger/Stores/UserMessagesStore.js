import MessagesModel from "../Models/MessagesModel"
import { observable, computed,
        action, decorate, 
        configure, reaction, when} from "mobx";
const truncate = (input) => input.length > 5 ? `${input.substring(0, 5)}...` : input;
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
    userStore=null
    //This is the message with user that will be sent over websocket
    contructedMessage = {toUser: null , message : ""};
    constructor(store=null,transporLayer=null, userStore=null, mainStore=null){
        this.store = store;
        this.transporLayer = transporLayer;
        this.userStore = userStore;
        if (this.store != null){
            if (this.store  != null){
                this.store.registerChild("messagesStore", this);
            }
            if (mainStore  != null){
                mainStore.registerChild("messagesStore", this);
            }
            //react to active user changes 
            //reset message content
            // reaction to 
        
            reaction ( 
                ()=>{
                    //console.log(this.store.userStore.getContactUser);
                    return this.store.userStore.getContactUser;
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
        ///if we got a valid userstore
        // getLoadingActiveError : computed,
        if (this.userStore != null ){
            when(
                ()=>{
                    
                    return !this.userStore.getLoadingActiveError && !this.userStore.getIsLoadingActive;
                }, 
                ()=>{
                    this.setContactUsers(this.userStore.listActiveContacts).then(status=>{
                        if (status === true){
                            this.loadMessagesUUID().catch(error=>{
                                console.log(error);
                            });
                        }
                        else{
                            return;
                        }
                        
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            
            )
        }
        
    }
    registerChild(name, instance){
        this.childStores[name]= instance;
    }
    getChildStore(name){
        return this.childStores[name];
    }

      
    receiveMessage = (event)=>{

        let to_UserModel = this.userMesagesModels[event.to_User];
        let from_UserModel = this.userMesagesModels[event.from_User]
        if (from_UserModel !== null & typeof from_UserModel !== "undefined"){
            from_UserModel.addMessage(event);
        }
        if (to_UserModel !== null & typeof to_UserModel !== "undefined"){
            to_UserModel.addMessage(event);
        }
        
        else {
           
        }
    }
    //sends the current message 
    sendMessage(){
        //make sure the current active user and the cached message are the same
        if (this.contructedMessage.toUser === null){
            return;
        }
        if (this.contructedMessage.toUser.uuid === this.store.userStore.getContactUser.uuid 
            & this.contructedMessageInternelMessage.trim().length > 0 ){
            let messageJson = this.constructMessageToSend();
            if ("contact_id" in this.contructedMessage.toUser.getExtraMeta){
                messageJson["contact_id"] = this.contructedMessage.toUser.getExtraMeta["contact_id"];
            }
            this.transporLayer.sendMessageWebSocket(messageJson).then(status=>{
                this.setMessageText("");
            }).catch(error=>{

            });

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
    getMessageModel(uuid){
        if (uuid in this.userMesagesModels){
            return this.userMesagesModels[uuid];
        }
        else {
            return null;
        }
    }
    getLastMessage(uuid){
        if (uuid in this.userMesagesModels){
            //console.log(this.userMesagesModels[uuid].getLastMessage);
            return this.userMesagesModels[uuid].getLastMessage.message;
        }
        else {
            return ""
        }
    }
    get contructedMessageInternelMessage(){
        return this.contructedMessage.message;
    }
    ///get the message for the current active user
    
    get getMessagesActiveUser(){
        if (this.contructedMessage.toUser){
            let activerUser = this.contructedMessage.toUser;
            if (activerUser.uuid in this.userMesagesModels){
                return this.userMesagesModels[activerUser.uuid];
            }
            else {
                return this.userMesagesModels[activerUser.uuid];
            }
        }
        else {
            console.log("no active User");
            return null;
        }
    }
    setMessageText(textMessage){
        this.contructedMessage.message = textMessage
    }
    setMessageUser(currentActiveUser){
        this.contructedMessage.toUser = currentActiveUser;
    }

    setContactSingle(userContact){
        if (!(userContact.uuid in this.userMesagesModels)){
            let userUUID = userContact.uuid;
            this.userMesagesModels[userUUID] = new MessagesModel(this,userContact);
        }
        //might need to make a query to get your messages 
         
    }
    setContactUsers(listContactUser){
        return new Promise((resolve, reject)=>{
            this.userMesagesModels = {}
            if (listContactUser.length > 1){
                listContactUser.forEach(user=>{
                    let userUUID = user.uuid;
                    this.userMesagesModels[userUUID] = new MessagesModel(this,user)
                })
                resolve(true);
            }
            else {
                reject(false);
            }
        
            
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
    async loadMessagesUUID(){
        if (this.userMesagesModels != null ){
            let list_uuid = []
            for (let key_uuid in this.userMesagesModels){
                list_uuid.push(key_uuid);
            }
            return this.transporLayer.getMessagesUUID({"list_uuid":list_uuid}).then(mssgsJson=>{
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
    sendMessage : action,
    getMessagesActiveUser: computed,
    setContactSingle: action, 
    // getLastMessage: computed

})

export default UserMessageStore;