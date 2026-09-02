module.exports = {
    command: 'tagall',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        if (!from.endsWith('@g.us')) return await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' }, { quoted: msg });

        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants;

        let text = `📢 *Attention Everyone in ${groupMetadata.subject}*\n\n`;
        let mentions = [];

        for (let mem of participants) {
            text += `👉 @${mem.id.split('@')[0]}\n`;
            mentions.push(mem.id);
        }

        await sock.sendMessage(from, { text: text, mentions: mentions }, { quoted: msg });
    }
};
