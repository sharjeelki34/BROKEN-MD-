module.exports = {
    command: 'antilink',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        
        if (text.includes('chat.whatsapp.com/')) {
            await sock.sendMessage(from, { delete: msg.key });
            await sock.sendMessage(from, { text: '⚠️ *Links are not allowed in this group!*' });
        }
    }
};
