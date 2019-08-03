import { observable, computed, action, configure} from "mobx";

configure({ enforceActions: 'observed' })
//IMPORTS
//Model The Users Contacts And Potential Contacts
const viableStates = [
    "ACTIVEUSERCONTACT",
    "INACTIVEUSERCONTACT",
    "SEARCHUSER",
]
/**
 * This Class Acts As A Store For SideBar UI state 
 */
export default class UIUserStore {
    activeElement= "ACTIVEUSERCONTACT";
    @observable isActive = true;
    store = null
    /**
     * 
     * @param {*} store -The Root Store Of The UI-also allow certain depeencies to be injected
     */
    constructor(store=null){
        this.store = store;
    }

    @computed
    get getIsActive(){
        return this.isActive;
    }

    @action
    toggleSideBarActive(){
        this.isActive = !this.isActive;
    }

    @action
    setActiveElement(stateString){
        if (this.viableStates.includes(stateString)){
            this.activeElement = stateString;
        }
        else {
            console.log("Not A Viable State");
            throw new Error("State Change Not Valid");
        }
    }
    


}