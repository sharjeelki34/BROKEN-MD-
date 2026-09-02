module.exports = {
  name: "ping",
  async run(sock, jid) {
    await sock.sendMessage(jid, {
      text: "🏓 Pong!\n⚡ BROKEN MD"
    });
  }
};
