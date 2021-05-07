//Bibliotecas
const Discord = require('discord.js');
const c = new Discord.Client();
const { corNeutra, corDer, corVic } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json')

module.exports = {
    name: 'usar',
    aliases: ['use', 'comer', 'equipar', 'equip'],
    description: 'Equipe, use, coma ou qualquer outra coisa do seu inventário',
    args: true,
    usage: '<idItem>',
    execute(msg, args) {
        const id = msg.author.id
        const ficha = c.perfil[id]
        const item = ficha.inventario[args[0]]

        if (isNaN(args[0]) || args[0] > ficha.inventario.length) return msg.reply('este item não tem o id listado')

        const usar = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle('Você quer usar este item?')
            .setDescription(`Nome: ${item.nome}`)

        const cancelar = new Discord.MessageEmbed()
            .setColor(corDer)
            .setTitle('Cancelado')
        const usado = new Discord.MessageEmbed()
            .setColor(corVic)
            .setTitle('O item foi usado!')
            .setDescription(`Nome: ${item.nome}`)
            const inutil = new Discord.MessageEmbed()
                .setColor(corNeutra)
                .setTitle('Este item não pode ser usado')
                .setDescription(`Nome: ${item.nome}`)

        msg.channel.send(usar).then(mes => {
            mes.react('✅');
            mes.react('❌');


            const filter = (reaction, user) => {
                return ['✅', '❌'].includes(reaction.emoji.name) && user.id === id;
            }

            mes.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === '✅') {
                    if (item.cat == 'nave') {
                        item.canhao = ficha.nave.canhao
                        item.escudo = ficha.nave.escudo
                        item.motor = ficha.nave.motor
                        item.gerador = ficha.nave.gerador
                        item.catalisador = ficha.nave.catalisador
                        item.extrator = ficha.nave.extrator
                        ficha.nave.canhao = {}
                        ficha.nave.escudo = {}
                        ficha.nave.motor = {}
                        ficha.nave.gerador = {}
                        ficha.nave.catalisador = {}
                        ficha.nave.extrator = {}
                        ficha.nave = item
                        ficha.inventario.push(ficha.nave)
                    }
                    if( item.cat == 'canhao'){
                        ficha.inventario.push(ficha.nave.canhao)
                        ficha.nave.canhao = item
                    }
                    if( item.cat == 'escudo'){
                        ficha.inventario.push(ficha.nave.escudo)
                        ficha.nave.escudo = item
                    }
                    if( item.cat == 'motor'){
                        ficha.inventario.push(ficha.nave.motor)
                        ficha.nave.motor = item
                    }
                    if( item.cat == 'gerador'){
                        ficha.inventario.push(ficha.nave.gerador)
                        ficha.nave.gerador = item
                    }
                    if( item.cat == 'catalisador'){
                        ficha.inventario.push(ficha.nave.catalisador)
                        ficha.nave.catalisador = item
                    }
                    if( item.cat == 'extrator'){
                        ficha.inventario.push(ficha.nave.extrator)
                        ficha.nave.extrator = item
                    }
                    if(item.cat == 'traje'){
                        item.arma = ficha.traje.arma
                        item.defesa = ficha.traje.defesa
                        ficha.traje.arma = {}
                        ficha.traje.defesa = {}
                        ficha.traje = item
                        ficha.inventario.push(ficha.traje)
                    }
                    if( item.cat == 'arma'){
                        ficha.inventario.push(ficha.traje.arma)
                        ficha.traje.arma = item
                    }
                    if( item.cat == 'defesa'){
                        ficha.inventario.push(ficha.traje.defesa)
                        ficha.traje.defesa = item
                    }
                    if(item.cat == 'consumivel'){
                        ficha.fome += item.fome
                        ficha.sede += item.sede
                        ficha.sono += item.sono
                        ficha.hp += item.hp
                    }else{

                    }
                    ficha.inventario.splice(args[0],1)
                    mes.edit(usado)


                } else {
                    return mes.edit(cancelar)
                }

            })
        })
    }

}