
import MessengerService from "../Sevices/MessengerService"
import UserStore from "./UsersStore"
import {autorun} from "mobx";
it("Testing UserStore", async () => {
    let UsersJson;
    let messengerModule = new MessengerService();
    await messengerModule.getLoginToken();
    let userStore = new UserStore(null,messengerModule)
    autorun(()=>{
      console.log("Loading State Contacts " + userStore.isLoadingActiveContactsFlag.get());
      console.log("Loading State Pending Contacts " + userStore.isLoadingPendingContactsFlag.get());
      // console.log(userStore.activeContacts.length);
      // console.log(userStore.pendingContacts.length);
      //console.log("User Contact Count: "+ userStore.activeContacts.length);
    })
    await userStore.loadContacts();
    await userStore.loadPendingContacts()
  
});