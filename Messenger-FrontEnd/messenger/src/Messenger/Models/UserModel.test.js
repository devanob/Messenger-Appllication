import MessengerService from "../Sevices/MessengerService"
import UserModel from "./UserModel"


it("Testing UserModel", async () => {
  let UsersJson;
  let messengerModule = new MessengerService();
  await messengerModule.getLoginToken("Devano", "11kingie");
  await messengerModule.getContacts().then(reponse=>{
    let userModels = reponse.map(userJson=>{
      return new UserModel(null,userJson,true);
    })
    for (let  i = 0 ; i < userModels.length; i++){
      console.log(userModels[i].toString());
    }
   
  }).catch(error=>{
    console.log(error);
  });
  
 
  

  
});