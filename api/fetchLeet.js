export default function fetchLeet(userName) {
    const leetUrl = `https://easy-plum-dibbler-hem.cyclic.app/${userName}`;

    fetch(leetUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const leetData = {
                easy: data.easySolved,
                medium: data.mediumSolved,
                hard: data.hardSolved,
                total: data.totalSolved
            }
            console.log(leetData)
            chrome.storage.local.set({ filterLeetData: leetData }, () => {
                console.log('Data stored successfully');
            });
            chrome.runtime.sendMessage({ event: 'dataStored' });




        })
        .catch(error => {
            console.log(error)
        })



}
