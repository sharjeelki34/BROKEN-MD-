const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>BROKEN MD</title>
        <style>
          body {
            background: #111;
            color: white;
            font-family: Arial;
            text-align: center;
            padding-top: 100px;
          }
          h1 { font-size: 45px; }
          p { color: #aaa; }
        </style>
      </head>
      <body>
        <h1>⚡ BROKEN MD ⚡</h1>
        <p>WhatsApp Bot Panel</p>
        <p>Bot is running successfully.</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`BROKEN MD running on port ${PORT}`);
});
