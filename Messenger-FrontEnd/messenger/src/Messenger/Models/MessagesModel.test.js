import MessengerService from "../Sevices/MessengerService"
import UserModel from "./UserModel"
import MessagesModel from "./MessagesModel";


it("Testing UserModel", async () => {
  let UsersJson;
  let messengerModule = new MessengerService();
  await messengerModule.getLoginToken("Devano", "11kingie");
  await messengerModule.getContacts().then(reponse=>{
    let userModels = reponse.map(userJson=>{
      return new UserModel(null,userJson,true);
    })
    
    let messageModels = userModels.map(user=>{
        return new MessagesModel(null,user);
    })
    messageModels.forEach(messageModel=>{
        console.log(messageModel.asJson());
    })

   
  }).catch(error=>{
    console.log(error);
  });
  
 
  

  
});