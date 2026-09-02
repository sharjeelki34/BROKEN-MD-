module.exports = {
    command: 'video',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const query = args.join(' ');
        if (!query) return await sock.sendMessage(from, { text: '❌ Please give a video name!\nExample: *.video BROKEN MD trailer*' }, { quoted: msg });

        await sock.sendMessage(from, { text: `🎬 *Fetching video:* "${query}"...\n\nPlease wait a moment.` }, { quoted: msg });
    }
};
