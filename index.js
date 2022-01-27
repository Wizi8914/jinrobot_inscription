const { CommandoClient, Client, CommandoMessage } = require('discord.js-commando');
const path = require('path');

require('dotenv').config()

// ----------------- create client ----------------------------

const client = new CommandoClient({
    commandPrefix: '>',
    owner: '505762041789808641',
    invite: 'https://discord.gg/WXSkpYauty',
});


require('discord-buttons')(client)



//-----------------  REGISTERING COMMANDS  -------------------------


client.registry
    .registerDefaultTypes()
    .registerDefaultGroups()
	.registerGroup('utilitaire')
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('disconnect', () => {
    console.log('deconnecter');
});

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag} - (${client.user.id})`);
    client.user.setActivity('TEST', { type: 'PLAYING' });
}); 

client.on('error', (error) => console.error(error));



client.login(process.env.DISCORD_TOKEN);