// Elements
const adminStatusEl = document.getElementById('adminStatus');
const chatMessagesEl = document.getElementById('chatMessages');
const userMessageInput = document.getElementById('userMessageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const usernameInput = document.getElementById('usernameInput');

// Load Admin Status
const loadAdminStatus = async () => {
    const response = await fetch('/admin-status');
    const { online } = await response.json();
    adminStatusEl.textContent = online ? 'Online' : 'Offline';
    adminStatusEl.className = `status ${online ? 'online' : 'offline'}`;
};

// Load Messages for specific username
const loadMessages = async () => {
    const username = usernameInput.value.trim();
    if (!username) return; // Harus isi username dulu

    const response = await fetch(`/messages/${username}`);
    const messages = await response.json();

    chatMessagesEl.innerHTML = messages.map((msg) => {
        let html = `<p><strong>${msg.sender === 'user' ? 'You' : 'Admin Fizzx'}:</strong> ${msg.text}</p>`;
        if (msg.reply) {
            html += `<p><strong>Admin Fizzx:</strong> ${msg.reply}</p>`;
        }
        return html;
    }).join('');
    
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
};

// Send Message
const sendMessage = async () => {
    const username = usernameInput.value.trim();
    const message = userMessageInput.value.trim();

    if (!username || !message) {
        alert('Please enter your username and message.');
        return;
    }

    await fetch('/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, sender: 'user', text: message }),
    });

    userMessageInput.value = '';
    loadMessages();
};

// Event Listeners
sendMessageBtn.addEventListener('click', sendMessage);
userMessageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Auto-Refresh Admin Status and Messages
setInterval(loadAdminStatus, 3000);
setInterval(loadMessages, 1500);
