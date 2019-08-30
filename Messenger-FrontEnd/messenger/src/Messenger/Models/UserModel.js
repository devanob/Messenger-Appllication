//IMPORTS
// import {observer} from "mobx"
//Model The Users Contacts And Potential Contacts
export default class UserModel {
    /**
     *
     * @param {*} storeOwner-Store Owner-Owned By This Store Instance
     */
    username = null;
    //User Information
    uuid = null
    user_image=null
    store = null;
    areActiveContact=null;
    constructor(storeOwner, userJsonInfo, areActiveContact=null) {
        this.store = storeOwner;
        this.username = userJsonInfo.username;
        this.uuid = userJsonInfo.uuid;
        this.username = this.username;
        if (areActiveContact){
            this.areActiveContact =  true;
        }
        else {
            this.areActiveContact =  false;
        }
    }
    acceptRequest(){
        if (this.areActiveContact === false){
            this.store.requestAcceptHandlier(this);
        }
        else {
            //more feats maybe error handling
        }
    }
    rejectRequest(){
        if (this.areActiveContact === false){
            this.store.requestDenyHandlier(this);
            
        }
        else {
            //more feats maybe error handling
        }
    }
    setUserActive() {
        if (this.store){
            this.store.setActiveContact(this);
            //console.log("Done Setting User Active");
        }
        else {
            //console.log("No Store Attached To This Model");
        }
    }
    //Update The Current User Based On Pass Json Object
    upDate(jsonData){
        this.username = this.username;
        this.user_image = this.user_image;
        this.uuid = this.uuid;
    }
    /**
     * Convert The Internel Data to A Json Object
     */
    asJson(){
        return {
            uuid: this.uuid,
            username:this.username,
            user_image:this.user_image,

        }
    }
    /**
     * Convert Model To String
     */
    toString(){
        return `UUID: ${this.uuid} 
                USERNAME: ${this.username} 
                USER IMAGE:${this.user_image} 
                Active:${this.areActiveContact ? "Active" : "Inactive"}`
        
    }
}
