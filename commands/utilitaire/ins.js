const { MessageEmbed } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');
const { MessageButton } = require('discord-buttons');
const { msgchannel, channelmsg } = require('../..');


module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ins',
            group: 'utilitaire',
            memberName: 'ins',
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
            .setID('ticketins')

        message.delete()
        message.say({embed: embed, buttons: [ticket]});
    }
}
