//Bibliotecas
const Discord = require('discord.js');
const c = new Discord.Client();
const { corNeutra } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json')

module.exports = {
    name: 'conta',
    aliases: ['c', 'money', 'm'],
    description: 'Verifique o seu saldo bancário',
    execute(msg) {
        const id = msg.author.id
        const saldoEmbed = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle(`Saldo bancário`)
            .setDescription(`${msg.author} possui **${c.perfil[id].money} 🪙**`);

        msg.channel.send(saldoEmbed)
    }

}