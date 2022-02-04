const { CommandoClient, Client, CommandoMessage } = require('discord.js-commando');
const { MessageEmbed, GuildMember } = require('discord.js');
const minecraftPlayer = require('minecraft-player');
const { MessageButton } = require('discord-buttons');
let jsoning = require("jsoning");
const path = require('path');
require('dotenv').config()

var msgchannel = new Map()
var channelmsg = new Map()


let db = new jsoning("db.json");
let team = new jsoning("team.json");
let noteamlist = new jsoning("noteam.json");

function isObjEmpty(obj) {
    return Object.keys(obj).length === 0;
}

module.exports = {
    msgchannel,
    channelmsg
}


// ----------------- create client ----------------------------

const client = new CommandoClient({
    commandPrefix: '>',
    owner: '505762041789808641',
    invite: 'https://discord.gg/WXSkpYauty',
});


require('discord-buttons')(client)

//=========================================================================

client.on('channelCreate', chan => {
    setTimeout(() => {
        if (channelmsg.has(chan.id)) {
            const filter = m => channelmsg.get(chan.id) == m.author.id;
            chan.send(`:hand_splayed: Bonjour **<@${channelmsg.get(chan.id)}>** !\nMerci d'avoir cliqué sur le bouton pour vous inscrire, nous allons procéder à votre inscription.\n\nPour débuter veuillez préciser votre pseudo **Minecraft**`).then(async (msg) => {
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
                        message.guild.channels.cache.get(msgchannel.get(message.author.id)).send(":x: **Le pseudo préciser n'existe pas ! Veuiller le préciser a nouveau**")
                        while (p < 1) {
                            await message.guild.channels.cache.get(msgchannel.get(message.author.id)).awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
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

                    const filter2 = m => m.clicker.user.id == channelmsg.get(chan.id);
                    chan.send({embed: embed, buttons: [oui, non]}).then(async but => {
                        const collector = but.createButtonCollector(filter2, {time: 40000})

                        collector.on('collect', async btn => {
                            btn.reply.defer()
                            collector.stop()
                            oui.setDisabled()
                            non.setDisabled()

                            btn.message.edit({embed: embed, buttons: [oui, non]})

                        })
                    })





                })
            
            })
        } 
    }, 1000);
})


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
    client.user.setActivity('cite.jinro.eu', { type: 'PLAYING' });
}); 

client.on('error', (error) => console.error(error));



client.login(process.env.DISCORD_TOKEN);



