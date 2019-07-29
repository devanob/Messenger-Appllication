
import {autorun} from "mobx";
import MessengerService from "../Sevices/MessengerService"
import UserStore from "./UserStore"


it("Testing UserStore-", async () => {
    //let UsersJson;
    let messengerModule = new MessengerService();
    await messengerModule.getLoginToken("Devano", "11kingie");
    let userStore = new UserStore(null,messengerModule);
    autorun(()=>{
      console.log("Loading State Contacts " + userStore.isLoadingActiveContactsFlag);
      //console.log("Loading State Pending Contacts " + userStore.isLoadingPendingContactsFlag);
      // console.log(userStore.activeContacts.length);
      // console.log(userStore.pendingContacts.length);
      //console.log("User Contact Count: "+ userStore.activeContacts.length);
    });
    autorun(()=>{
      //console.log("Loading State Contacts " + userStore.isLoadingActiveContactsFlag);
      console.log("Loading State Pending Contacts " + userStore.isLoadingPendingContactsFlag);
      // console.log(userStore.activeContacts.length);
      // console.log(userStore.pendingContacts.length);
      //console.log("User Contact Count: "+ userStore.activeContacts.length);
    });
    await userStore.loadContacts();
    await userStore.loadPendingContacts();
    console.log(userStore.asJson());
  
});

it("Testing Active User UserStore", async () => {
  let UsersJson;
  let messengerModule = new MessengerService();
  await messengerModule.getLoginToken("Devano", "11kingie").catch(error=>{
    //console.log(error);
  });
  let userStore = new UserStore(null,messengerModule);
  
  await userStore.loadContacts();
  await userStore.loadPendingContacts();
  autorun(()=>{
    console.log("---testBegin---");
    userStore.listActiveContacts.forEach(item=>{
      console.log(item.toString());
    })
  })
  userStore.setActiveContact("Devano");
  userStore.setActiveContact("KyleLink");
  userStore.setActiveContact("MissMeme");
  

});