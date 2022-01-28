const { MessageEmbed } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');
const minecraftPlayer = require('minecraft-player');
const { MessageButton } = require('discord-buttons');
let jsoning = require("jsoning");
let db = new jsoning("db.json");

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
                        let category = message.guild.channels.cache.find(c => c.name == "INSCRIPTION" && c.type == "category");
                        channel.setParent(category.id);
                        const chan = message.guild.channels.cache.get(channel.id)
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

                        const filter = m => button.clicker.id == m.author.id;
                        chan.send(`:hand_splayed: Bonjour **${button.clicker.user.username}** !\nMerci d'avoir cliquer sur le bouton pour vous inscrire nous allons procéder a votre inscription.\n\nPour débuter veuiller préciser votre pseudo **Minecraft**`).then(async () => {
                            chan.awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
                                message = message.first()
                                var mcpseudo = message.content

                                let oui = new MessageButton()
                                    .setLabel('✔️')
                                    .setID('oui')
                                    .setStyle('green')
                                
                                let non = new MessageButton()
                                    .setLabel('❌')
                                    .setID('non')
                                    .setStyle('red')


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


                                let uuid = (await minecraftPlayer(mcpseudo)).uuid
                                let mcskin = `https://crafatar.com/renders/body/${uuid}?size=32&overlay`
                                let pseudo = (await minecraftPlayer(uuid)).username

                                let embed = new MessageEmbed()
                                    .setColor('GREEN')
                                    .setTitle(`Est-ce bien Vous ?`)
                                    .addField('Pseudonyme:', pseudo)
                                    .addField('UUID:', uuid)
                                    .setImage(mcskin)
        
                                chan.send({embed: embed, buttons: [oui, non]});

                                this.client.on('clickButton', async (button) => {
                                    if(button.id == "non") {
                                        button.reply.defer()
                                        oui.setDisabled()
                                        non.setDisabled()

                                        button.message.edit({embed: embed, buttons: [oui, non]})

                                        chan.send(`:question: **Ce n'est pas vous ? Veuiller alors rentrer a nouveau votre pseudo Minecraft**`)
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
                                            .setLabel('✔️')
                                            .setID('oui')
                                            .setStyle('green')
                                        
                                        non = new MessageButton()
                                            .setLabel('❌')
                                            .setID('non')
                                            .setStyle('red')

                                        uuid  = (await minecraftPlayer(mcpseudo)).uuid
                                        mcskin = `https://crafatar.com/renders/body/${uuid}?size=32&overlay`
                                        pseudo = (await minecraftPlayer(uuid)).username

                                        embed = new MessageEmbed()
                                            .setColor('GREEN')
                                            .setTitle(`Est-ce bien Vous ?`)
                                            .addField('Pseudonyme', pseudo)
                                            .addField('UUID:', uuid)
                                            .setImage(mcskin)
                
                                        chan.send({embed: embed, buttons: [oui, non]});
                                    }


                                    if (button.id == "oui") {
                                        button.reply.defer()
                                        oui.setDisabled()
                                        non.setDisabled()

                                        button.message.edit({embed: embed, buttons: [oui, non]})

                                        const cree = new MessageButton()
                                            .setStyle('gray')
                                            .setLabel('Créé')
                                            .setID('cree')
                                        
                                        const rejoindre = new MessageButton()
                                            .setStyle('gray')
                                            .setLabel('rejoindre')
                                            .setID('rejoindre')
                                        
                                        const noteam = new MessageButton()
                                            .setStyle('gray')
                                            .setLabel('Pas de team')
                                            .setID('noteam')

                                        const finalembed = new MessageEmbed()
                                            .setColor('GREEN')
                                            .setTitle(`Pour finir merci de cliquer sur le bouton aproprier`)
                                            .addField("Clicker sur le bouton aproprier", "créé vous une équipe ou alors rejoigner-en une ou alors inscriver vous meme su vous n'avez pas d'équipe")



                                        chan.send({embed: finalembed, buttons: [cree, rejoindre, noteam]})

                                        function removebutton(button) {
                                            button.reply.defer()
                                            cree.setDisabled()
                                            rejoindre.setDisabled()
                                            noteam.setDisabled()
                                            button.message.edit({embed: finalembed, buttons: [cree, rejoindre, noteam]})
                                        }

                                        this.client.on('clickButton', async (button) => {
                                            if (button.id == 'cree') {
                                                removebutton(button)
                                                chan.send(':white_check_mark: Vous avez décider de créé une équipe. Veuiller désormais cité ne **nom** de votre équipe')
                                                await chan.awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
                                                    message = message.first()
                                                    try {
                                                        await db.set(`${message.content}`, `${mcpseudo}`)
                                                        chan.send(":white_check_mark: **Vous avez créé la team " + "`" + message.content + "`" + " avec succès**")
                                                    } catch (error) {
                                                        chan.set(":x: **Une erreur c'est produite veuiller contacter un membre du staff**")
                                                    }
                                                })
                                            }
                                            if (button.id == 'rejoindre') {
                                                removebutton(button)

                                                chan.send('rejoindre')

                                                chan.send(":white_check_mark: Vous avez décider de rejoindre une équipe. Veuiller désormais cité ne **nom** de l'équipe que vous vouler rejoindre")

                                                let rej = 0
                                                while (rej < 1) {
                                                    await chan.awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
                                                        message = message.first()
    
                                                        if (await db.has(message.content) == false) {
                                                            chan.send(":x: **Le nom d'équipe cité n'éxiste pas veuiller rentrer un nom d'équipe valide. **");
                                                        } else {
                                                            await db.push(`${message.content}`, `${mcpseudo}`)
                                                            chan.send(":white_check_mark: **Vous avez rejoint la team " + "`" + message.content + "`" + " avec succès**");
                                                            rej = 1
                                                        }
                                                    })
                                                }
                                            }
                                            if (button.id == "noteam") {
                                                removebutton(button)

                                                chan.send('pas de team')
                                                
                                            }

                                        })


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