/*
const filter = m => button.clicker.id == m.author.id;

message.guild.channels.cache.get(msgchannel.get(button.clicker.member.id)).send(`:hand_splayed: Bonjour **${button.clicker.user.username}** !\nMerci d'avoir cliqué sur le bouton pour vous inscrire, nous allons procéder à votre inscription.\n\nPour débuter veuillez préciser votre pseudo **Minecraft**`).then(async (msg) => {
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
                                        await message.guild.channels.cache.get(msgchannel.get(message.author.id)).awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
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
        
                                console.log('testPP')
                                message.guild.channels.cache.get(msgchannel.get(message.author.id)).send({embed: embed, buttons: [oui, non]})

                                message.guild.channels.cache.get(msgchannel.get(message.author.id)).client.on('clickButton', async (button) => {

                                    if(button.id == "non") {
                                        button.reply.defer()
                                        oui.setDisabled()
                                        non.setDisabled()

                                        button.message.edit({embed: embed, buttons: [oui, non]})

                                        message.guild.channels.cache.get(msgchannel.get(button.clicker.member.id)).send(`:question: **Ce n'est pas vous ? Veuiller alors rentrer a nouveau votre pseudo Minecraft**`)
                                        await message.guild.channels.cache.get(msgchannel.get(button.clicker.member.id)).awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
                                            message = message.first()
                                            mcpseudo = message.content

                                            try {
                                                const { uuid } = await minecraftPlayer(mcpseudo)
                                            } catch (error) {
                                                var pmpm = 2
                                            }
            
                                            if (pmpm == 2) {
                                                let m = 0
                                                message.guild.channels.cache.get(msgchannel.get(button.clicker.member.id)).send(":x: **Le pseudo cité n'existe pas ! Veuiller le cité a nouveau**")
                                                while (m < 1) {
                                                    await message.guild.channels.cache.get(msgchannel.get(button.clicker.member.id)).awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
                                                        message = message.first()
                                                        mcpseudo = message.content
                                                        try {
                                                            const { uuid } = await minecraftPlayer(mcpseudo)
                                                            var u = 0
                                                        } catch (error) {
                                                            message.guild.channels.cache.get(msgchannel.get(message.author.id)).send(":x: **Le pseudo cité n'existe pas ! Veuiller le cité a nouveau**")
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
                
                                            message.guild.channels.cache.get(msgchannel.get(button.clicker.member.id)).send({embed: embed, buttons: [oui, non]});
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



                                        message.guild.channels.cache.get(msgchannel.get(button.clicker.member.id)).send({embed: finalembed, buttons: [cree, rejoindre, noteam]})

                                        function removebutton(button) {
                                            button.reply.defer()
                                            cree.setDisabled()
                                            rejoindre.setDisabled()
                                            noteam.setDisabled()
                                            button.message.edit({embed: finalembed, buttons: [cree, rejoindre, noteam]})
                                        }

                                        message.guild.channels.cache.get(msgchannel.get(button.clicker.member.id)).client.once('clickButton', async (button) => {
                                            if (button.id == 'cree') {
                                                removebutton(button)
                                                message.guild.channels.cache.get(msgchannel.get(button.clicker.member.id)).send(':white_check_mark: Vous avez décidé de créer une équipe. Veuillez désormais cité le **nom** de votre équipe.')
                                                await message.guild.channels.cache.get(msgchannel.get(button.clicker.member.id)).awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
                                                    message = message.first()
                                                    try {
                                                        await db.push(`${message.content}`, `${pseudo}`)
                                                        await team.push("team", `${message.content}`)
                                                        message.guild.channels.cache.get(msgchannel.get(message.author.id)).send(":white_check_mark: **Vous avez créé l'équipe " + "`" + message.content + "`" + " avec succès.**")
                                                    } catch (error) {
                                                        message.guild.channels.cache.get(msgchannel.get(message.author.id)).set(":x: **Une erreur c'est produite veuiller contacter un membre du staff**")
                                                    }
                                                })
                                            }
                                            if (button.id == 'rejoindre') {
                                                removebutton(button)

                                                message.guild.channels.cache.get(msgchannel.get(button.clicker.member.id)).send(":white_check_mark: Vous avez décidé de rejoindre une équipe. Veuillez désormais cité le **nom** de l'équipe que vous voulez rejoindre.")

                                                var listteam = new MessageEmbed()
                                                    .setColor('GREEN')
                                                    .setTitle("Vous avez décidé de rejoindre une équipe. Veuillez désormais cité le nom de l'équipe que vous voulez rejoindre.")

                                                    var value = "";

                                                    for (let i = 0; i < Array(await team.get('team'))[0].length; i++) {
                                                        value += `**${Array(await team.get('team'))[0][i]}** - ${5 - (Array(await db.get(Array(await team.get('team'))[0][i]))[0].length)} place(s) restante(s)\n`     
                                                    }

                                                    listteam.addField("Liste des équipes:", value)

                                                    message.guild.channels.cache.get(msgchannel.get(button.clicker.member.id)).send(listteam)


                                                let rej = 0
                                                while (rej < 1) {
                                                    await message.guild.channels.cache.get(msgchannel.get(button.clicker.member.id)).awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
                                                        message = message.first()

                                                        if (await db.has(message.content) == false) {
                                                            message.guild.channels.cache.get(msgchannel.get(message.author.id)).send(":x: **Le nom d'équipe cité n'existe pas veuillez rentrer un nom d'équipe valide.**");
                                                        } else {
                                                            if (Array(await db.get(message.content))[0].length == 5) {
                                                                message.guild.channels.cache.get(msgchannel.get(message.author.id)).send(":x: **L'équipe cité est déja au complet veuiller en choisir une autre**")
                                                            } else {
                                                                await db.push(`${message.content}`, `${pseudo}`)
                                                                message.guild.channels.cache.get(msgchannel.get(message.author.id)).send(":white_check_mark: **Vous avez rejoint l'équipe " + "`" + message.content + "`" + " avec succès**");
                                                                rej = 1
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                            if (button.id == "noteam") {
                                                removebutton(button)
                                                noteamlist.push("noteam", `${pseudo}`)
                                                message.guild.channels.cache.get(msgchannel.get(button.clicker.member.id)).send(":white_check_mark: **Vous avez été inscrit avec succès. N'hésitez pas à trouver des coéquipiers dans le salon <#934039774040305694>**")
                                                
                                            }
                                        })
                                    }
                                })
                            })

                        })

*/