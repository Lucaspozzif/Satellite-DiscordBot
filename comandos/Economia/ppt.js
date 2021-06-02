//Bibliotecas
const Discord = require('discord.js');
const c = new Discord.Client();
const { corNeutra, corVic, corDer } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json')
c.multiplayer = require('../../database/multiplayer.json')

module.exports = {
    name: 'pedrapapeltesoura',
    aliases: ['ppt'],
    description: 'Aposte no pedra papel tesoura',
    args: true,
    usage: '<aposta>',
    execute(msg, args) {
        const amount = Math.floor(args[0])
        const id = msg.author.id
        const saldoEmbed = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle(`Escolha entre **pedra 🪨**, **papel 🧻** ou **tesoura ✂️**`);

        const girando = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle('Jogando... 🪙')

        if (amount < 0 || amount > c.perfil[id].money || isNaN(amount)) {
            msg.channel.send(`Você não tem dinheiro o suficiente :(`)
            return
        }
        msg.channel.send(saldoEmbed).then(mes => {
            mes.react('🪨')
            mes.react('🧻');
            mes.react('✂️');

            const filter = (reaction, user) => {
                return ['🪨', '🧻','✂️'].includes(reaction.emoji.name) && user.id === id;
            }

            mes.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                const reaction = collected.first();
                const aposta = Math.floor(Math.random() * 3)
                var vic = 0;
                var jogada = '🪨';

                if (aposta == 1) jogada = '🧻'
                if(aposta == 2) jogada = '✂️'

                if (reaction.emoji.name === '🪨'){
                    if(jogada == '🧻')vic = 1
                    if(jogada == '🪨')vic = 2
                }
                if (reaction.emoji.name === '🧻'){
                    if(jogada == '✂️')vic = 1
                    if(jogada == '🧻')vic = 2
                }
                if (reaction.emoji.name === '✂️'){
                    if(jogada == '🪨')vic = 1
                    if(jogada == '✂️')vic = 2
                }

                if (vic == 0) {
                    c.perfil[id].money += amount
                    c.multiplayer.money -= amount
                    var result = new Discord.MessageEmbed()
                        .setColor(corVic)
                        .setTitle(`Parabéns! O adversario jogou **${jogada}**, você ganhou **${amount}$** 🪙`)
                } else if( vic == 1) {
                    c.perfil[id].money -= amount
                    c.multiplayer.money += amount
                    result = new Discord.MessageEmbed()
                        .setColor(corDer)
                        .setTitle(`Sinto muito. O adversario jogou **${jogada}**, você perdeu **${amount}$** 🪙`)
                }else{
                    result = new Discord.MessageEmbed()
                        .setColor(corNeutra)
                        .setTitle(`Deu empate. O adversario jogou **${jogada}**.`)

                }
                reaction.users.remove(msg.author.id)

                mes.edit(girando)
                setTimeout(() => {
                    mes.edit(result)
                }, 2000);

            }).catch((e) => { e })
        })
    }

}