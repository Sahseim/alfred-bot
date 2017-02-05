"use strict";

const path = require('path');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

const settings = require('./config/settings.json');

const modules = {};

const normalizedPath = path.join(__dirname, "modules");

fs.readdirSync(normalizedPath).forEach(file => {
  const module = require('./modules/' + file);
  modules[file] = module;
});


client.on('ready', () => {
  console.log('Alfred is ready');
});

client.on('message', message => {
  const { mentions } = message;
  if (mentions && mentions.users && mentions.users.some(user => user.id === client.user.id)) {
    Object.keys(modules).forEach(key => {
      const module = modules[key];
      const { commands } = module;
      commands.forEach(command => {
        const matches = message.content.match(command.pattern);
        if (matches) command.func(message, client, matches);
      });
    });
  }
});

client.login(settings.token);
