
import { observable, computed, action, decorate, configure} from "mobx";

configure({ enforceActions: 'observed' })
//IMPORTS
//Model The Users Contacts And Potential Contacts
export default class MessagesModel{
    /**
     *
     * @param {*} storeOwner-Store Owner-Owned By This Store Instance
     */
    /**
     * User UUID-C
     */
    user = null;
    @observable messages =  [];// {usename:null, uuid:null};
    
    constructor(store=null, user=null){
        this.store = store;
        
        this.user = user
        // console.log(this.asJson())
    }
    @computed get getMessages(){
        return this.userMesages;
    }
    @action
    addMessage(mssgJson){

        if (mssgJson.to_User == this.user || mssgJson.from_User == this.user ){
            this.messages.push(mssgJson)
        }
    }
    @action
    bulkAddMessages(arrayMessage){
       
        arrayMessage.forEach(mssg=>{
            //this.messages.push(mssg.to_User);
            if((mssg.to_User === this.user.uuid || mssg.from_User === this.user.uuid)){
                //console.log("ffew");
                this.messages.push(mssg);
                
            }
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

