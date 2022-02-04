const { MessageEmbed, GuildMember } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');
const minecraftPlayer = require('minecraft-player');
const { MessageButton } = require('discord-buttons');
let jsoning = require("jsoning");
const { msgchannel, channelmsg } = require('../..');


let db = new jsoning("db.json");
let team = new jsoning("team.json");
let noteamlist = new jsoning("noteam.json");

function isObjEmpty(obj) {
    return Object.keys(obj).length === 0;
}

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ins',
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

        if(!message.member.hasPermission("ADMINISTRATOR")) {
            return message.say(UserMissingPermision).then(async(no) => {
                setTimeout(() => {
                    no.delete()
                }, 5000);
            })
        }
        
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(`Cliquez sur la réaction pour vous inscrire !`)

        const ticket = new MessageButton()
            .setStyle('gray')
            .setLabel('📩')
            .setID('ticket')

        message.delete()
        message.say({embed: embed, buttons: [ticket]});
        this.client.on('clickButton', async (button) => {
            if(button.id == "ticket") {
                if(!message.guild.channels.cache.find(ch => ch.name === `${button.clicker.user.username.toLocaleLowerCase()}┊inscription`)) {
                    button.reply.defer()
                    message.guild.channels.create(`${button.clicker.user.username}┊inscription`).then(async (channel) => {
                        msgchannel.set(button.clicker.id, channel.id)
                        channelmsg.set(channel.id, button.clicker.id)
                        let category = message.guild.channels.cache.find(c => c.name == "INSCRIPTION" && c.type == "category");
                        channel.setParent(category.id);
                        let chan = message.guild.channels.cache.get(channel.id)


                        await chan.overwritePermissions([
                            {
                                id: "933760704006209649", 
                                deny: ["VIEW_CHANNEL"]
                            },
                            {
                                id: button.clicker.user.id, 
                                allow: ["VIEW_CHANNEL"]
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
        
        })
    }
}
