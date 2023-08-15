export default function fetchGfg(userName) {
    const gfgUrl = `https://gfgunofficial-api.onrender.com/${userName}`;

    fetch(gfgUrl)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            const gfgData = {
                easy: data.EASY,
                medium: data.MEDIUM,
                hard: data.HARD,
                total: data.total_problem_solved,
                monthlyScore: data.monthly_coding_score
            }
            console.log(gfgData)
            chrome.storage.local.set({ filtergfgData: gfgData }, () => {
                console.log('Data stored successfully');
            });
            chrome.runtime.sendMessage({ event: 'dataStoredGfg' });


        })
        .catch(error => {
            console.log(error)
        })



}
