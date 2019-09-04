import { observable, computed, action, configure, decorate} from "mobx";

configure({ enforceActions: 'observed' })
//IMPORTS
//Model The Users Contacts And Potential Contacts

/**
 * This Class Acts As A Store For SideBar UI state
 */

//UI Store Storeses Various States Of THe UI From Side Bar To Main Content
class UIUserStore {
    viableStates =
    [
        {"ACTIVECONTACTS": 1 ,
            
                "uiName":"Active Contacts","stateName": "ACTIVECONTACTS"
            
        },
        {"PENDINGCONTACTS": 2,
            
                "uiName":"Pending Contacts","stateName": "PENDINGCONTACTS"
            
        },
        {"SEARCHPENDING": 3,
            
                "uiName":"Search Contacts","stateName": "SEARCHPENDING"
            
        },
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

    get getViableStates(){
        return this.viableStates;
    }
    setActiveElement(state){
        if (state != null ){
            if (state === this.activeElement){
                this.searchString = "";
            }
            this.viableStates.forEach(element => {
                if (state in element){
                    if (state !== this.activeElement){
                        this.searchString = "";
                    }
                    this.activeElement = state;
                    

                }
            })
        }
        else{
            console.log("Null Given For State: Error");
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
    setsearchString : action,
    }
)

export default  UIUserStore;