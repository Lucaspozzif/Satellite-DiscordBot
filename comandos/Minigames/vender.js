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


        const carregando = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle('carregando...')

        let a = false

        if (args[0] == 'atmosfera' || args[0] == 'hidrogenio' || args[0] == 'hidrogênio' || args[0] == 'ar') {
            msg.channel.send(carregando).then(mes => {
                vender(mes, 'combustível', 1, 10, 0)
                a = true

            })
        }
        if (args[0] == 'oxigenio' || args[0] == 'oxigênio') {
            msg.channel.send(carregando).then(mes => {
                vender(mes, 'oxigênio', 2, 10, 1)
                a = true

            })
        }
        if (args[0] == 'agua' || args[0] == 'água') {
            msg.channel.send(carregando).then(mes => {
                vender(mes, 'água', 2, 10, 2)
                a = true

            })
        }
        if (args[0] == 'recurso' || args[0] == 'recursos' || args[0] == 'fragmentos' || args[0] == 'fragmento') {
            msg.channel.send(carregando).then(mes => {
                vender(mes, 'fragmentos', 2, 10, 3)
                a = true

            })
        }

        if (a == false) return
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
            mes.react('🪙');
            mes.react('❌');


            const filter = (reaction, user) => {
                return ['🪙', '❌'].includes(reaction.emoji.name) && user.id === id;
            }

            mes.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                const reaction = collected.first();
                mes.reactions.removeAll()

                if (reaction.emoji.name === '🪙') {
                    ficha.money += Math.floor(item.valor * 0.85)
                    c.multiplayer -= Math.floor(item.valor * 0.85)
                    ficha.inventario.splice(args[0], 1)
                    mes.edit(usado)
                } else {
                    return mes.edit(cancelar)
                }

            })
        })


        function vender(mes, nome, valor, i, e) {

            if (i < 0) i = 0


            const usar = new Discord.MessageEmbed()
                .setColor(corNeutra)
                .setTitle('Você quer vender este item?')
                .setDescription(`Nome: ${nome}\nUnidades: ${i}\nValor: ${valor * i}`)

            mes.edit(usar).then(mes => {
                mes.react('⏮');
                mes.react('➖');
                mes.react('🪙');
                mes.react('➕');
                mes.react('⏭');


                const filter = (reaction, user) => {
                    return ['⏮', '➖', '🪙', '➕', '⏭'].includes(reaction.emoji.name) && user.id === id;
                }

                mes.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();
                    reaction.users.remove(msg.author.id)

                    if (reaction.emoji.name === '⏮') {
                        vender(mes, nome, valor, i - 10, e)
                    } else if (reaction.emoji.name === '⏭') {
                        vender(mes, nome, valor, i + 10)
                    } else if (reaction.emoji.name === '➖') {
                        vender(mes, nome, valor, i - 1)
                    } else if (reaction.emoji.name === '➕') {
                        vender(mes, nome, valor, i + 1)
                    } else {
                        ficha.money += Math.floor(valor * i)
                        c.multiplayer -= Math.floor(valor * i)

                        if (e == 0) {
                            if (i > ficha.combustivel[0]) i = ficha.combustivel[0]
                            ficha.combustivel[0] -= i
                            c.multiplayer.hidrogenio += i

                        }
                        if (e == 1) {
                            if (i > ficha.oxigenio[0]) i = ficha.oxigenio[0]
                            ficha.oxigenio[0] -= i
                            c.multiplayer.oxigenio += i

                        }
                        if (e == 2) {
                            if (i > ficha.agua[0]) i = ficha.agua[0]
                            ficha.agua[0] -= i
                            c.multiplayer.agua += i

                        }
                        if (e == 3) {
                            if (i > ficha.fragmento) i = ficha.fragmento
                            ficha.fragmento -= i
                            c.multiplayer.fragmento += i

                        }
                        c.perfil[id].money += i * valor
                        c.multiplayer.money -= i * valor

                        const usado = new Discord.MessageEmbed()
                            .setColor(corVic)
                            .setTitle(`Você vendeu ${i} unidades de ${nome} por ${valor*i}`)
            

                        mes.edit(usado)

                    }

                })
            })

        }
    }

}