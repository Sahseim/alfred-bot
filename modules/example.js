


module.exports = {
  commands: [
    {
      pattern: /say something/gi,
      func: (message, botUser) => {
        message.channel.sendMessage('I said something');
      }
    }
  ]
}
