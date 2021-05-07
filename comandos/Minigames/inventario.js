//Bibliotecas
const Discord = require('discord.js');
const c = new Discord.Client();
const { corNeutra } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json')

module.exports = {
    name: 'inventario',
    aliases: ['inv', 'inventário'],
    description: 'abra o seu inventário',
    usage: '<id>',
    execute(msg, args) {
        const id = msg.author.id
        if (!args.length) {


            const embed = new Discord.MessageEmbed()
                .setColor(corNeutra)
                .setTitle('Inventário')
                .setDescription(`abrindo...`)

            msg.channel.send(embed).then(mes => {
                scroll(mes, 0)
            })

        } else {

            var data = ''
            const item = c.perfil[id].inventario[args[0]]
            if(isNaN(args[0]))return msg.reply('Digite o id do item')
            if (item.cat == 'nave') {
                data = `Nome: ${item.nome}\nCategoria: ${item.cat}\nNível: ${item.lvl}\nValor: ${item.valor}\nAtaque Máximo: ${item.atkMax}\nDefesa Máxima: ${item.defMax}\nHP: ${item.hp}\nEnergia Máxima: ${item.energiaMax}\nCombustível Máximo: ${item.combustivelMax}\nOxigênio Máximo: ${item.oxigenioMax}\nÁgua Máxima: ${item.aguaMax}`

            } else if (item.cat == 'traje') {
                data = `Nome: ${item.nome}\nCategoria: ${item.cat}\nNível: ${item.lvl}\nValor: ${item.valor}\nAtaque Máximo: ${item.atkMax}\nDefesa Máxima: ${item.defMax}\nBateria: ${item.energiaMax}\nOxigênio: ${item.oxigenioMax}`
            } else if (item.cat == 'canhao' || item.cat == 'escudo' || item.cat == 'motor' || item.cat == 'gerador' || item.cat == 'catalisador' || item.cat == 'extrator' || item.cat == 'arma' || item.cat == 'defesa') {
                data = `Nome: ${item.nome}\nCategoria: ${item.cat}\nNível: ${item.lvl}\nValor: ${item.valor}\nAtributo: ${item.att}\nEstado: ${item.dur}%`
            } else if (item.cat == 'consumivel') {
                data = `Nome: ${item.nome}\nCategoria: ${item.cat}\nValor: ${item.valor}\nFome: ${item.fome}\nSede: ${item.sede}\nSono: ${item.sono}\nHP: ${item.hp}`
            } else {
                data = `Nome: ${item.nome}\nCategoria: ${item.cat}\nValor: ${item.valor}`
            }

            const embed = new Discord.MessageEmbed()
                .setColor(corNeutra)
                .setTitle('Inventário')
                .setDescription(data)

            msg.channel.send(embed)

        }
        function scroll(mes, num) {

            const item1 = `Nome: ${c.perfil[id].inventario[num].nome}\nUso: ${c.perfil[id].inventario[num].cat}\nId: ${num}\n`
            var item2 = 'Nome: vazio\nUso: vazio\nId: vazio\n'

            if (c.perfil[id].inventario[num + 1]) {
                item2 = `Nome: ${c.perfil[id].inventario[num + 1].nome}\nUso: ${c.perfil[id].inventario[num + 1].cat}\nId: ${num + 1}\n`
            }

            const embed = new Discord.MessageEmbed()
                .setColor(corNeutra)
                .setTitle('Inventário')
                .setDescription(`você pode ver os detalhes de um item com ${c.perfil[id].prefix}inv <id>`)
                .addFields(
                    { name: '🚀', value: item1, inline: true },
                    { name: '🛰', value: item2, inline: true }
                )
                .setFooter(`${num}-${num + 1}/${c.perfil[id].inventario.length - 1}`)

            mes.edit(embed).then(mes => {
                mes.react('⏮');
                mes.react('⏭');
                const filter = (reaction, user) => {
                    return ['⏮', '⏭'].includes(reaction.emoji.name) && user.id === id;
                }

                mes.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name == '⏮') {
                        if (num == 0) scroll(mes, 0)
                        else scroll(mes, num - 2)
                    } else {
                        if (num < c.perfil[id].inventario.length - 1) scroll(mes, num + 2)
                        else scroll(mes, num)
                    }
                    mes.reactions.removeAll()
                })
            })
        }

    }
}