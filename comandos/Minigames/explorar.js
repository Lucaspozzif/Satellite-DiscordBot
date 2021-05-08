//Bibliotecas
const Discord = require('discord.js');
const Canvas = require('canvas')
const c = new Discord.Client();
const { corNeutra, corDer, corVic } = require('../../database/geral.json')
c.quadrantes = require('../../database/quadrantes.json')
c.perfil = require('../../database/perfil.json')

module.exports = {
    name: 'explorar',
    aliases: ['exp', 'explore'],
    description: 'explore um planeta, tanto sobre o planeta(aprender sobre) quanto sobre o planeta(andar sobre)',
    args: true,
    usage: '<planetaID>',
    execute(msg, args) {
        const id = msg.author.id
        const ficha = c.perfil[id]
        const quad = c.quadrantes[ficha.quadrante]

        if (isNaN(args[0]) || args[0] > quad.planetas.length) return msg.reply('Este planeta não está catalogado no seu quadrante')


        const quest = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle('Você quer explorar este planeta?')
            .setDescription(`Isso custará ${Math.floor(quad.planetas[args[0]].g / 10) + ficha.nave.motor.att} de combustível, e levará **${120 / ficha.nave.motor.att}** minutos`)
            .addField(`Probabilidade de ter os recursos`, `Nome: ${quad.planetas[args[0]].nome}\nAtmosfera: 14.28%\nOxigênio: 2.04%\nÁgua: 2.04%\nVida: 0.29%\nRecursos: 33.33%`)


        const going = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle('Explorando um planeta')
            .setDescription(`Você será alertado daqui há **${120 / ficha.nave.motor.att}** minutos`)

            const fim = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle(`Você terminou de explorar ${quad.planetas[args[0]].nome}`)
            .addField(`Relatório do planeta`, `Nome: ${quad.planetas[args[0]].nome}\nAtmosfera: ${quad.planetas[args[0]].atmosfera[1]}\nOxigênio: ${quad.planetas[args[0]].oxigenio[1]}%\nÁgua: ${quad.planetas[args[0]].agua[1]}\nVida: ${quad.planetas[args[0]].vida[1]}\nRecursos: ${quad.planetas[args[0]].recursos[1]}`)

        msg.channel.send(quest).then(mes => {
            mes.react('🔍')

            const filter = (reaction, user) => {
                return ['🔍'].includes(reaction.emoji.name) && user.id === id;
            }

            mes.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                const reaction = collected.first();

                if (reaction) {
                    if(ficha.combustivel[1] < Math.floor(quad.planetas[args[0]].g / 10) + ficha.nave.motor.att)return msg.reply('Você não tem combustível o suficiente, compre mais')
                    if(ficha.status !== 'none')return msg.reply(`Você não pode explorar um planeta enquanto está ${ficha.status}`)
                    if(quad.planetas[args[0]].explorado.includes(id))return msg.reply('Você já explorou este planeta')
                
                    mes.edit(going)
                    ficha.combustivel[1] -= Math.floor(quad.planetas[args[0]].g / 10) + ficha.nave.motor.att
                    ficha.status = `explorando o ${quad.planetas[args[0]].nome}`
                    setTimeout(() => {
                        ficha.status = `none`
                        msg.author.send(fim)
                        quad.planetas[args[0]].explorado.push(id)

                    }, /*60 * (120 / ficha.nave.motor.att) * 1000*/1);

                }


            })
        })
    }
}
