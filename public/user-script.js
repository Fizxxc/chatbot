// Elements
const adminStatusEl = document.getElementById('adminStatus');
const chatMessagesEl = document.getElementById('chatMessages');
const userMessageInput = document.getElementById('userMessageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');

// Load Admin Status
const loadAdminStatus = async () => {
    const response = await fetch('/admin-status');
    const { online } = await response.json();
    adminStatusEl.textContent = online ? 'Online' : 'Offline';
    adminStatusEl.className = `status ${online ? 'online' : 'offline'}`;
};

// Load Messages
const loadMessages = async () => {
    const response = await fetch('/messages');
    const messages = await response.json();
    chatMessagesEl.innerHTML = messages
        .map(
            (msg) => `
            <p><strong>${msg.sender === 'user' ? 'You' : 'Admin Fizzx'}:</strong> ${msg.text}</p>
            `
        )
        .join('');
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
};

// Send Message
const sendMessage = async () => {
    const message = userMessageInput.value.trim();
    if (message) {
        await fetch('/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender: 'user', text: message }),
        });
        userMessageInput.value = '';
        loadMessages();
    }
};

// Event Listeners
sendMessageBtn.addEventListener('click', sendMessage);
userMessageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Auto-Refresh Admin Status and Messages
setInterval(loadAdminStatus, 3000);
setInterval(loadMessages, 1000);
