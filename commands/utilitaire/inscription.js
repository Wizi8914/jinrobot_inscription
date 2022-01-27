const { MessageEmbed } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');
const minecraftPlayer = require('minecraft-player');
const { MessageButton } = require('discord-buttons')

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'inscription',
            group: 'utilitaire',
            memberName: 'say',
            description: 'dit ce que tu veut aux bot '
        });
    }

    /**
     * 
     * @param {CommandoMessage} message 
     */

    async run(message, args) {

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
            const userclick = button.clicker.user.id
            if(button.id == "ticket") {
                if(!message.guild.channels.cache.find(ch => ch.name === `${button.clicker.user.username.toLocaleLowerCase()}┊inscription`)) {
                    button.reply.defer()
                    message.guild.channels.create(`${button.clicker.user.username}┊inscription`).then(channel => {
                        let role = message.guild.roles.cache.find('name', "Staff");
                        let role2 = message.guild.roles.find("name", "@everyone");

                        channel.overwritePermissions(button.clicker.user, {
                            SEND_MESSAGES: true,
                            READ_MESSAGES: true
                        });
                        channel.overwritePermissions(role, {
                            SEND_MESSAGES: true,
                            READ_MESSAGES: true
                        });
                        channel.overwritePermissions(role2, {
                            SEND_MESSAGES: false,
                            READ_MESSAGES: false
                        });


                        let category = message.guild.channels.cache.find(c => c.name == "INSCRIPTION" && c.type == "category");
                        channel.setParent(category.id);
                        const chan = message.guild.channels.cache.get(channel.id)
                        const filter = m => button.clicker.id == m.author.id;
                        chan.send(`:hand_splayed: Bonjour **${button.clicker.user.username}** !\nMerci d'avoir cliquer sur le bouton pour vous inscrire nous allons procéder a votre inscription.\n\nPour débuter veuiller préciser votre pseudo **Minecraft**`).then(async () => {
                            chan.awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
                                message = message.first()
                                var mcpseudo = message.content

                                var oui = new MessageButton()
                                    .setStyle('gray')
                                    .setLabel('✔️')
                                    .setID('oui')
                                
                                var non = new MessageButton()
                                    .setStyle('gray')
                                    .setLabel('❌')
                                    .setID('non')


                                try {
                                    const { uuid } = await minecraftPlayer(mcpseudo)
                                } catch (error) {
                                    var popo = 2
                                }

                                if (popo == 2) {
                                    let p = 0
                                    chan.send(":x: **Le pseudo cité n'existe pas ! Veuiller le cité a nouveau**")
                                    while (p < 1) {
                                        await chan.awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
                                            message = message.first()
                                            mcpseudo = message.content
                                            try {
                                                const { uuid } = await minecraftPlayer(mcpseudo)
                                                var u = 0
                                            } catch (error) {
                                                chan.send(":x: **Le pseudo cité n'existe pas ! Veuiller le cité a nouveau**")
                                            }
                                            if (u == 0) {
                                                p = 1
                                            }
                                        })
                                    }
                                }

                                let validskin = 0


                                const { uuid } = await minecraftPlayer(mcpseudo)
                                const mcskin = `https://crafatar.com/renders/body/${uuid}?size=32&overlay`

                                var embed = new MessageEmbed()
                                    .setColor('GREEN')
                                    .setTitle(`Est-ce bien Vous ?`)
                                    .addField('UUID:', uuid)
                                    .setImage(mcskin)
        
                                chan.send({embed: embed, buttons: [oui, non]});
                                let lp = 0
                                this.client.on('clickButton', async (button) => {
                                    chan.send('test')
                                    if(button.id == "non") {
                                        button.reply.defer()
                                        oui.setDisabled()
                                        non.setDisabled()

                                        button.message.edit({embed: embed, buttons: [oui, non]})

                                        chan.send(`Ce n'est pas vous ? veuiller alors rentrer a nouveau votre pseudo Minecraft`)
                                        await chan.awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
                                            message = message.first()
                                            mcpseudo = message.content

                                            try {
                                                const { uuid } = await minecraftPlayer(mcpseudo)
                                            } catch (error) {
                                                var pmpm = 2
                                            }
            
                                            if (pmpm == 2) {
                                                let m = 0
                                                chan.send(":x: **Le pseudo cité n'existe pas ! Veuiller le cité a nouveau**")
                                                while (m < 1) {
                                                    await chan.awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
                                                        message = message.first()
                                                        mcpseudo = message.content
                                                        try {
                                                            const { uuid } = await minecraftPlayer(mcpseudo)
                                                            var u = 0
                                                        } catch (error) {
                                                            chan.send(":x: **Le pseudo cité n'existe pas ! Veuiller le cité a nouveau**")
                                                        }
                                                        if (u == 0) {
                                                            m = 1
                                                        }
                                                    })
                                                }
                                            }

                                        })

                                        oui = new MessageButton()
                                            .setStyle('gray')
                                            .setLabel('✔️')
                                            .setID('oui')
                                        
                                        non = new MessageButton()
                                            .setStyle('gray')
                                            .setLabel('❌')
                                            .setID('non')


                                        const { uuid } = await minecraftPlayer(mcpseudo)
                                        const mcskin = `https://crafatar.com/renders/body/${uuid}?size=32&overlay`

                                        embed = new MessageEmbed()
                                            .setColor('GREEN')
                                            .setTitle(`Est-ce bien Vous ?`)
                                            .addField('UUID:', uuid)
                                            .setImage(mcskin)
                
                                        chan.send({embed: embed, buttons: [oui, non]});
                                    }


                                    if (button.id == "oui") {
                                        button.reply.defer()
                                        oui.setDisabled()
                                        non.setDisabled()

                                        button.message.edit({embed: embed, buttons: [oui, non]})

                                        const { username } = await minecraftPlayer(uuid)
                                        chan.send(`suite de la commande, Pseudo Minecraft: (${username})`)

                                    }
                                })

                            })

                        })

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