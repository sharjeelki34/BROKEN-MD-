const express = require("express");
const pino = require("pino");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("⚡ BROKEN MD is running!");
});

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ BROKEN MD connected!");
    }

    if (connection === "close") {
      const code =
        lastDisconnect?.error?.output?.statusCode;

      if (code !== DisconnectReason.loggedOut) {
        console.log("🔄 Reconnecting...");
        startBot();
      } else {
        console.log("❌ WhatsApp session logged out.");
      }
    }
  });

  // Pairing code
  if (!state.creds.registered) {
    const number = process.env.BOT_NUMBER;

    if (!number) {
      console.log(
        "⚠️ BOT_NUMBER environment variable set karo."
      );
      return;
    }

    const pairingCode =
      await sock.requestPairingCode(number);

    console.log("================================");
    console.log("🔐 PAIRING CODE:", pairingCode);
    console.log("================================");
  }

  // Commands
  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages[0];

      if (!msg.message || msg.key.fromMe) return;

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        "";

      const command = text.trim().toLowerCase();
      const jid = msg.key.remoteJid;

      if (command === ".ping") {
        await sock.sendMessage(jid, {
          text: "🏓 Pong!\n⚡ BROKEN MD is alive."
        });
      }

      if (command === ".alive") {
        await sock.sendMessage(jid, {
          text:
            "╭━━〔 ⚡ BROKEN MD 〕━━╮\n" +
            "┃ ✅ Bot Online\n" +
            "┃ 🚀 System Active\n" +
            "╰━━━━━━━━━━━━━━━━╯"
        });
      }

      if (command === ".menu") {
        await sock.sendMessage(jid, {
          text:
            "╭━━〔 ⚡ BROKEN MD 〕━━╮\n" +
            "┃\n" +
            "┃ .ping\n" +
            "┃ .alive\n" +
            "┃ .menu\n" +
            "┃\n" +
            "╰━━━━━━━━━━━━━━━━╯"
        });
      }
    } catch (err) {
      console.log("Command error:", err);
    }
  });
}

startBot();
