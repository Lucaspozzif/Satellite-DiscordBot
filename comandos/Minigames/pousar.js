//Bibliotecas
const Discord = require('discord.js');
const Canvas = require('canvas')
const c = new Discord.Client();
const { corNeutra, corDer, corVic } = require('../../database/geral.json')
c.quadrantes = require('../../database/quadrantes.json')
c.perfil = require('../../database/perfil.json')

module.exports = {
    name: 'pousar',
    aliases: ['aterrisar', 'pou'],
    description: 'Pouse nos planetas para poder interagir com eles',
    args: true,
    usage: '<IDplaneta>',
    execute(msg, args) {

        const id = msg.author.id
        const ficha = c.perfil[id]
        const quad = c.quadrantes[ficha.quadrante]

        if(isNaN(parseInt(args[0])) || args[0] > quad.planetas.length-1 ) return msg.reply('Este planeta não está listado, verifique o id')
        if (ficha.planeta !== 'none') return msg.reply('Antes de aterrizar em outro planeta, decole do que você está com o comando **;decolar**')
        if( !quad.planetas[args[0]].explorado.includes(id)) return msg.reply('explore o planeta com o comando **;explorar** antes de aterrizar nele')

        const aterrizar = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle('Aterrizar')
            .setDescription(`Você pretende aterrizar no planeta ${quad.planetas[args[0]].nome}?\nVocê poderá extrair os recursos, água, atmosfera, oxigênio do planeta usando o comando **;extrair <material>** e então vendê-los ou usar em sua própria nave, mas lembre-se que estes recursos são finitos`)

        msg.channel.send(aterrizar).then(mes => {

            mes.react('🚀')
            const filter = (reaction, user) => {
                return ['🚀'].includes(reaction.emoji.name) && user.id === id;
            }

            mes.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                const reaction = collected.first();
                reaction.users.remove(id);
                if (reaction) {
                    const aterrizou = new Discord.MessageEmbed()
                        .setColor(corVic)
                        .setTitle('Você aterrizou')
                        .setDescription(`Colete os recursos que te interessam, e lembre-se de que decolar deste planeta custará ${Math.floor(quad.planetas[args[0]].g / ficha.nave.motor.att )} de combustível.\nQuando quiser voltar ao espaço utilize o comando ;decolar`);

                    ficha.planeta = quad.planetas[args[0]].nome
                    mes.edit(aterrizou)

                }

            }).catch((e) => { e })
        })
    }

}