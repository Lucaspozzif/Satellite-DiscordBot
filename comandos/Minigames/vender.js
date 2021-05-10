const Discord = require('discord.js');
const c = new Discord.Client();
const { corNeutra, corDer, corVic } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json')
c.multiplayer = require('../../database/multiplayer.json')

module.exports = {
    name: 'vender',
    aliases: ['sell'],
    description: 'Equipe, use, coma ou qualquer outra coisa do seu inventário',
    args: true,
    usage: '<idItem>',
    execute(msg, args) {
        const id = msg.author.id
        const ficha = c.perfil[id]
        const item = ficha.inventario[args[0]]

        if(args[0] == 'agua' || args[0] == 'água'){
            
        }

        if (isNaN(args[0]) || args[0] > ficha.inventario.length) return msg.reply('este item não tem o id listado')

        const usar = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle('Você quer vender este item?')
            .setDescription(`Nome: ${item.nome}\nValor de venda: ${Math.floor(item.valor * 0.85)}`)

        const cancelar = new Discord.MessageEmbed()
            .setColor(corDer)
            .setTitle('Cancelado')
        const usado = new Discord.MessageEmbed()
            .setColor(corVic)
            .setTitle('O item foi vendido!')
            .setDescription(`Nome: ${item.nome}\nValor de venda: ${Math.floor(item.valor * 0.85)}`)

        msg.channel.send(usar).then(mes => {
            mes.react('💲');
            mes.react('❌');


            const filter = (reaction, user) => {
                return ['💲', '❌'].includes(reaction.emoji.name) && user.id === id;
            }

            mes.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                const reaction = collected.first();
                mes.reactions.removeAll()

                if (reaction.emoji.name === '💲') {
                    ficha.money += Math.floor(item.valor * 0.85)
                    c.multiplayer -= Math.floor(item.valor * 0.85)
                    ficha.inventario.splice(args[0], 1)
                    mes.edit(usado)
                } else {
                    return mes.edit(cancelar)
                }

            })
        })
    }

}