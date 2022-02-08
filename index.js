const { CommandoClient } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
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




// ----------------- create client ----------------------------

const client = new CommandoClient({
    commandPrefix: '>',
    owner: '505762041789808641',
    invite: 'https://discord.gg/WXSkpYauty',
});

module.exports = {
    msgchannel,
    channelmsg,
    client
}

require('discord-buttons')(client)

//=========================================================================

client.on('channelCreate', chan => {
    setTimeout(async () => {
        if (channelmsg.has(chan.id)) {
            const filter = m => channelmsg.get(chan.id) == m.author.id;
            chan.send(`:hand_splayed: Bonjour **<@${channelmsg.get(chan.id)}>** !\nMerci d'avoir cliqué sur le bouton pour vous inscrire, nous allons procéder à votre inscription.\n\nPour débuter veuillez préciser votre pseudo **Minecraft**`)

            await chan.awaitMessages(filter, { max: 1, time: 900000, errors: ['time']}).then(async (message) => {
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
            
        
                
                chan.send("**:clock4: Recherche... (`"+`${mcpseudo}`+"`)**").then(async (mess) => {
                    let m = false
                    try {
                        const { uuid } = await minecraftPlayer(mcpseudo)
                    } catch (error) {
                        var popo = 2
                    }
                    if (popo == 2) {
                        let p = 0
                        mess.delete().then(chan.send(":x: **Le pseudo préciser n'existe pas ! Veuiller le préciser a nouveau**"))
                        m = true
                        while (p < 1) {
                            await chan.awaitMessages(filter, { max: 1, time: 900000, errors: ['time']}).then(async (message) => {
                                message = message.first()
                                mcpseudo = message.content

                                try {
                                    const { uuid } = await minecraftPlayer(mcpseudo)
                                    var u = 0
                                } catch (error) {
                                    chan.send(":x: **Le pseudo préciser n'existe pas ! Veuiller le préciser a nouveau**")
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

                    var embed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle(`Est-ce bien Vous ?`)
                        .addField('Pseudonyme:', pseudo)
                        .addField('UUID:', uuid)
                        .setImage(mcskin)

                    if (m == false) {
                        mess.delete()
                    }

                    chan.send({embed: embed, buttons: [oui, non]}).then(async buto => {
                        const filter2 = m => m.clicker.user.id == channelmsg.get(chan.id);
                        
                        const coll = buto.createButtonCollector(filter2, {time: 400000})
    
                        await coll.on('collect', async btnn => {
                            btnn.reply.defer()
                            oui.setDisabled()
                            non.setDisabled()
                            coll.stop()

                            btnn.message.edit({embed: embed, buttons: [oui, non]})

                            let double = false

                            if(btnn.id == "non") { 
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
                                            await chan.awaitMessages(filter, { max: 1, time: 900000, errors: ['time']}).then(async (message) => {
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
            
                                chan.send({embed: embed, buttons: [oui, non]}).then(async but => {
                                    const filter2 = m => m.clicker.user.id == channelmsg.get(chan.id);
                                        
                                    const coll = but.createButtonCollector(filter2, {time: 400000})
                                    await coll.on('collect', async bt => {
                                        bt.reply.defer()
                                        oui.setDisabled()
                                        non.setDisabled()
                                        coll.stop()
                    
                                        bt.message.edit({embed: embed, buttons: [oui, non]})

                                        if (bt.id == 'non') {
                                            chan.send(':x: **Vous vous êtes trompé de pseudonyme plus de 2 fois veuillez vous réinscrire. Le salon va se supprimer dans quelques instants.**')
                                            setTimeout(() => {
                                                chan.delete()
                                            }, 5000);
                                        }
                                        if (bt.id == 'oui') {

                                            let cree = new MessageButton()
                                                .setStyle('gray')
                                                .setLabel('Créer')
                                                .setID('cree')
                                                    
                                            let rejoindre = new MessageButton()
                                                .setStyle('gray')
                                                .setLabel('Rejoindre')
                                                .setID('rejoindre')
                                                    
                                            let noteam = new MessageButton()
                                                .setStyle('gray')
                                                .setLabel('Pas de team')
                                                .setID('noteam')

                                            let finalembed = new MessageEmbed()
                                                .setColor('GREEN')
                                                .setTitle(`Pour finir merci de cliquer sur le bouton approprié`)
                                                .addField("Cliquez sur le bouton approprié.", "Créer votre équipe, rejoint en une ou alors inscrivez vous simplement si vous n'avez pas d'équipes.")

                                            if (isObjEmpty(await team.all()) == true) {
                                                rejoindre.setLabel("Aucune équipe créer")
                                                rejoindre.setDisabled()
                                            } 
            
                                            chan.send({embed: finalembed, buttons: [cree, rejoindre, noteam]}).then(async but => {
                                                const filter2 = m => m.clicker.user.id == channelmsg.get(chan.id);
            
                                                const collector = but.createButtonCollector(filter2, {time: 40000})
                            
                                                collector.on('collect', async btn => {
                                                    btn.reply.defer()
                                                    cree.setDisabled()
                                                    rejoindre.setDisabled()
                                                    noteam.setDisabled()
                                                    collector.stop()

                                                    btn.message.edit({embed: finalembed, buttons: [cree, rejoindre, noteam]})
                                                    
                                                    if (btn.id == 'cree') {
                                                        chan.send(':white_check_mark: Vous avez décidé de créer une équipe. Veuillez désormais cité le **nom** de votre équipe.')
                                                        await chan.awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
                                                            message = message.first()
                                                            try {
                                                                await db.push(`${message.content}`, `${pseudo}`)
                                                                await team.push("team", `${message.content}`)
                                                                chan.send(":white_check_mark: **Vous avez créé l'équipe " + "`" + message.content + "`" + " avec succès.**")
                                                            } catch (error) {
                                                                chan.send(":x: **Une erreur c'est produite veuiller contacter un membre du staff**")
                                                            }
                                                        })
                                                    }
                                                    if (btn.id == 'rejoindre') {
            
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
                                                    if (btn.id == "noteam") {
                                                        noteamlist.push("noteam", `${pseudo}`)
                                                        chan.send(":white_check_mark: **Vous avez été inscrit avec succès. N'hésitez pas à trouver des coéquipiers dans le salon <#934039774040305694>**")
                                                        
                                                    }
                                                })
                                            })
                                        }
                                            
                                    })
                                        
                                })
                                
                            }


                            if (btnn.id == "oui") {

                                let cree = new MessageButton()
                                    .setStyle('gray')
                                    .setLabel('Créer')
                                    .setID('cree')
                                        
                                let rejoindre = new MessageButton()
                                    .setStyle('gray')
                                    .setLabel('Rejoindre')
                                    .setID('rejoindre')
                                        
                                let noteam = new MessageButton()
                                    .setStyle('gray')
                                    .setLabel('Pas de team')
                                    .setID('noteam')

                                let finalembed = new MessageEmbed()
                                    .setColor('GREEN')
                                    .setTitle(`Pour finir merci de cliquer sur le bouton approprié`)
                                    .addField("Cliquez sur le bouton approprié.", "Créer votre équipe, rejoint en une ou alors inscrivez vous simplement si vous n'avez pas d'équipes.")

                                if (isObjEmpty(await team.all()) == true) {
                                    rejoindre.setLabel("Aucune équipe créer")
                                    rejoindre.setDisabled()
                                } 

                                chan.send({embed: finalembed, buttons: [cree, rejoindre, noteam]}).then(async but => {
                                    const filter2 = m => m.clicker.user.id == channelmsg.get(chan.id);

                                    const collector = but.createButtonCollector(filter2, {time: 40000})
                
                                    collector.on('collect', async btn => {
                                        btn.reply.defer()
                                        cree.setDisabled()
                                        rejoindre.setDisabled()
                                        noteam.setDisabled()
                                        collector.stop()

                                        btn.message.edit({embed: finalembed, buttons: [cree, rejoindre, noteam]})
                                        
                                        if (btn.id == 'cree') {
                                            chan.send(':white_check_mark: Vous avez décidé de créer une équipe. Veuillez désormais cité le **nom** de votre équipe.')
                                            await chan.awaitMessages(filter, { max: 1, time: 90000, errors: ['time']}).then(async (message) => {
                                                message = message.first()
                                                try {
                                                    await db.push(`${message.content}`, `${pseudo}`)
                                                    await team.push("team", `${message.content}`)
                                                    chan.send(":white_check_mark: **Vous avez créé l'équipe " + "`" + message.content + "`" + " avec succès.**")
                                                } catch (error) {
                                                    chan.send(":x: **Une erreur c'est produite veuiller contacter un membre du staff**")
                                                }
                                            })
                                        }
                                        if (btn.id == 'rejoindre') {

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
                                        if (btn.id == "noteam") {
                                            noteamlist.push("noteam", `${pseudo}`)
                                            chan.send(":white_check_mark: **Vous avez été inscrit avec succès. N'hésitez pas à trouver des coéquipiers dans le salon <#934039774040305694>**")
                                            
                                        }
                                    })
                                })
                            }                        
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