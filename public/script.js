const app = document.querySelector('.chat-app');
const socket = io();
let username;
app.querySelector('.button').addEventListener('click',() => {
    let uname = app.querySelector('.username').value;
    if(uname.length == 0) return;
    socket.emit('newuser',uname);
    username = uname;
    app.querySelector('.enter-screen').classList.remove('active');
    app.querySelector('.chat-screen').classList.add('active');
})

app.querySelector('.send-button').addEventListener('click',() => {
    let message = app.querySelector('.message-box').value;
    if(message.length == 0) return;
    renderMessage('my', {
        us_name: username,
        text:message
    })
    socket.emit('chat',{
        us_name: username,
        text: message
    })
    app.querySelector('.message-box').value = "";
})

app.querySelector('#exit-chat').addEventListener('click',() => {
    socket.emit('exituser',username);
    window.location.reload();
})

socket.on('update',(update) => {
    renderMessage('update',update);
})

socket.on('chat',(message) => {
    renderMessage('other',message);
})

function renderMessage(type,message) {
    let messageContainer = app.querySelector('.chat-area');
    if(type == "my") {
        let el = document.createElement('div');
        el.setAttribute("class","my-message-area");
        el.innerHTML = `
        <div class="my-message-box">
                        <div class="my-username">
                        <span>You</span></div>
                        <span class="text-message">${message.text}</span>
                    </div>
        `;
        messageContainer.appendChild(el);
    } else if(type == "other") {
        let el = document.createElement('div');
        el.setAttribute("class","other-message-area");
        el.innerHTML = `
        <div class="other-message-box">
        <div class="other-username">
        <span>${message.us_name}</span></div>
        <span class="text-message">${message.text}</span>
        </div>
        `;
        messageContainer.appendChild(el);
    } else if(type == "update") {
        let el = document.createElement('div');
        el.setAttribute("class","message");
        el.innerHTML = `
        <div>
            <span>${message}</span>
        </div>
        `;
        messageContainer.appendChild(el);
    }
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
