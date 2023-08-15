


const leetId = document.querySelector('#leetId');
const submit = document.getElementById('submit');
const gfgId = document.getElementById('gfgId');
const formInp = document.querySelector('.inputCont');
const stats = document.querySelector('.stats')

const startButton = document.getElementById('startUpdate');
const stopButton = document.getElementById('stopUpdate');
const clearStorage = document.getElementById('clearStorage');

const upOn = document.querySelector('.autoOn')
const upOf = document.querySelector('.autoOf')


let isSubmitted = false;
let autOn = false;



document.addEventListener("DOMContentLoaded", () => {
    
    chrome.storage.local.get(['clearStorageDisabled', 'startButtonDisabled', 'stopButtonDisabled'], (data) => {
        clearStorage.disabled = data.clearStorageDisabled === undefined ? true : data.clearStorageDisabled;
        startButton.disabled = data.startButtonDisabled === undefined ? true : data.startButtonDisabled;
        stopButton.disabled = data.stopButtonDisabled === undefined ? true : data.stopButtonDisabled;
    });
});


chrome.storage.local.get(['filterLeetData', 'filtergfgData', 'isSubmitted'], (data) => {
    if (data.isSubmitted) {
        formInp.style.display = 'none'; // Hide the input form
        stats.style.display = 'block'
        displayLeet(data.filterLeetData);
        displayGfg(data.filtergfgData)
    }
});


submit.onclick = () => {
    const prefs = {
        leetUser: leetId.value,
        gfgUser: gfgId.value
    }
    formInp.style.display = 'none';

   
        
    stats.style.display = 'block'

    chrome.storage.local.set({ isSubmitted: true });


    chrome.runtime.sendMessage({ event: 'leetCode', prefs })

    clearStorage.disabled = false;
    startButton.disabled = false;
    stopButton.disabled = false;

    chrome.storage.local.set({
        clearStorageDisabled: false,
        startButtonDisabled: false,
        stopButtonDisabled: false
    });


}

chrome.runtime.onMessage.addListener((message) => {
    if (message.event === 'dataStored' || message.event === 'dataStoredGfg') {
        chrome.storage.local.get(['filterLeetData', 'filtergfgData'], (data) => {
            const { filterLeetData, filtergfgData } = data
            formInp.style.display = 'none';
            displayLeet(filterLeetData);
            displayGfg(filtergfgData)
        });
    }
});




// chrome.storage.local.get(["leetUser", "filterLeetData", "gfgUser", "filtergfgData"], data => {

//     const { leetUser, gfgUser, filterLeetData, filtergfgData } = data;


//     if (leetUser) {

//         leetId.value = leetUser
//         check = true;
//     }
//     if (gfgUser) {

//         gfgId.value = gfgUser
//         check = true;
//     }
//     if (filterLeetData) {
//         displayLeet(filterLeetData)
//     }
//     if (filtergfgData) {
//         displayGfg(filtergfgData)
//     }





// // ... other parts of your code ...




// })



startButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ event: 'startAlarm' });
    startButton.style.display = 'none';
    stopButton.style.display = 'block';
    upOn.style.display = 'block';
    upOf.style.display = 'none';


    console.log("Alarm started");
});

stopButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ event: 'stopAlarm' });
    startButton.style.display = 'block';
    stopButton.style.display = 'none';
    console.log("Alarm stopped");
    upOn.style.display = 'none';
    upOf.style.display = 'block';
});

const displayLeet = (data) => {
    const lDiv = document.getElementById("leetStats")
    lDiv.innerHTML = ''
    console.log("display leet", data)

    const properties = ['easy', 'medium', 'hard', 'total'];

    properties.forEach(prop => {
        let para = document.createElement("span");
        para.textContent = `${prop.charAt(0).toUpperCase() + prop.slice(1)}: ${data[prop]}`;
        para.classList.add("mr-3");
        para.classList.add("tag");

        lDiv.appendChild(para);
    });
}

const displayGfg = (data) => {
    const gDiv = document.getElementById("gfgStats")
    gDiv.innerHTML = ''
    console.log("display Gfg", data)


    const properties = ['easy', 'medium', 'hard', 'total', 'monthlyScore'];

    for (let i = 0; i < properties.length; i += 3) {
        let row = document.createElement('div');
        row.classList.add('row');

        for (let j = 0; j < 3 && (i + j) < properties.length; j++) {
            let prop = properties[i + j];
            let para = document.createElement("span");
            para.textContent = `${prop.charAt(0).toUpperCase() + prop.slice(1)}: ${data[prop]}`;
            para.classList.add("mr-3");
            para.classList.add("tag");
            row.appendChild(para);
        }

        gDiv.appendChild(row);
    }

}






document.getElementById('clearStorage').addEventListener('click', function () {
    check = false;
    chrome.storage.local.clear(() => {
        console.log('Storage cleared');
        alert('Storage cleared successfully!');
    });
    formInp.style.display = 'block'; // Hide the input form
    stats.style.display = 'none'

    clearStorage.disabled = true;
    startButton.disabled = true;
    stopButton.disabled = true;
    chrome.storage.local.set({
        clearStorageDisabled: true,
        startButtonDisabled: true,
        stopButtonDisabled: true
    });
});

