const { MessageEmbed } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');
const { MessageButton } = require('discord-buttons');
const { msgchannel, channelmsg } = require('../..');


module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'inscription',
            group: 'utilitaire',
            memberName: 'inscription',
            description: "le process d'einscription"
        });
    }

    /**
     * 
     * @param {CommandoMessage} message 
     */

    
    async run(message) {
        if(!await message.guild.channels.cache.find(ch => ch.name === `${message.author.username.toLocaleLowerCase()}┊inscription`)) {
            message.guild.channels.create(`${message.author.username}┊inscription`).then(async (channel) => {
                msgchannel.set(message.author.id, channel.id)
                channelmsg.set(channel.id, message.author.id)
                let category = message.guild.channels.cache.find(c => c.name == "INSCRIPTION" && c.type == "category");
                channel.setParent(category.id);
                let chan = message.guild.channels.cache.get(channel.id)


                await chan.overwritePermissions([
                    {
                        id: "933760704006209649", 
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: message.author.id, 
                        allow: ["VIEW_CHANNEL"]
                    },
                    {
                        id: message.guild.roles.everyone,
                        deny: ["VIEW_CHANNEL"]

                    }
                ])

        
            })
        } else {
            button.reply.defer()
            message.say(':x: **Vous avez déja créé un channel !**').then(async(no) => {
                setTimeout(() => {
                    no.delete()
                }, 5000);
            })
        }
    }
}
