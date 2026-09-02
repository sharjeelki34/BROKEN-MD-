const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'pair',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        let phoneNumber = args[0] ? args[0].replace(/[^0-9]/g, '') : '';

        if (!phoneNumber) {
            return await sock.sendMessage(from, {
                text: '✦ ꜱᴀᴊɪ̄ɪ̄ x ꜰᴀᴛɪ̄ɪ̄ ᴘᴀɪʀɪɴɢ ✦\n\n> ⚠️ *Please provide a valid phone number!*\n\n> 💡 *Example:* `.pair 923306437897`'
            }, { quoted: msg });
        }

        await sock.sendMessage(from, {
            text: `⌛ ɢᴇɴᴇʀᴀᴛɪɴɢ ᴘᴀɪʀɪɴɢ ᴄᴏᴅᴇ...\n\n📱 *Number:* ${phoneNumber}\n✨ *ꜱᴀᴊɪ̄ɪ̄ x ꜰᴀᴛɪ̄ɪ̄ Network Processing...*`
        }, { quoted: msg });

        const sessionFolder = path.join(__dirname, `../temp_session_${Date.now()}`);

        try {
            const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);

            const pairSock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }))
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }),
                browser: Browsers.ubuntu('Chrome')
            });

            pairSock.ev.on('creds.update', saveCreds);

            pairSock.ev.on('connection.update', async (update) => {
                const { connection } = update;
                if (connection === 'open') {
                    await delay(3000);
                    
                    const credsFilePath = path.join(sessionFolder, 'creds.json');
                    if (fs.existsSync(credsFilePath)) {
                        const credsData = fs.readFileSync(credsFilePath);
                        const base64Session = Buffer.from(credsData).toString('base64');
                        const sessionId = `BROKEN-MD~${base64Session}`;

                        await sock.sendMessage(from, {
                            text: `✦ ꜱᴀᴊɪ̄ɪ̄ x ꜰᴀᴛɪ̄ɪ̄ ꜱᴇꜱꜱɪᴏɴ ɪᴅ ✦\n\n🔑 *Session ID Created Successfully!*\n\n\`\`\`${sessionId}\`\`\`\n\n> ⚠️ *Keep this ID secret! Do not share it with anyone.*`
                        }, { quoted: msg });
                    }

                    await pairSock.logout();
                    if (fs.existsSync(sessionFolder)) {
                        fs.rmSync(sessionFolder, { recursive: true, force: true });
                    }
                }
            });

            await delay(3000);
            let code = await pairSock.requestPairingCode(phoneNumber);
            code = code?.match(/.{1,4}/g)?.join('-') || code;

            await sock.sendMessage(from, {
                text: `✦───────────────✦\n   ▶  ❚❚  🔊  02:45  ⟳\n✦───────────────✦\n\n📟 *Pairing Code:* *${code}*\n\n> 📲 Open WhatsApp > Linked Devices > Link with Phone Number and enter this code.`
            }, { quoted: msg });

        } catch (error) {
            console.error('Pairing Plugin Error:', error);
            if (fs.existsSync(sessionFolder)) {
                fs.rmSync(sessionFolder, { recursive: true, force: true });
            }
            await sock.sendMessage(from, {
                text: '❌ ᴘᴀɪʀɪɴɢ ꜰᴀɪʟᴇᴅ!\n\n> Failed to generate pairing code. Please make sure the number includes country code.'
            }, { quoted: msg });
        }
    }
};
