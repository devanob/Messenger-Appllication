import { observable, computed, action, configure, decorate} from "mobx";

configure({ enforceActions: 'observed' })
//IMPORTS
//Model The Users Contacts And Potential Contacts

/**
 * This Class Acts As A Store For SideBar UI state
 */

//UI Store Storeses Various States Of THe UI From Side Bar To Main Content
class UIUserStore {
    viableStates = [
        "ACTIVECONTACTS",
        "PENDNGCONTACT",
        "SEARCHUSER",
    ]
    activeElement= "ACTIVECONTACTS";
    isActive = true;
    store = null
    /**
     *
     * @param {*} store -The Root Store Of The UI-also allow certain depeencies to be injected
     */
    searchString = "";
    constructor(store=null){
        this.store = store;
    }
    get getActiveElement(){
        return this.activeElement;
    }
    get getIsActive(){
        return this.isActive;
    }
    get getSearchString(){
        return this.searchString;
    }
    setsearchString(txt){
        
        this.searchString = txt;
    }

    toggleSideBarActive(){
        this.isActive = !this.isActive;
    }


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

decorate(UIUserStore,
    {
    activeElement: observable,
    isActive: observable,
    getActiveElement: computed,
    getIsActive : computed,
    toggleSideBarActive: action,
    setActiveElement: action,
    searchString: observable,
    getSearchString : computed,
    setsearchString : action 
    }
)

export default  UIUserStore;