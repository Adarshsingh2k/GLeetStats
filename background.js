import fetchGfg from "./api/fetchGfg.js";
import fetchLeet from "./api/fetchLeet.js";

const ALARM_NAME = 'FetchData'

chrome.runtime.onMessage.addListener(async data => {
    const { event, prefs } = data
    console.log('events-->', event)
    switch (event) {
        case 'leetCode':
            handleOnSubmit(prefs)
            break;
        case 'startAlarm':
            createAlarm();
            break;
        case 'stopAlarm':
            stopAlarm();
            break;
        default:
            break;
    }


})

const handleOnSubmit = (prefs) => {

    console.log("dataSent from USER hit bJs");
    console.log("prefs=>", prefs);
    chrome.storage.local.set(prefs);
    fetchLeet(prefs.leetUser);
    fetchGfg(prefs.gfgUser)
    // createAlarm()
    setRunningStatus(true);
    // setTimeout(() => {
    //     stopAlarm()
    //     console.log("stop alarm triggered")
    // }, 1000);

}


const setRunningStatus = (isRunning) => {
    chrome.storage.local.set({ isRunning })
}

const createAlarm = () => {
    chrome.alarms.get(ALARM_NAME, existing => {
        if (!existing) {
            chrome.alarms.create(ALARM_NAME, {
                delayInMinutes: 60.0,  // first trigger after 30 minutes
                periodInMinutes: 360.0
            })

        }
    })
}

const stopAlarm = () => {
    chrome.alarms.clearAll();
}

chrome.alarms.onAlarm.addListener(() => {
    console.log("onAlarm scheduled running")
    chrome.storage.local.get(['leetUser', 'gfgUser'], (data) => {
        const { leetUser, gfgUser } = data;

        // Check if the user data exists before fetching
        if (leetUser) {
            fetchLeet(leetUser);
        }
        if (gfgUser) {
            fetchGfg(gfgUser);
        }
    });
})


// chrome.storage.sync.clear();