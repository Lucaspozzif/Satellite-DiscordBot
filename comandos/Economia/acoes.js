//Bibliotecas
const Discord = require('discord.js');
const c = new Discord.Client();
const { corNeutra, corVic, corDer } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json')
c.multiplayer = require('../../database/multiplayer.json')

module.exports = {
    name: 'ações',
    aliases: ['açoes', 'acoes', 'acões','acao','ação'],
    description: 'compre e venda ações',
    execute(msg) {
        const actions = c.multiplayer.acoes
        const id = msg.author.id
        const embed = new Discord.MessageEmbed()
        .setColor(corNeutra)
        .setTitle('carregando...')
        msg.channel.send(embed).then(mes => {
            venderAcoes(mes, 0)
        })
        function venderAcoes(mes, i) {

            const usar = new Discord.MessageEmbed()
                .setColor(corNeutra)
                .setTitle('Ações')
                .setDescription(`Nome: **${actions[i].nome}**\nValor atual: **$${actions[i].valor}**`)
                .setFooter('As ações sofrem alterações a cada 10 minutos')

            mes.edit(usar).then(mes => {
                mes.react('⏮');
                mes.react('📈');
                mes.react('⏭');

                const filter = (reaction, user) => {
                    return ['⏮', '📈', '⏭'].includes(reaction.emoji.name) && user.id === id;
                }

                mes.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();
                    reaction.users.remove(id)

                    if (reaction.emoji.name == '⏮') {
                        let unit = i -1
                        if (unit < 0) unit = 0
                        venderAcoes(mes, unit)

                    } else if (reaction.emoji.name == '⏭') {
                        let unit = i +1
                        if (unit >= actions.length) unit = actions.length - 1
                        venderAcoes(mes, unit)

                    } else {
                        mes.reactions.removeAll()
                        mapear(mes, i, 0)
                    }
                })
            })

        }
        
        function mapear(mes,i, unidades){
            let player = false
            for (let j = 0; j < actions[i].comprador.length; j++) {
                if(actions[i].comprador[j] == id){
                    player = j
                }
                
            }

            const detalhes = new Discord.MessageEmbed()
                .setColor(corNeutra)
                .setTitle(`Ação ${actions[i].nome}`)
                .setDescription(`Valor atual: **$${actions[i].valor}**\nAções compradas: ${actions[i].unidades[player]}\nPatrimônio líquido: ${actions[i].unidades[player] * actions[i].valor}`)
                .addField('Transação',`Ações: ${unidades}\nValor da compra/venda: $${unidades*actions[i].valor}`)
                .setFooter(`As ações sofrem alterações a cada 10 minutos - Seu dinheiro: $${c.perfil[id].money}`)

            mes.edit(detalhes).then(mes => {
                mes.react('⏮');
                mes.react('➖');
                mes.react('💵');
                mes.react('➕');
                mes.react('⏭');

                const filter = (reaction, user) => {
                    return ['⏮', '➖', '💵', '➕', '⏭'].includes(reaction.emoji.name) && user.id === id;
                }

                mes.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();
                    reaction.users.remove(id)

                    if (reaction.emoji.name == '⏮') {
                        let units = unidades - 10
                        if (units < -actions[i].unidades[player]) units = -actions[i].unidades[player]
                        mapear(mes, i, units)

                    } else if (reaction.emoji.name == '➖') {
                        let units = unidades - 1
                        if (units < -actions[i].unidades[player]) units = -actions[i].unidades[player]
                        mapear(mes, i, units)

                    } else if (reaction.emoji.name == '➕') {
                        let units = unidades + 1
                        mapear(mes, i, units)

                    } else if (reaction.emoji.name == '⏭') {
                        let units = unidades + 10
                        mapear(mes, i, units)

                    }else{
                        if(c.perfil[id].money < actions[i].valor*unidades)return msg.reply('Você não tem esse dinheiro')

                        c.perfil[id].money -= actions[i].valor*unidades
                        c.multiplayer.money += actions[i].valor*unidades

                        actions[i].unidades[player] += unidades

                        const detalhes = new Discord.MessageEmbed()
                            .setColor(corVic)
                            .setTitle(`Ação ${actions[i].nome}`)
                            .setDescription(`Valor atual: **$${actions[i].valor}**\nAções guardadas: ${actions[i].unidades[player]}\nPatrimônio líquido: ${actions[i].unidades[player] * actions[i].valor}`)

                            mes.edit(detalhes)
                            mes.reactions.removeAll()


                    }
                })
            })
        }
    }
}