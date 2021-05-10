//Bibliotecas
const Discord = require('discord.js');
const c = new Discord.Client();
c.perfil = require('../../database/perfil.json')
c.multiplayer = require('../../database/multiplayer.json')

module.exports = {
    name: 'daily',
    aliases: ['d'],
    description: 'Saque o seu bônus diário, varia dependendo dos fundos do bot',
    cooldown: 86400,    
    execute(msg) {
        const id = msg.author.id

        var daily = Math.floor(c.multiplayer.money/1000000)
        if(daily <= 0){
            daily = 60
        }
        c.perfil[id].money += daily
        c.multiplayer.money -= daily
        msg.channel.send(`${daily}$ foram adicionados à sua conta 🪙`)

    }

}