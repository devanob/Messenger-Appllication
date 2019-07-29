import MessengerService from "./MessengerService"


it("Testing Messenger Service-Login Token", async () => {
    let messengerModule = new MessengerService();
    await messengerModule.getLoginToken("Devano", "11kingie").catch(error=>{
      console.log(error);
    });
    
  });

  it("Testing Messenger Service-Get Active Contacts", async () => {
    let messengerModule = new MessengerService();
    await messengerModule.getLoginToken("Devano", "11kingie");
    await messengerModule.getContacts().then(reponse=>{
      console.log(reponse);
    });
    
  });
   
  it("Testing Messenger Service-Get Pending Contacts", async () => {
    let messengerModule = new MessengerService();
    await messengerModule.getLoginToken("Devano", "11kingie");
    await messengerModule.getPendingContacts().then(reponse=>{
      console.log(reponse);
    });
    
  });

  it("Testing Array Stuff", async () => {
    let arrayTest = [9, 10, 11, 12, 14 , 15, 3, 5 , 7, 8];
    
    let activeNum = 3;
    console.log(arrayTest.sort((a,b)=>{
      return b == activeNum;
    }));
    activeNum = 15;
    console.log(arrayTest.sort((a,b)=>{
      return b == activeNum;
    }));

  });

  