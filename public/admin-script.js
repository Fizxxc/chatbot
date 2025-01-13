// Elements
const onlineBtn = document.getElementById('onlineBtn');
const offlineBtn = document.getElementById('offlineBtn');
const adminStatusEl = document.getElementById('adminStatus');
const adminChatMessages = document.getElementById('adminChatMessages');
const adminReplyInput = document.getElementById('adminReplyInput');
const sendReplyBtn = document.getElementById('sendReplyBtn');

// Set Admin Status
const setAdminStatus = async (isOnline) => {
    await fetch('/admin-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ online: isOnline }),
    });
    updateStatusUI(isOnline);
};

// Update Status UI
const updateStatusUI = (isOnline) => {
    adminStatusEl.textContent = isOnline ? 'Online' : 'Offline';
    adminStatusEl.className = `status ${isOnline ? 'online' : 'offline'}`;
    onlineBtn.disabled = isOnline;
    offlineBtn.disabled = !isOnline;
    adminReplyInput.disabled = !isOnline;
    sendReplyBtn.disabled = !isOnline;
};

// Load Messages
const loadMessages = async () => {
    const response = await fetch('/messages');
    const messages = await response.json();
    adminChatMessages.innerHTML = messages
        .map(
            (msg) => `
            <p><strong>${msg.sender === 'user' ? 'User' : 'Admin Fizzx'}:</strong> ${msg.text}</p>
            ${msg.reply ? `<p><strong>Admin Reply:</strong> ${msg.reply}</p>` : ''}
        `
        )
        .join('');
    adminChatMessages.scrollTop = adminChatMessages.scrollHeight;
};

// Send Reply
const sendReply = async () => {
    const replyText = adminReplyInput.value.trim();
    if (replyText) {
        await fetch('/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender: 'admin', text: replyText }),
        });
        adminReplyInput.value = '';
        loadMessages();
    }
};

// Event Listeners
onlineBtn.addEventListener('click', () => setAdminStatus(true));
offlineBtn.addEventListener('click', () => setAdminStatus(false));
sendReplyBtn.addEventListener('click', sendReply);

// Auto-Refresh Messages
setInterval(loadMessages, 1000);
