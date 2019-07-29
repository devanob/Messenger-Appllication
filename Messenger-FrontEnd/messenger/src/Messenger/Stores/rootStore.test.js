
import {autorun} from "mobx";
import MessengerService from "../Sevices/MessengerService"
import UserStore from "./UserStore"
import RootStore from "./rootStore";


it("Testing RootwStore-", async () => {
    //let UsersJson;
   
    let rootStore = new RootStore(null, {
                    username:"Devano",
                    password:"11kingie"}
                    )
    await rootStore.startAsyncServices().then(()=>{
            console.log(rootStore.userStore.asJson());
        });

    
  
});

