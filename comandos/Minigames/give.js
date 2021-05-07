//Bibliotecas
const Discord = require('discord.js');
const c = new Discord.Client();
c.perfil = require('../../database/perfil.json')

module.exports = {
    name: 'give',
    aliases: ['g'],
    description: 'pague outras pessoas',
    args: true,
    usage: '<montante> @menção',
    execute(msg, args){
        const mention = msg.mentions.users.first().id
        const id = msg.author.id
        var amount = parseInt(args[0]) 
        if(isNaN(amount)) amount = parseInt(args[1])
        if(isNaN(amount) || amount < 0 || amount > c.perfil[id].money) return msg.reply('você não tem este dinheiro 🪙')


        c.perfil[id].money -= amount;
        c.perfil[mention].money += amount;
        msg.channel.send(`${msg.author.username}, você transferiu **$${amount} 🪙** para ${msg.mentions.users.first().username}`)

    }
}