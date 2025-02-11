WAPI.waitNewMessages(false, (data) => {
    console.log(data)
    data.forEach((message) => {
        //fetch API to send and receive response from server
        body = {};
        body.text = message.body;
        body.type = 'message';
        body.user = message.from._serialized;
        //body.original = message;
        fetch(intents.appconfig.webhook, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => resp.json()).then(function (response) {
            //response received from server
            console.log(response);
            WAPI.sendSeen(message.from._serialized);
            //replying to the user based on response
            WAPI.sendMessage2(message.from._serialized, response[0].text);
            //sending files if there is any 
            if(response.files){
                if (response.files.length > 0) {
                    response.files.forEach((file) => {
                        WAPI.sendImage(file.file, response.From, file.name);
                    })
                }
            }
        }).catch(function (error) {
            console.log(error);
        });
    });
});
WAPI.addOptions = function () {
    var suggestions = "";
    intents.smartreply.suggestions.map((item) => {
        suggestions += `<button style="background-color: #eeeeee;
                                margin: 5px;
                                padding: 5px 10px;
                                font-size: inherit;
                                border-radius: 50px;" class="reply-options">${item}</button>`;
    });
    var div = document.createElement("DIV");
    div.style.height = "40px";
    div.style.textAlign = "center";
    div.style.zIndex = "5";
    div.innerHTML = suggestions;
    div.classList.add("grGJn");
    var mainDiv = document.querySelector("#main");
    var footer = document.querySelector("footer");
    footer.insertBefore(div, footer.firstChild);
    var suggestions = document.body.querySelectorAll(".reply-options");
    for (let i = 0; i < suggestions.length; i++) {
        const suggestion = suggestions[i];
        suggestion.addEventListener("click", (event) => {
            console.log(event.target.textContent);
            window.sendMessage(event.target.textContent).then(text => console.log(text));
        });
    }
    mainDiv.children[mainDiv.children.length - 5].querySelector("div > div div[tabindex]").scrollTop += 100;
}