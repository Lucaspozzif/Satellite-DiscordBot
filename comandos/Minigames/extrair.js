const Discord = require('discord.js');
const c = new Discord.Client();
const { corNeutra, corDer, corVic } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json')
c.multiplayer = require('../../database/multiplayer.json')
c.quadrantes = require('../../database/quadrantes.json')

module.exports = {
    name: 'extrair',
    aliases: ['extract'],
    description: 'Equipe, use, coma ou qualquer outra coisa do seu inventário',
    args: true,
    usage: '<material>',
    execute(msg, args) {
        const id = msg.author.id
        const ficha = c.perfil[id]
        if (ficha.planeta == 'none') return msg.reply('Aterrize em um planeta antes de extrair seus recursos (;pousar <idPlaneta>)')
        if (ficha.status !== 'none') return msg.reply(`Você não pode extrair recursos em um planeta enquanto está **${ficha.status}**`)
        if (ficha.energia[0] <= 0) return msg.reply(`Você não pode extrair recursos em um planeta **sem energia**, recarregue`)
        const quad = c.quadrantes[ficha.quadrante].planetas[ficha.planeta.split('-')[1]]

        let recurso = args[0]
        let coletar = ficha.nave.extrator.att
        let org = 0
        let coletado = false

        if (recurso == 'atmosfera' || recurso == 'hidrogenio' || recurso == 'hidrogênio' || recurso == 'ar') {
            org = 1
            coletado = ficha.combustivel[0]
        }
        if (recurso == 'oxigenio' || recurso == 'oxigênio') {
            org = 2
            coletado = ficha.oxigenio[0]
        }
        if (recurso == 'agua' || recurso == 'água') {
            org = 3
            coletado = ficha.agua[0]
        }
        if (recurso == 'recurso' || recurso == 'recursos' || recurso == 'fragmentos' || recurso == 'fragmento') {
            org = 4
            coletado = ficha.fragmento
        }

        if (org == 0) return msg.reply('Escolha um recurso para extrair: ar, oxigenio, água ou recursos')

        const embed = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle(`Você vai extrair ${recurso}`)
            .setDescription(`Você passará **uma hora** para conseguir extrair **${coletar}** unidades deste recurso\nQuer continuar? Isso também consumirá **${Math.floor(coletar / 10)}** de energia`)

        msg.channel.send(embed).then(mes => {
            mes.react('⛏');
            mes.react('❌');


            const filter = (reaction, user) => {
                return ['⛏', '❌'].includes(reaction.emoji.name) && user.id === id;
            }

            mes.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                const reaction = collected.first();
                mes.reactions.removeAll()

                if (reaction.emoji.name === '⛏') {
                    const extraindo = new Discord.MessageEmbed()
                        .setColor(corNeutra)
                        .setTitle(`Extraindo ${recurso}`)
                        .setDescription('Você será avisado dentro de uma hora')

                    ficha.energia[0] -= Math.floor(coletar / 10)
                    if (org == 1) {
                        if (quad.atmosfera[1] < coletar) coletar = quad.atmosfera[1]
                        quad.atmosfera[1] -= coletar
                    }
                    if (org == 2) {
                        if (quad.oxigenio[1] < coletar) coletar = quad.oxigenio[1]
                        quad.oxigenio[1] -= coletar
                    }
                    if (org == 3) {
                        if (quad.agua[1] < coletar) coletar = quad.agua[1]
                        quad.agua[1] -= coletar
                    }
                    if (org == 4) {
                        if (quad.recursos[1] < coletar) coletar = quad.recursos[1]
                        quad.recursos[1] -= coletar
                    }

                    ficha.status = `coletando ${recurso} em ${quad.nome}`

                    mes.edit(extraindo)

                    setTimeout(() => {
                        if (org == 1) {
                            ficha.combustivel[0] += coletar
                        }
                        if (org == 2) {
                            ficha.oxigenio[0] += coletar
                        }
                        if (org == 3) {
                            ficha.agua[0] += coletar
                        }
                        if (org == 4) {
                            ficha.fragmento += coletar
                        }

                        msg.author.send('A sua coleta foi concluida!\nEncontre os itens coletados na sua ficha')
                        ficha.status = 'none'

                    }, 3600000);


                } else {
                    return mes.edit(cancelar)
                }
            })
        })
    }
}