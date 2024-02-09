function reddenPage() {
    document.body.style.backgroundColor = 'red';
  }
  
function create_popup(){
    document.body.addEventListener("keyup", e=>{
        let prev = e.target.value.substring(e.target.selectionStart - 2 , e.target.selectionStart)
        if(prev == "##"){
            alert("Test")
        }   
    })
}

chrome.action.onClicked.addListener((tab) => {
if (!tab.url.includes('chrome://')) {
    chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: create_popup
    });
}
});

chrome.runtime.onMessage.addListener((msg)=>{
    if(msg.name == 'request'){
        console.log(msg.data)
        console.log("back")
        let response;
        // fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + msg.data)
        // .then(r => r.text())
        // .then(result => {
        //     response = JSON.parse(result)[0].meanings[0].definitions[0].definition
        //     console.log(response)

        //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        //         chrome.tabs.sendMessage(tabs[0].id, {data: response}, function(response) {});  
        //     });
        // })

        fetch('https://tinyllama-3-1.cnvrg.stjude.org/api/v1/endpoints/wnfmkkbytjsex6fibuxy', {
            method: 'POST',
            headers: {
                'Cnvrg-Api-Key': 'sctTYN4NQuuWo1i5YJuGJx6q',
                'Content-Type': 'application/json'
            },
            // body: '{"input_params": "your_input_params"}',
            body: JSON.stringify({
                'input_params': msg.data
            })
        }).then(r => r.text()).then(result => {
            let response = JSON.parse(result).prediction
            response = response.replace(/.*\n.*\n.*\n.*\n.*\<\|assistant\|\>/gm, "")
            console.log(response)

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {data: response}, function(response) {});  
            });
        })
        return response
    }
})