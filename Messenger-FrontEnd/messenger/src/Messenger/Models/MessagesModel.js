
import { observable, computed, action, decorate, configure} from "mobx";

configure({ enforceActions: 'observed' })
//IMPORTS
//Model The Users Contacts And Potential Contacts


class MessagesModel{
    /**
     *
     * @param {*} storeOwner-Store Owner-Owned By This Store Instance
     */
    /**
     * User UUID-C
     */
    user = null;
    messages =  [];// {usename:null, uuid:null};
    
    constructor(store=null, user=null){
        this.store = store;
        
        this.user = user
        // console.log(this.asJson())
    }

    get getMessages(){
        return this.userMesages;
    }

    
    addMessage(mssgJson){
       if ((mssgJson.to_User === this.user.uuid || mssgJson.from_User === this.user.uuid) ){
            this.messages.push(mssgJson)
        }
    }

    
    bulkAddMessages(arrayMessage){
       
        arrayMessage.forEach(mssg=>{
            this.addMessage(mssg);
        })
        //console.log(this.messages)
    }
    asJson(){
      return {
          'user':this.user.uuid, 'messages' : this.messages
        };
    }
    /**
     * Convert Model To String
     */
    toString(){
        
    }
}

decorate(MessagesModel, {
    messages: observable,
    addMessage : action,
    getMessages: computed, 
    bulkAddMessages: action,

})

export default MessagesModel;