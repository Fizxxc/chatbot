const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Objek untuk menyimpan pesan per username
let messages = {}; // { username: [ {sender, text, reply} ] }

let adminStatus = { online: false }; // Status admin (online/offline)

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ambil semua pesan milik user tertentu
app.get('/messages/:username', (req, res) => {
    const { username } = req.params;
    res.json(messages[username] || []);
});

// Kirim pesan
app.post('/messages', (req, res) => {
    const { username, sender, text } = req.body;

    // Jika belum ada array untuk user ini, buatkan
    if (!messages[username]) messages[username] = [];

    const reply = adminStatus.online && sender === 'user' ? null : generateReply(text);

    const newMessage = { sender, text, reply };
    messages[username].push(newMessage);

    res.json(newMessage);
});

// Ambil status admin
app.get('/admin-status', (req, res) => {
    res.json(adminStatus);
});

// Set status admin
app.post('/admin-status', (req, res) => {
    const { online } = req.body;
    adminStatus.online = online;
    res.json(adminStatus);
});

// Hindari spam error favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Fungsi balasan otomatis
function generateReply(userMessage) {
    const msg = userMessage.toLowerCase();
    if (msg.includes('hello')) {
        return 'Hi there! How can I help you today?';
    } else if (msg.includes('refund')) {
        return 'Sure, I can assist you with refunds. Can you share your order ID?';
    } else {
        return 'Thank you for your message. Let me forward it to our team.';
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
