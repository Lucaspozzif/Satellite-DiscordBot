//Bibliotecas
const Discord = require('discord.js');
const Canvas = require('canvas')
const c = new Discord.Client();
const { corNeutra, corDer, corVic } = require('../../database/geral.json')
c.quadrantes = require('../../database/quadrantes.json')
c.perfil = require('../../database/perfil.json')

module.exports = {
    name: 'decolar',
    aliases: ['sair'],
    description: 'retorne ao espaco',
    execute(msg, args) {

        const id = msg.author.id
        const ficha = c.perfil[id]
        const quad = c.quadrantes[ficha.quadrante]
        const idPlaneta = ficha.planeta.split('-')[1]

        if (ficha.planeta == 'none') return msg.reply('Você já está no espaço, não há pra onde decolar')
        if (ficha.combustivel[1] < Math.floor(quad.planetas[idPlaneta].g / ficha.nave.motor.att)) return msg.reply('Você não tem combustível o suficiente, encha seus tanques ou compre um motor mais eficiente')

        const decolar = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle('Decolar')
            .setDescription(`Você pretende decolar do planeta ${ficha.planeta}?\nIsso irá consumir ${Math.floor(quad.planetas[idPlaneta].g / ficha.nave.motor.att)} de combustível`)

        msg.channel.send(decolar).then(mes => {

            mes.react('🚀')
            const filter = (reaction, user) => {
                return ['🚀'].includes(reaction.emoji.name) && user.id === id;
            }

            mes.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                const reaction = collected.first();
                reaction.users.remove(msg.author.id);
                if (reaction) {
                    const decolou = new Discord.MessageEmbed()
                        .setColor(corVic)
                        .setTitle('Você decolou')
                        .setDescription(`Explore a vastidão do espaço, lembre-se que você pode ir para outros quadrantes com o comando **;salto**`);

                    ficha.planeta = 'none'
                    ficha.combustivel[0] =  Math.floor(quad.planetas[idPlaneta].g / ficha.nave.motor.att)
                    ficha.nave.motor.dur--
                    mes.edit(decolou)

                }

            })
        })
    }

}