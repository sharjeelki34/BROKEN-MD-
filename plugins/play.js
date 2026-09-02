module.exports = {
    command: 'play',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const query = args.join(' ');
        if (!query) return await sock.sendMessage(from, { text: '❌ Please give a song name!\nExample: *.play Alone Alan Walker*' }, { quoted: msg });

        await sock.sendMessage(from, { text: `🎵 *Searching and downloading:* "${query}"...\n\nPlease wait a moment.` }, { quoted: msg });
    }
};
