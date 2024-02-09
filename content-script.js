chrome.runtime.sendMessage('request');
let popup_template = `
    What would you like to generate?
    
    <input type="text" id="submission-text">`

let prev = " "

document.body.addEventListener("keyup", e=>{
    // if(e.target.value == undefined){
    //     prev = e.target.innerText.substr(-2)
    // }else{
    //     e.target.value.substring(e.target.selectionStart - 2 , e.target.selectionStart)
    // }
    if (e.key == "Escape"){
        console.log("remove");
        document.getElementsByClassName("popup")[0].remove()
    }else if(prev == "#" && e.key == "#" && document.getElementsByClassName("popup").length == 0){
        let pos = e.target.getBoundingClientRect();
        let popup = document.createElement('div');
        let button = document.createElement('button');
        button.innerText = "Submit";
        button.addEventListener("click", (e)=>{submit_request(e)})
        popup.innerHTML = popup_template;
        popup.appendChild(button)
        popup.classList.add('popup');
        popup.style.cssText = 'top:' + pos.y +'px;left:' + pos.x +'px;';
        document.body.appendChild(popup)
        console.log("pop")
        popup.childNodes[1].focus()
    }
    prev = e.key
})

async function submit_request(e){
    console.log(e.target.parentElement.childNodes[1].value)
    text = e.target.parentElement.childNodes[1].value
    //text =  document.getElementById("submission-text").value;
    console.log("query: ", text);
    response = await chrome.runtime.sendMessage({
        name: 'request',
        data: text,
    });
    console.log(response)
}

chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    console.log(message)
    let txt = document.createElement("textarea")
    txt.innerText = message.data
    document.getElementsByClassName("popup")[0].appendChild(txt);
    navigator.clipboard.writeText(txt.value);

})