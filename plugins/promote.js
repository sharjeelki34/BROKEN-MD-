module.exports = {
    command: 'promote',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        if (!from.endsWith('@g.us')) return await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' }, { quoted: msg });

        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentioned.length === 0) return await sock.sendMessage(from, { text: '❌ Please tag the user you want to promote!\nExample: *.promote @user*' }, { quoted: msg });

        try {
            await sock.groupParticipantsUpdate(from, [mentioned[0]], 'promote');
            await sock.sendMessage(from, { text: `✅ User promoted to Admin successfully!` }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(from, { text: '❌ Bot needs Admin privileges to perform this action.' }, { quoted: msg });
        }
    }
};
