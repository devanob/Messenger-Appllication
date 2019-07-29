import MessengerService from "./MessengerService"
it("Testing Messenger Service-Login Token", async () => {
    let messengerModule = new MessengerService();
    await messengerModule.getLoginToken();
    
  });

  it("Testing Messenger Service-Get Active Contacts", async () => {
    let messengerModule = new MessengerService();
    await messengerModule.getLoginToken();
    await messengerModule.getContacts().then(reponse=>{
      console.log(reponse);
    });
    
  });
   
  it("Testing Messenger Service-Get Pending Contacts", async () => {
    let messengerModule = new MessengerService();
    await messengerModule.getLoginToken();
    await messengerModule.getPendingContacts().then(reponse=>{
      console.log(reponse);
    });
    
  });