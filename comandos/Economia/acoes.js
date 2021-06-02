//Bibliotecas
const Discord = require('discord.js');
const Canvas = require('canvas')
const c = new Discord.Client();
const { corNeutra, corVic, corDer } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json')
c.multiplayer = require('../../database/multiplayer.json')

module.exports = {
    name: 'ações',
    aliases: ['açoes', 'acoes', 'acões', 'acao', 'ação'],
    description: 'compre e venda ações',
    execute(msg) {
        const actions = c.multiplayer.acoes
        const id = msg.author.id
        const embed = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle('carregando...')
        msg.channel.send(embed).then(mes => {
            mes.react('⏮');
            mes.react('💵');
            mes.react('⏭');
            mes.react('📈');
            venderAcoes(mes, 0)
        })
        function venderAcoes(mes, i) {

            const usar = new Discord.MessageEmbed()
                .setColor(corNeutra)
                .setTitle('Ações')
                .setDescription(`Nome: **${actions[i].nome}**\nValor atual: **$${actions[i].valor}**`)
                .setFooter('As ações sofrem alterações a cada 10 minutos')

            mes.edit(usar).then(mes => {

                const filter = (reaction, user) => {
                    return ['⏮', '💵', '📈', '⏭'].includes(reaction.emoji.name) && user.id === id;
                }

                mes.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();
                    reaction.users.remove(id)

                    if (reaction.emoji.name == '⏮') {
                        let unit = i - 1
                        if (unit < 0) unit = 0
                        venderAcoes(mes, unit)

                    } else if (reaction.emoji.name == '⏭') {
                        let unit = i + 1
                        if (unit >= actions.length) unit = actions.length - 1
                        venderAcoes(mes, unit)

                    } else if (reaction.emoji.name == '💵') {
                        mes.reactions.removeAll()
                        mes.react('↩️');
                        mes.react('⏮');
                        mes.react('💵');
                        mes.react('⏭');
                        mes.react('✖️');
                        mapear(mes, i, 0, 1)
                    } else {
                        mes.reactions.removeAll()
                        const cota = ['💲']
                        for (let j = 1; j < actions[i].grafico.length; j++) {
                            var sinal = `↓`
                            if(actions[i].grafico[j] / actions[i].grafico[j - 1] > 1){
                                sinal = `↑`
                            }
                            cota.push(`$${actions[i].grafico[j]} ${sinal} (${(actions[i].grafico[j] / actions[i].grafico[j - 1]).toFixed(2)}%)`)


                        }


                        const balanco = new Discord.MessageEmbed()
                            .setColor(corNeutra)
                            .setTitle(`Detalhes sobre ${actions[i].nome}`)
                            .addFields(
                                { name: 'Balanço da ação', value: `${cota.join('\n')}` }
                            )

                        mes.edit(balanco).then(mes => {
                            mes.react('↩️');

                            const filter = (reaction, user) => {
                                return ['↩️'].includes(reaction.emoji.name) && user.id === id;
                            }

                            mes.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                                const reaction = collected.first();
                                mes.reactions.removeAll()

                                if (reaction) {
                                    mes.react('⏮');
                                    mes.react('💵');
                                    mes.react('⏭');
                                    mes.react('📈');
                                    venderAcoes(mes, 0)

                                }
                            })
                        })
                    }
                }).catch((e) => { e })
            })

            function mapear(mes, i, unidades, mult) {
                let player = false
                for (let j = 0; j < actions[i].comprador.length; j++) {
                    if (actions[i].comprador[j] == id) {
                        player = j
                    }

                }

                const detalhes = new Discord.MessageEmbed()
                    .setColor(corNeutra)
                    .setTitle(`Ação ${actions[i].nome}`)
                    .setDescription(`Valor atual: **$${actions[i].valor}**\nAções compradas: \`${actions[i].unidades[player]}\`\nPatrimônio líquido: \`${actions[i].unidades[player] * actions[i].valor}\``)
                    .addField('Transação', `Valor da compra/venda: **$${unidades * actions[i].valor}**\nAções: \`${unidades}\`\n\nMultiplicador: \`${mult}\``)
                    .setFooter(`As ações sofrem alterações a cada 10 minutos - Seu dinheiro: $${c.perfil[id].money}`)

                mes.edit(detalhes).then(mes => {

                    const filter = (reaction, user) => {
                        return ['⏮', '↩️', '💵', '✖️', '⏭'].includes(reaction.emoji.name) && user.id === id;
                    }

                    mes.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                        const reaction = collected.first();
                        reaction.users.remove(id)

                        if (reaction.emoji.name == '⏮') {
                            let units = unidades - (1 * mult)
                            if (units < -actions[i].unidades[player]) units = -actions[i].unidades[player]
                            mapear(mes, i, units, mult)

                        } else if (reaction.emoji.name == '⏭') {
                            let units = unidades + (1 * mult)
                            mapear(mes, i, units, mult)

                        } else if (reaction.emoji.name == '↩️') {
                            mes.reactions.removeAll()
                            mes.react('⏮');
                            mes.react('📈');
                            mes.react('⏭');
                            venderAcoes(mes, i)

                        } else if (reaction.emoji.name == '✖️') {
                            let units = unidades
                            let abc = false
                            if (mult == 100) {
                                mult = 1
                                abc = true
                            }
                            if (mult == 50) mult = 100
                            if (mult == 10) mult = 50
                            if (mult == 1 && abc == false) mult = 10
                            mapear(mes, i, units, mult)

                        } else {
                            mes.reactions.removeAll()
                            if (c.perfil[id].money < actions[i].valor * unidades) return msg.reply('Você não tem esse dinheiro')

                            c.perfil[id].money -= actions[i].valor * unidades
                            c.multiplayer.money += actions[i].valor * unidades

                            actions[i].unidades[player] += unidades

                            const detalhes = new Discord.MessageEmbed()
                                .setColor(corVic)
                                .setTitle(`Ação ${actions[i].nome}`)
                                .setDescription(`Valor atual: **$${actions[i].valor}**\nAções guardadas: ${actions[i].unidades[player]}\nPatrimônio líquido: ${actions[i].unidades[player] * actions[i].valor}`)

                            mes.edit(detalhes)
                        }
                    }).catch((e) => { e })
                })
            }
        }
    }
}