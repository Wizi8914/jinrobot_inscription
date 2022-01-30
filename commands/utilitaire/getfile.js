const { Command, CommandoMessage } = require('discord.js-commando');
const { MessageEmbed, MessageAttachment } = require('discord.js');


module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'getdb',
            group: 'utilitaire',
            memberName: 'getfile',
            description: 'recup les DB en json'
        });
    }

    /**
     * 
     * @param {CommandoMessage} message 
     */

    async run(message, args) {
        if(!message.member.hasPermission("ADMINISTRATOR")) {
            return message.say(UserMissingPermision).then(async(no) => {
                setTimeout(() => {
                    no.delete()
                }, 5000);
            })
        }

        const db = new MessageAttachment('db.json');
        const team = new MessageAttachment('team.json');
        const noteam = new MessageAttachment('noteam.json')


        message.say(db)
        message.say(team)
        message.say(noteam)
    }
}