const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // <- FIX: Tambahkan ini
const app = express();

let messages = []; // Array untuk menyimpan pesan
let adminStatus = { online: false }; // Status admin (online/offline)

app.use(bodyParser.json());

// Melayani file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Get semua pesan
app.get('/messages', (req, res) => {
    res.json(messages);
});

// Post pesan baru
app.post('/messages', (req, res) => {
    const { sender, text } = req.body;
    const reply = adminStatus.online && sender === 'user' ? null : generateReply(text);
    const newMessage = { sender, text, reply };
    messages.push(newMessage);
    res.json(newMessage);
});

// Get status admin
app.get('/admin-status', (req, res) => {
    res.json(adminStatus);
});

// Set status admin
app.post('/admin-status', (req, res) => {
    const { online } = req.body;
    adminStatus.online = online;
    res.json(adminStatus);
});

// Handle favicon.ico request to prevent error spam
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Fungsi untuk balasan otomatis
function generateReply(userMessage) {
    if (userMessage.toLowerCase().includes('hello')) {
        return 'Hi there! How can I help you today?';
    } else if (userMessage.toLowerCase().includes('refund')) {
        return 'Sure, I can assist you with refunds. Can you share your order ID?';
    } else {
        return 'Thank you for your message. Let me forward it to our team.';
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
