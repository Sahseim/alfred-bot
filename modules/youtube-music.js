const ytdl = require('ytdl-core');

let streamDispatcher = null;
let voiceConnection = null;

module.exports = {
  commands: [
    {
      pattern: /play ((http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+))?/gi,
      func: (message, client, matches) => {
        const { member } = message;
        if (member) {
          const { voiceChannel } = member;
          voiceChannel.join().then(connection => {
            voiceConnection = connection;
            const streamOptions = { seek: 0, volume: 1};
            const stream = ytdl(matches[0], {filter: 'audioonly'});
            streamDispatcher = connection.playStream(stream, streamOptions);
            const info = ytdl.getInfo(matches[0], (err, info) => {
              if (err) console.error(err);
              client.user.setGame(info.title);
            })
          }).catch(console.error);
        }
      }
    },
    {
      pattern: /stop/gi,
      func: (message, client) => {
        if (streamDispatcher) {
          streamDispatcher.end();
          streamDispatcher = null;
          voiceConnection.disconnect();
          voiceConnection = null;
          client.user.setGame(null);
        }
      }
    },
    {
      pattern: /pause/gi,
      func: () => {
        if (streamDispatcher) streamDispatcher.pause();
      }
    },
    {
      pattern: /resume/gi,
      func: () => {
        if (streamDispatcher) streamDispatcher.resume();
      }
    }
  ]
}
