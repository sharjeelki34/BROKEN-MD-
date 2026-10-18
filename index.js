const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Pairing code API endpoint
app.get('/pair', async (req, res) => {
    let phone = req.query.number;
    if (!phone) return res.status(400).send({ error: "Phone number is required" });

    // Non-digits ko saf karna
    phone = phone.replace(/[^0-9]/g, '');

    try {
        // Agar aap Baileys use kar rahe hain:
        if (!sock.authState.creds.registered) {
            let code = await sock.requestPairingCode(phone);
            code = code?.match(/.{1,4}/g)?.join("-") || code;
            return res.send({ code: code });
        } else {
            return res.send({ error: "Device is already registered/linked!" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Failed to generate pairing code" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
er" placeholder="e.g. 923306437897" required />
          </div>
          <button type="submit">
            <i class="fa-solid fa-code"></i> Generate Code
          </button>
        </form>

        ${req.query.code ? `
          <div class="code-container">
            <div class="code-title">Your Pairing Code</div>
            <div class="code-value">${req.query.code}</div>
          </div>
        ` : ''}

        ${req.query.error ? `
          <div class="error-msg">${req.query.error}</div>
        ` : ''}

        <div class="footer">
          Powered by BROKEN MD &bull; Bot-Hosting
        </div>
      </div>
    </body>
    </html>
    `);
});

// Dynamic Pairing Code Backend
app.post('/pair', async (req, res) => {
    let num = req.body.number;
    if (!num) return res.redirect('/?error=Phone number is required');

    num = num.replace(/[^0-9]/g, '');
    const sessionDir = path.join(__dirname, 'session');

    try {
        if (fs.existsSync(sessionDir)) {
            fs.rmSync(sessionDir, { recursive: true, force: true });
        }

        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        const sock = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }))
            },
            printQRInTerminal: false,
            logger: pino({ level: 'fatal' }),
            browser: Browsers.ubuntu('Chrome')
        });

        sock.ev.on('creds.update', saveCreds);

        await delay(3000);
        let code = await sock.requestPairingCode(num);
        code = code?.match(/.{1,4}/g)?.join('-') || code;

        return res.redirect(`/?code=${code}`);
    } catch (err) {
        console.error('Pairing Error:', err);
        return res.redirect('/?error=Failed to fetch pairing code. Please try again.');
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`⚡ BROKEN MD Web Panel running on port ${PORT}`);
});        input { width: 90%; padding: 12px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; text-align: center; font-size: 15px; outline: none; }
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
