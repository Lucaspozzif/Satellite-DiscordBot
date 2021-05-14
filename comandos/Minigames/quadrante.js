//Bibliotecas
const Discord = require('discord.js');
const Canvas = require('canvas')
const c = new Discord.Client();
const { corNeutra, corDer, corVic } = require('../../database/geral.json')
c.quadrantes = require('../../database/quadrantes.json')
c.perfil = require('../../database/perfil.json')

module.exports = {
    name: 'quadrante',
    aliases: ['mapa', 'quad', 'map'],
    description: 'Encontre planetas e estrelas na sua vizinhança galáctica',
    execute(msg) {


        const id = msg.author.id
        const ficha = c.perfil[id]
        const quad = c.quadrantes[ficha.quadrante]

        const canvas = Canvas.createCanvas(1024, 720)
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#0f0f0f';
        ctx.fillRect(0, 0, 1024, 720)

        const embed = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle(`Renderizando mapa...`)

        msg.channel.send(embed).then(mes => {
            declarar(mes, 0)
            mes.react('⏮');
            mes.react('⏭');
            mes.react('🗺');
            mes.react('🔍');
        })

        function declarar(mes, i) {

            let atmosfera = '???'
            let oxigenio = '???'
            let agua = '???'
            let vida = '???'
            let recursos = '???'



            if (quad.planetas[i].explorado.includes(id)) {
                if (quad.planetas[i].atmosfera[0] == true) {
                    atmosfera = quad.planetas[i].atmosfera[1]
                } else {
                    atmosfera = 'Não encontrado'
                }
                if (quad.planetas[i].oxigenio[0] == true) {
                    oxigenio = quad.planetas[i].oxigenio[1]
                } else {
                    oxigenio = 'Não encontrado'
                }
                if (quad.planetas[i].agua[0] == true) {
                    agua = quad.planetas[i].agua[1]
                } else {
                    agua = 'Não encontrado'
                }
                if (quad.planetas[i].vida[0] == true) {
                    vida = quad.planetas[i].vida[1]
                } else {
                    vida = 'Não encontrado'
                }
                if (quad.planetas[i].recursos[0] == true) {
                    recursos = quad.planetas[i].recursos[1]
                } else {
                    recursos = 'Não encontrado'
                }
            }


            const embed = new Discord.MessageEmbed()
                .setColor(corNeutra)
                .setTitle(`Sistema do quadrante ${ficha.quadrante}`)
                .setDescription(`Aqui estão listados os detalhes dos planetas do sistema deste quadrante`)
                .addField(`${quad.planetas[i].nome}`, `ID: \`${quad.planetas[i].nome.split('-')[1]}\`Coordenadas: \`${quad.planetas[i].x.toFixed(2)}, ${quad.planetas[i].y.toFixed(2)}\`\nGravidade: \`${quad.planetas[i].g}\`\nAtmosfera: \`${atmosfera}\`\n Oxigênio: \`${oxigenio}\`\nÁgua: \`${agua}\`\nVida: \`${vida}\`\nRecursos minerais: \`${recursos}\``)
                .setFooter(`${i}/${quad.planetas.length - 1}`)

            mes.edit(embed).then(mes => {

                const filter = (reaction, user) => {
                    return ['⏮', '⏭', '🗺', '🔍'].includes(reaction.emoji.name) && user.id === id;
                }
                mes.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();
                    reaction.users.remove(id)

                    if (reaction.emoji.name == '⏮') {
                        if (i == 0) declarar(mes, 0)
                        else declarar(mes, i - 1)
                    } else if (reaction.emoji.name == '⏭') {
                        if (i + 1 == quad.planetas.length) declarar(mes, quad.planetas.length - 1)
                        else declarar(mes, i + 1)
                    } else if (reaction.emoji.name == '🗺') {
                        declarar(mes, i)
                        ctx.fillStyle = quad.estrela.cor
                        ctx.beginPath()
                        ctx.arc(quad.estrela.x, quad.estrela.y, 100, 0, 2 * Math.PI)
                        ctx.fill()
                        ctx.closePath()

                        for (let i = 0; i < quad.planetas.length; i++) {
                            desenharPlaneta(quad.planetas[i].x, quad.planetas[i].y, quad.planetas[i].g, quad.planetas[i].cor)

                        }
                        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `map.png`)

                        msg.author.send(attachment)

                        const canvas1 = Canvas.createCanvas(1300, 100)
                        const ctx1 = canvas1.getContext('2d');

                        let linha = 0
                        for (let i = 0; i < quad.planetas.length; i++) {
                            ctx1.fillStyle = quad.planetas[i].cor
                            ctx1.fillRect(linha, 0, 100, 100)
                            ctx1.fillStyle = '#000000'
                            ctx1.font = '30px Sans-serif'
                            ctx1.fillText(`ID: ${i}`, linha + 15, 65)
                            linha += 100

                        }
                        const attachment1 = new Discord.MessageAttachment(canvas1.toBuffer(), `map.png`)

                        msg.author.send(attachment1)
                    } else {
                        mes.reactions.removeAll()
                        const quest = new Discord.MessageEmbed()
                            .setColor(corNeutra)
                            .setTitle('Você quer explorar este planeta?')
                            .setDescription(`Isso custará ${Math.floor(quad.planetas[i].g / 10) + ficha.nave.motor.att} de combustível, e levará **${100 / ficha.nave.motor.att}** minutos`)
                            .addField(`Probabilidade de ter os recursos`, `Nome: ${quad.planetas[i].nome}\nAtmosfera: 20%\nOxigênio: 4%\nÁgua: 4%\nVida: 0.8%\nRecursos: 50%`)


                        const going = new Discord.MessageEmbed()
                            .setColor(corNeutra)
                            .setTitle('Explorando um planeta')
                            .setDescription(`Você será alertado daqui há **${100 / ficha.nave.motor.att}** minutos`)

                        const fim = new Discord.MessageEmbed()
                            .setColor(corNeutra)
                            .setTitle(`Você terminou de explorar ${quad.planetas[i].nome}`)
                            .addField(`Relatório do planeta`, `Nome: ${quad.planetas[i].nome}\nAtmosfera: ${quad.planetas[i].atmosfera[1]}\nOxigênio: ${quad.planetas[i].oxigenio[1]}%\nÁgua: ${quad.planetas[i].agua[1]}\nVida: ${quad.planetas[i].vida[1]}\nRecursos: ${quad.planetas[i].recursos[1]}`)

                        mes.edit(quest).then(mes => {
                            mes.react('🔍')

                            const filter = (reaction, user) => {
                                return ['🔍'].includes(reaction.emoji.name) && user.id === id;
                            }

                            mes.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                                const reaction = collected.first();

                                if (reaction) {
                                    if (ficha.combustivel[0] < Math.floor(quad.planetas[i].g / 10) + ficha.nave.motor.att) return msg.reply('Você não tem combustível o suficiente, compre mais')
                                    if (ficha.status !== 'none') return msg.reply(`Você não pode explorar um planeta enquanto está ${ficha.status}`)
                                    if (quad.planetas[i].explorado.includes(id)) return msg.reply('Você já explorou este planeta')

                                    mes.edit(going)
                                    ficha.combustivel[0] -= Math.floor(quad.planetas[i].g / 10) + ficha.nave.motor.att
                                    ficha.nave.motor.dur--
                                    ficha.status = `explorando o ${quad.planetas[i].nome}`
                                    setTimeout(() => {
                                        ficha.status = `none`
                                        msg.author.send(fim)
                                        quad.planetas[i].explorado.push(id)

                                    }, 60 * (120 / ficha.nave.motor.att) * 1000);
                                }
                            })
                        })
                    }
                })
            })
        }
        function desenharPlaneta(x, y, g, cor) {
            ctx.fillStyle = cor
            ctx.beginPath()
            ctx.arc(x, y, g / 10, 0, 2 * Math.PI)
            ctx.fill();
            ctx.closePath();
        }
    }
}