const D = x => new Decimal(x)
//create all the variables in a data object for saving
function getDefaultObject() {
    return {
        buyAmounts: [1,1,1],
        //Elements
        elements: [{amt:D(10),name:"Hydrogen",level:D(0),max:D(0)},{amt:D(0),name:"Carbon",level:D(0),max:D(0)},{amt:D(0),name:"Oxygen",
        level:D(0),max:D(0)},{amt:D(0),name:"Fluorine",level:D(0),max:D(0)},{amt:D(0),name:"Sulfur",level:D(0),max:D(0)},{amt:D(0),name:"Chlorine",
        level:D(0),max:D(0)},{amt:D(0),name:"Iron",level:D(0),max:D(0)},{amt:D(0),name:"Lead",level:D(0),max:D(0)}],
        elementGain: [D(0),D(0),D(0),D(0),D(0),D(0),D(0),D(0)],
        isotopes: [{amt:D(0),name:"H-3",level:D(0),max:D(0)},{amt:D(0),name:"C-14",level:D(0),max:D(0)},{amt:D(0),name:"O-15",
        level:D(0),max:D(0)},{amt:D(0),name:"F-18",level:D(0),max:D(0)},{amt:D(0),name:"S-35",level:D(0),max:D(0)},{amt:D(0),name:"Cl-37",
        level:D(0),max:D(0)},{amt:D(0),name:"Fe-60",level:D(0),max:D(0)},{amt:D(0),name:"Pb-212",level:D(0),max:D(0)}],
        isotopeGain: [D(0),D(0),D(0),D(0),D(0),D(0),D(0),D(0)],
        compounds: [{amt:D(0),name:"Propane",cost:"C<sub>3</sub>H<sub>8</sub>"},{amt:D(0),name:"Water",cost:"H<sub>2</sub>0"},
        {amt:D(0),name:"Sulfuric Acid",cost:"H<sub>2</sub>SO<sub>4</sub>"},{amt:D(0),name:"Steel",cost:"FeC"},
        {amt:D(0),name:"Chlorine Trifluoride",cost:"ClF<sub>3</sub>"}],
        power: D(0),
        powerUps: [D(0),D(0),D(0)],
        corium: D(0),
        coriumMax: D(0),
        coriumMultUps: [D(0),D(0),D(0)],
        coriumSingUps: [false,false,false],
        refineryCurrencies: [D(0), D(0), D(0)],
        particles: [D(0),D(0),D(0)],
        achievements: [{name:"H",unlocked:[false,false,false,false,false,false,false,false]},{name:"C",unlocked:[false,false,false,false,false,false,false,false]},{name:"O",unlocked:[false,false,false,false,false,false,false,false]},
        {name:"F",unlocked:[false,false,false,false,false,false,false,false]},{name:"S",unlocked:[false,false,false,false,false,false,false,false]},{name:"Cl",unlocked:[false,false,false,false,false,false,false,false]},
        {name:"Fe",unlocked:[false,false,false,false,false,false,false,false]},{name:"Pb",unlocked:[false,false,false,false,false,false,false,false]},
        {name:"Pr",unlocked:[false,false,false,false]},{name:"Wt",unlocked:[false,false,false,false]},{name:"Sa",unlocked:[false,false,false,false]},{name:"Sl",unlocked:[false,false,false,false]},{name:"Cf",unlocked:[false,false,false,false]},
        {name:"Pw",unlocked:[false,false,false,false]},{name:"Co",unlocked:[false,false,false,false]}],
        hasTab: [false, false, false, false, false],
        time: Date.now(),
        currentTab: 1,
        currentSubTab: [0,0],
        currentElement: 0,
        settingsToggles: [true,true],
        currentUpdate: 'v0.3.3',
        devSpeed: 1,
    }
}
let data = getDefaultObject()
//saving and loading
function save(){
    window.localStorage.setItem('chemJSSave', JSON.stringify(data))
}
function load() {
    let savedata = JSON.parse(window.localStorage.getItem('chemJSSave'))
    if (savedata !== undefined) fixSave(data, savedata)
    if(data.currentUpdate === 'v0.1.0' || data.currentUpdate === 'v0.1.1' || data.currentUpdate === 'v0.1.2' || data.currentUpdate === 'v0.1.3' || data.currentUpdate === 'v0.1.4') {
        alert(`Welcome Back! The Current Version is v0.3.3, If you are seeing this message this update reset all saves older than Beta 2.0 due to major changes that affect all gameplay.`)
        data.currentUpdate = 'v0.3.3'
        //Reset only for Beta delete next update
        noConfirmDelete()
    }
    else if(data.currentUpdate !== 'v0.3.3') {
        alert(`Welcome Back! The current version is v0.3.3. Some recent changes were accidentally merged but you won't be able to access them yet`)
        data.currentUpdate = 'v0.3.3' 
    }
    //fixOldSaves()
}
//fix saves
function fixSave(main=getDefaultObject(), data) {
    if (typeof data === "object") {
        Object.keys(data).forEach(i => {
            if (main[i] instanceof Decimal) {
                main[i] = D(data[i]!==null?data[i]:main[i])
            } else if (typeof main[i]  == "object") {
                fixSave(main[i], data[i])
            } else {
                main[i] = data[i]
            }
        })
        return main
    }
    else return getDefaultObject()
}
function fixOldSaves(){
    //fix important things from old versions
    if (data.currentUpdate!=='v0.2.0') data.currentUpdate='v0.1.1'
    if (data.currentUpdate==='v0.0.0'){
        //deleteSave()
    }
}
function exportSave(){
    save()
    let exportedData = btoa(JSON.stringify(data));
    const exportedDataText = document.createElement("textarea");
    exportedDataText.value = exportedData;
    document.body.appendChild(exportedDataText);
    exportedDataText.select();
    exportedDataText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(exportedDataText);
}
function importSave(){
    let importedData = prompt("Paste your save data here!")
    data = Object.assign(getDefaultObject(), JSON.parse(atob(importedData)))
    save()
    location.reload()
}
window.setInterval(function(){
    save()
}, 10000);
window.onload = function (){
    load()
    generateEventHandlers()
    console.log("EventListeners Initialized.")
}
//full reset
function fullReset(){
    exportSave()
    window.localStorage.removeItem('chemJSSave')
    location.reload()
}
function deleteSave(){
    if(confirm("Are you sure you want to delete your save? (This doesn't export)")) {
        window.localStorage.removeItem('chemJSSave')
        location.reload()
    } 
}

function noConfirmDelete(){
    window.localStorage.removeItem('chemJSSave')
    location.reload()
}

