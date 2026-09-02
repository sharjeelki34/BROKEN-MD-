const express = require("express");
const pino = require("pino");
const fs = require("fs");
const path = require("path");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  delay
} = require("@whiskeysockets/baileys");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Owner Number Configuration
const OWNER_NUMBER = "923306437897";

// 1. Web UI - Pairing Page Link
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>⚡ BROKEN MD - Pairing Panel</title>
      <style>
        body { font-family: 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .card { background: #1e293b; padding: 30px; border-radius: 16px; text-align: center; width: 320px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        .logo { width: 100px; height: 100px; border-radius: 50%; margin-bottom: 12px; border: 3px solid #38bdf8; object-fit: cover; box-shadow: 0 0 15px rgba(56, 189, 248, 0.4); }
        h2 { color: #38bdf8; margin: 0 0 8px 0; font-size: 22px; font-weight: 700; }
        p { font-size: 13px; color: #94a3b8; margin-bottom: 18px; }
        input { width: 90%; padding: 12px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; text-align: center; font-size: 15px; outline: none; }
        input:focus { border-color: #38bdf8; }
        button { width: 98%; padding: 12px; border: none; border-radius: 8px; background: #22c55e; color: #fff; font-weight: bold; font-size: 15px; cursor: pointer; transition: 0.2s; }
        button:hover { background: #16a34a; }
        .code-box { margin-top: 20px; padding: 15px; background: #0f172a; border-radius: 8px; border: 1px dashed #38bdf8; font-size: 22px; font-weight: bold; color: #facc15; letter-spacing: 2px; }
        .footer { margin-top: 15px; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="card">
        <img src="https://i.imgur.com/1xAJKoA.jpeg" class="logo" alt="BROKEN MD Logo">
        <h2>⚡ BROKEN MD</h2>
        <p>Enter your number with country code</p>
        <form action="/pair" method="POST">
          <input type="text" name="number" placeholder="923xxxxxxxxx" required />
          <button type="submit">Get Pairing Code</button>
        </form>
        ${req.query.code ? `<div class="code-box">${req.query.code}</div>` : ''}
        ${req.query.error ? `<p style="color: #ef4444; margin-top: 15px; font-weight: bold;">${req.query.error}</p>` : ''}
        <div class="footer">Owner: +${OWNER_NUMBER}</div>
      </div>
    </body>
    </html>
  `);
});
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>⚡ BROKEN MD - Pairing Panel</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: #1e293b; padding: 30px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); text-align: center; width: 330px; border: 1px solid #334155; }
        h2 { color: #38bdf8; margin-bottom: 8px; font-size: 24px; }
        p { font-size: 13px; color: #94a3b8; margin-bottom: 20px; }
        input { width: 90%; padding: 12px; margin-bottom: 15px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 16px; text-align: center; outline: none; }
        input:focus { border-color: #38bdf8; }
        button { width: 98%; padding: 12px; border: none; border-radius: 6px; background: #22c55e; color: #fff; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        button:hover { background: #16a34a; }
        .code-box { margin-top: 20px; padding: 15px; background: #0f172a; border-radius: 6px; border: 1px dashed #38bdf8; font-size: 22px; font-weight: bold; color: #facc15; letter-spacing: 3px; word-break: break-all; }
        .footer { margin-top: 15px; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>⚡ BROKEN MD</h2>
        <p>Country code ke sath number likhein (e.g. 923306437897)</p>
        <form action="/pair" method="POST">
          <input type="text" name="number" placeholder="923xxxxxxxxx" required />
          <button type="submit">Get Pairing Code</button>
        </form>
        ${req.query.code ? `<div class="code-box">${req.query.code}</div>` : ''}
        ${req.query.error ? `<p style="color: #ef4444; margin-top: 15px; font-weight: bold;">${req.query.error}</p>` : ''}
        <div class="footer">Owner: +${OWNER_NUMBER}</div>
      </div>
    </body>
    </html>
  `);
});

// 2. API Endpoint - Generate Pairing Code
app.post("/pair", async (req, res) => {
  let num = req.body.number;
  if (!num) return res.redirect("/?error=Number is required");

  // Number Format Cleaning
  num = num.replace(/[^0-9]/g, "");

  // Create temporary session directory
  const tempSessionDir = path.join(__dirname, `./temp_sessions/session_${Date.now()}`);

  try {
    const { state, saveCreds } = await useMultiFileAuthState(tempSessionDir);
    const sock = makeWASocket({
      auth: state,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false
    });

    sock.ev.on("creds.update", saveCreds);

    await delay(3000); // Socket initialization delay

    if (!sock.authState.creds.registered) {
      const code = await sock.requestPairingCode(num);
      res.redirect(`/?code=${code}`);
    } else {
      res.redirect("/?error=Already Registered");
    }

    // Dynamic temp session cleanup after 2 minutes
    setTimeout(() => {
      try {
        sock.ws.close();
        fs.rmSync(tempSessionDir, { recursive: true, force: true });
      } catch (e) {}
    }, 120000);

  } catch (err) {
    console.log("Pairing Error:", err);
    res.redirect("/?error=Failed to generate code. Try again.");
  }
});

// 3. Main Bot Process
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ BROKEN MD connected successfully!");
    }

    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;

      if (code !== DisconnectReason.loggedOut) {
        console.log("🔄 Reconnecting...");
        startBot();
      } else {
        console.log("❌ WhatsApp session logged out.");
      }
    }
  });

  // Commands Handling
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
            `┃ ✅ Bot Status: Online\n` +
            `┃ 👑 Owner: +${OWNER_NUMBER}\n` +
            "┃ 🚀 System: Active\n" +
            "╰━━━━━━━━━━━━━━━━╯"
        });
      }

      if (command === ".owner") {
        await sock.sendMessage(jid, {
          text: `👑 *Bot Owner Contact:*\nhttps://wa.me/${OWNER_NUMBER}`
        });
      }

      if (command === ".menu") {
        await sock.sendMessage(jid, {
          text:
            "╭━━〔 ⚡ BROKEN MD 〕━━╮\n" +
            "┃\n" +
            "┃ 📌 .ping  - Speed test\n" +
            "┃ 📌 .alive - Check status\n" +
            "┃ 📌 .owner - Owner info\n" +
            "┃ 📌 .menu  - List commands\n" +
            "┃\n" +
            "╰━━━━━━━━━━━━━━━━╯"
        });
      }
    } catch (err) {
      console.log("Command error:", err);
    }
  });
}

// Web server start
app.listen(PORT, () => {
  console.log(`⚡ BROKEN MD Pairing Web Panel running on port ${PORT}`);
});

// Bot start
startBot();
