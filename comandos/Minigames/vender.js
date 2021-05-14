const Discord = require('discord.js');
const c = new Discord.Client();
const { corNeutra, corDer, corVic } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json')
c.multiplayer = require('../../database/multiplayer.json')

module.exports = {
    name: 'vender',
    aliases: ['sell'],
    description: 'Equipe, use, coma ou qualquer outra coisa do seu inventário',
    execute(msg, args) {
        const id = msg.author.id
        const ficha = c.perfil[id]
        const item = ficha.inventario

        const menuVenda = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle('O que você quer vender')
            .setDescription('🎒 Itens do inventário\n🛢 Combustível\n💨 Oxigênio\n💧 Água\n✨ Fragmentos')

        msg.channel.send(menuVenda).then(mes => {
            mes.react('🎒');
            mes.react('🛢');
            mes.react('💨');
            mes.react('💧');
            mes.react('✨');

            const filter = (reaction, user) => {
                return ['🎒', '🛢', '💨', '💧', '✨'].includes(reaction.emoji.name) && user.id === id;
            }

            mes.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                const reaction = collected.first();
                mes.reactions.removeAll()

                if (reaction.emoji.name == '🎒') {
                    mes.react('➖');
                    mes.react('💵');
                    mes.react('➕');
                    venderInv(mes, 0)

                } else if (reaction.emoji.name == '🛢') {
                    mes.react('⏮');
                    mes.react('➖');
                    mes.react('💵');
                    mes.react('➕');
                    mes.react('⏭');
                    vender(mes, 1, 0, 'Combustível')


                } else if (reaction.emoji.name == '💨') {
                    mes.react('⏮');
                    mes.react('➖');
                    mes.react('💵');
                    mes.react('➕');
                    mes.react('⏭');
                    vender(mes, 2, 0, 'Oxigênio')

                } else if (reaction.emoji.name == '💧') {
                    mes.react('⏮');
                    mes.react('➖');
                    mes.react('💵');
                    mes.react('➕');
                    mes.react('⏭');
                    vender(mes, 3, 0, 'Água')

                } else {
                    vender(mes, 2, 0, 'Fragmentos')
                    mes.react('⏮');
                    mes.react('➖');
                    mes.react('💵');
                    mes.react('➕');
                    mes.react('⏭');

                }

            })
        })
        function vender(mes, valor, unidades, nome) {
            const negociando = new Discord.MessageEmbed()
                .setColor(corNeutra)
                .setTitle('Vendendo')
                .setDescription(`Nome: \`${nome}\`\nUnidades: \`${unidades}\`\nValor: \`$${unidades * valor}\``)

            mes.edit(negociando).then(mes => {

                const filter = (reaction, user) => {
                    return ['⏮', '➖', '💵', '➕', '⏭'].includes(reaction.emoji.name) && user.id === id;
                }

                mes.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();
                    reaction.users.remove(id)

                    if (reaction.emoji.name == '⏮') {
                        let units = unidades - 10
                        if (units < 0) units = 0
                        vender(mes, valor, units, nome)

                    } else if (reaction.emoji.name == '➖') {
                        let units = unidades - 1
                        if (units < 0) units = 0
                        vender(mes, valor, units, nome)

                    } else if (reaction.emoji.name == '➕') {
                        let units = unidades + 1
                        if (units > item) units = item
                        vender(mes, valor, units, nome)

                    } else if (reaction.emoji.name == '⏭') {
                        let units = unidades + 10
                        if (units > item) units = item
                        vender(mes, valor, units, nome)

                    } else {
                        const vendido = new Discord.MessageEmbed()
                            .setColor(corVic)
                            .setDescription(`Negócio fechado, você vendeu ${unidades} unidades de ${nome} por $${unidades * valor}`)

                        mes.edit(vendido)
                        if (nome == 'Combustível') {
                            c.multiplayer.hidrogenio += unidades
                            c.perfil[id].combustivel[0] -= unidades
                        } else if (nome == 'Oxigênio') {
                            c.multiplayer.oxigenio += unidades
                            c.perfil[id].oxigenio[0] -= unidades
                        } else if (nome == 'Água') {
                            c.multiplayer.agua += unidades
                            c.perfil[id].agua[0] -= unidades
                        } else {
                            c.multiplayer.fragmento += unidades
                            c.perfil[id].fragmento -= unidades
                        }

                        c.multiplayer.money -= unidades * valor
                        c.perfil[id].money += unidades * valor


                    }

                })

            })

        }
        function venderInv(mes, i) {


            const usar = new Discord.MessageEmbed()
                .setColor(corNeutra)
                .setTitle('Você quer vender este item?')
                .setDescription(`Nome: ${item[i].nome}\nValor de venda: ${Math.floor(item[i].valor * 0.85)}`)

            const vendido = new Discord.MessageEmbed()
                .setColor(corVic)
                .setTitle('O item foi vendido!')
                .setDescription(`Nome: ${item.nome}\nValor de venda: ${Math.floor(item[i].valor * 0.85)}`)

            mes.edit(usar).then(mes => {
                mes.react('⏮');
                mes.react('💵');
                mes.react('⏭');

                const filter = (reaction, user) => {
                    return ['⏮', '💵', '⏭'].includes(reaction.emoji.name) && user.id === id;
                }

                mes.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();
                    reaction.users.remove(id)

                    if (reaction.emoji.name == '⏮') {
                        let unit = i - 1
                        if (unit < 0) unit = 0
                        venderInv(mes, unit)

                    } else if (reaction.emoji.name == '⏭') {
                        let unit = i + 1
                        console.log(item.length)
                        if (unit >= item.length) unit = item.length - 1
                        venderInv(mes, unit)

                    } else {
                        const vendido = new Discord.MessageEmbed()
                            .setColor(corVic)
                            .setDescription(`Negócio fechado, você vendeu ${item[i].nome} por $${Math.floor(item[i].valor * 0.85)}`)


                        c.multiplayer.money -= Math.floor(item[i].valor * 0.85)
                        c.perfil[id].money += Math.floor(item[i].valor * 0.85)
                        ficha.inventario.splice(i, 1)

                        mes.edit(vendido)
                    }
                })
            })
        }
    }
}