//Bibliotecas
const Discord = require('discord.js');
const c = new Discord.Client();
const { corNeutra, corVic, corDer } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json')

module.exports = {
    name: 'flip',
    aliases: ['f'],
    description: 'Gire uma moeda e aposte',
    args: true,
    usage: '<aposta>',
    execute(msg, args) {
        const amount = args[0]
        const id = msg.author.id
        const saldoEmbed = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle(`Escolha entre **cara 🙂** ou **coroa 👑**`);

        const girando = new Discord.MessageEmbed()
        .setColor(corNeutra)
        .setTitle('Girando... 🪙')

        if (amount < 0 || amount > c.perfil[id].money || isNaN(amount)) {
            msg.channel.send(`Você não tem dinheiro o suficiente :(`)
            return
        }
        c.perfil[id].money -= parseInt(amount)
        msg.channel.send(saldoEmbed).then(mes => {
            mes.react('🙂')
            mes.react('👑');

            const filter = (reaction, user) => {
                return ['🙂', '👑'].includes(reaction.emoji.name) && user.id === id;
            }

            mes.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                const reaction = collected.first();
                const aposta = Math.floor(Math.random() * 2)
                var vic = false;
                var face = 'coroa';

                if (aposta == 0) face = 'cara'

                if (reaction.emoji.name === '🙂' && aposta == 0) {
                    vic = true
                } else if (reaction.emoji.name === '👑' && aposta == 1) {
                    vic = true
                }

                if (vic == true) {
                    c.perfil[id].money += parseInt(2*amount)
                    var result = new Discord.MessageEmbed()
                        .setColor(corVic)
                        .setTitle(`Parabéns! Era **${face}**, você ganhou **${amount}$** 🪙`)
                } else {
                    result = new Discord.MessageEmbed()
                        .setColor(corDer)
                        .setTitle(`Sinto muito. Era **${face}**, você perdeu **${amount}$** 🪙`)
                }

                mes.edit(girando)
                setTimeout(() => {
                    mes.edit(result)
                }, 2000);

            })
        })
    }

}