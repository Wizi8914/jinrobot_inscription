const { MessageEmbed, GuildMember } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');
const minecraftPlayer = require('minecraft-player');
const { MessageButton } = require('discord-buttons');
let jsoning = require("jsoning");
var msgchannel = new Map()

let db = new jsoning("db.json");
let team = new jsoning("team.json");
let noteamlist = new jsoning("noteam.json");

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

                        msgchannel.set(button.clicker.id, channel.id)

                        const filter = m => button.clicker.id == m.author.id;
                    
                        message.guild.channels.cache.get(msgchannel.get(button.clicker.member.id)).send(`:hand_splayed: Bonjour **${button.clicker.user.username}** !\nMerci d'avoir cliqué sur le bouton pour vous inscrire, nous allons procéder à votre inscription.\n\nPour débuter veuillez préciser votre pseudo **Minecraft**`).then(async () => {
                            message.guild.channels.cache.get(msgchannel.get(button.clicker.member.id)).awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
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
                                    message.guild.channels.cache.get(msgchannel.get(message.author.id)).send(":x: **Le pseudo préciser n'existe pas ! Veuiller le préciser a nouveau**")
                                    while (p < 1) {
                                        await chan.awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
                                            message = message.first()
                                            mcpseudo = message.content
                                            try {
                                                const { uuid } = await minecraftPlayer(mcpseudo)
                                                var u = 0
                                            } catch (error) {
                                                message.guild.channels.cache.get(msgchannel.get(message.author.id)).send(":x: **Le pseudo préciser n'existe pas ! Veuiller le préciser a nouveau**")
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
        
                                message.guild.channels.cache.get(msgchannel.get(message.author.id)).send({embed: embed, buttons: [oui, non]});

                                chan.client.on('clickButton', async (button) => {
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
                                            .setLabel('Rejoindre')
                                            .setID('rejoindre')
                                        
                                        const noteam = new MessageButton()
                                            .setStyle('gray')
                                            .setLabel('Pas de team')
                                            .setID('noteam')

                                        const finalembed = new MessageEmbed()
                                            .setColor('GREEN')
                                            .setTitle(`Pour finir merci de cliquer sur le bouton approprié`)
                                            .addField("Cliquez sur le bouton approprié.", "Créer votre équipe, rejoint en une ou alors inscrivez vous simplement si vous n'avez pas d'équipes.")



                                        chan.send({embed: finalembed, buttons: [cree, rejoindre, noteam]})

                                        function removebutton(button) {
                                            button.reply.defer()
                                            cree.setDisabled()
                                            rejoindre.setDisabled()
                                            noteam.setDisabled()
                                            button.message.edit({embed: finalembed, buttons: [cree, rejoindre, noteam]})
                                        }

                                        chan.client.once('clickButton', async (button) => {
                                            if (button.id == 'cree') {
                                                removebutton(button)
                                                chan.send(':white_check_mark: Vous avez décidé de créer une équipe. Veuillez désormais cité le **nom** de votre équipe.')
                                                await chan.awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
                                                    message = message.first()
                                                    try {
                                                        await db.push(`${message.content}`, `${pseudo}`)
                                                        await team.push("team", `${message.content}`)
                                                        chan.send(":white_check_mark: **Vous avez créé l'équipe " + "`" + message.content + "`" + " avec succès.**")
                                                    } catch (error) {
                                                        chan.set(":x: **Une erreur c'est produite veuiller contacter un membre du staff**")
                                                    }
                                                })
                                            }
                                            if (button.id == 'rejoindre') {
                                                removebutton(button)

                                                chan.send(":white_check_mark: Vous avez décidé de rejoindre une équipe. Veuillez désormais cité le **nom** de l'équipe que vous voulez rejoindre.")

                                                var listteam = new MessageEmbed()
                                                    .setColor('GREEN')
                                                    .setTitle("Vous avez décidé de rejoindre une équipe. Veuillez désormais cité le nom de l'équipe que vous voulez rejoindre.")

                                                    var value = "";

                                                    for (let i = 0; i < Array(await team.get('team'))[0].length; i++) {
                                                        value += `**${Array(await team.get('team'))[0][i]}** - ${5 - (Array(await db.get(Array(await team.get('team'))[0][i]))[0].length)} place(s) restante(s)\n`     
                                                    }

                                                    listteam.addField("Liste des équipes:", value)

                                                chan.send(listteam)


                                                let rej = 0
                                                while (rej < 1) {
                                                    await chan.awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
                                                        message = message.first()

                                                        if (await db.has(message.content) == false) {
                                                            chan.send(":x: **Le nom d'équipe cité n'existe pas veuillez rentrer un nom d'équipe valide.**");
                                                        } else {
                                                            if (Array(await db.get(message.content))[0].length == 5) {
                                                                chan.send(":x: **L'équipe cité est déja au complet veuiller en choisir une autre**")
                                                            } else {
                                                                await db.push(`${message.content}`, `${pseudo}`)
                                                                chan.send(":white_check_mark: **Vous avez rejoint l'équipe " + "`" + message.content + "`" + " avec succès**");
                                                                rej = 1
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                            if (button.id == "noteam") {
                                                removebutton(button)
                                                noteamlist.push("noteam", `${pseudo}`)
                                                chan.send(":white_check_mark: **Vous avez été inscrit avec succès. N'hésitez pas à trouver des coéquipiers dans le salon <#934039774040305694>**")
                                                
                                            }

                                            message.say('\n\n:warning: **Le Salon va maintenant se suprimer dans quelques instants**').then( () => {
                                                setTimeout(() => {
                                                    chan.delete()
                                                }, 5000);
                                            })

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


