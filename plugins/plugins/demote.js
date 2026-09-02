module.exports = {
    command: 'demote',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        if (!from.endsWith('@g.us')) return await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' }, { quoted: msg });

        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentioned.length === 0) return await sock.sendMessage(from, { text: '❌ Please tag the user you want to demote!\nExample: *.demote @user*' }, { quoted: msg });

        try {
            await sock.groupParticipantsUpdate(from, [mentioned[0]], 'demote');
            await sock.sendMessage(from, { text: `✅ User demoted to normal member successfully!` }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(from, { text: '❌ Bot needs Admin privileges to perform this action.' }, { quoted: msg });
        }
    }
};
