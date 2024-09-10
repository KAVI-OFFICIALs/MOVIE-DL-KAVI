const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { handleMovieCommand } = require('./commands/movieCommand');

const SESSION_FILE_PATH = './session.json'; // File path to store session data
let sessionData;

if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH); // Load existing session data
}

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'client-one', // Store session ID
    }),
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true }); // Display QR code in terminal
});

client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session)); // Save session data to file
});

client.on('auth_failure', () => {
    console.error('Authentication failed, please try again.');
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg) => {
    if (msg.body.startsWith('.movie')) {
        // React with emoji for starting
        await msg.react('🔄');
        await handleMovieCommand(client, msg); // Handle movie command
    }
});

client.on('message_create', async (msg) => {
    // Emojis based on the stages of downloading
    if (msg.body.includes('Starting')) {
        await msg.react('🚀');
    } else if (msg.body.includes('Downloading')) {
        await msg.react('📥');
    } else if (msg.body.includes('Uploading')) {
        await msg.react('📤');
    } else if (msg.body.includes('Success')) {
        await msg.react('✅');
    }
});

client.initialize();
