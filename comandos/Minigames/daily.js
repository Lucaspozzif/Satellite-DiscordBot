//Bibliotecas
const Discord = require('discord.js');
const c = new Discord.Client();
const { daily } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json')

module.exports = {
    name: 'daily',
    aliases: ['d'],
    description: 'Saque o seu bônus diário',
    cooldown: 86400,    
    execute(msg) {
        const id = msg.author.id
        c.perfil[id].money += daily
        msg.channel.send(`${daily}$ foram adicionados à sua conta 🪙`)

    }

}