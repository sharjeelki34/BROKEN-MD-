module.exports = {
  name: "menu",

  async run(sock, jid) {
    const menu = `
╭━━〔 ⚡ BROKEN MD ⚡ 〕━━╮
┃
┃  🤖 BOT COMMANDS
┃
┃  🏓 .ping
┃  💚 .alive
┃  📜 .menu
┃
╰━━━━━━━━━━━━━━━━━━━━╯
`;

    await sock.sendMessage(jid, {
      text: menu
    });
  }
};
