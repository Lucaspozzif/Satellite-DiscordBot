//Bibliotecas
const Discord = require('discord.js');
const c = new Discord.Client();
const { corNeutra, corVic, corDer } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json')
c.multiplayer = require('../../database/multiplayer.json')

module.exports = {
    name: 'bicho',
    aliases: ['bixo'],
    description: 'aposte no jogo do bicho',
    args: true,
    usage: '<aposta>',
    execute(msg, args) {
        const amount = Math.floor(args[0])
        const id = msg.author.id
        const saldoEmbed = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle(`Aposte no jogo do bicho`)
            .addFields(
                { name: 'Escolha entre estes:', value: '🦅\n🦋\n🐕\n🐐\n🐫\n🐍\n🐇\n🐎\n🐘\n🐓',inline: true },
                { name: 'Escolha entre estes:', value: '🐈\n🐊\n🐒\n🐖\n🦚\n🦃\n🐂\n🐅\n🦌\n🐄',inline: true }
            )
            .setFooter('O prêmio é dez vezes a aposta')

        const girando = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle('Escolhendo... 🪙')

        if (amount < 0 || amount > c.perfil[id].money || isNaN(amount)) {
            msg.channel.send(`Você não tem dinheiro o suficiente :(`)
            return
        }
        msg.channel.send(saldoEmbed).then(mes => {
            mes.react('🦅')
            mes.react('🦋')
            mes.react('🐕')
            mes.react('🐐')
            mes.react('🐫')
            mes.react('🐍')
            mes.react('🐇')
            mes.react('🐎')
            mes.react('🐘')
            mes.react('🐓')
            mes.react('🐈')
            mes.react('🐊')
            mes.react('🐒')
            mes.react('🐖')
            mes.react('🦚')
            mes.react('🦃')
            mes.react('🐂')
            mes.react('🐅')
            mes.react('🦌')
            mes.react('🐄')



            const filter = (reaction, user) => {
                return ['🦅', '🦋', '🐕', '🐐', '🐫', '🐍', '🐇', '🐎', '🐘', '🐓', '🐈', '🐊', '🐒', '🐖', '🦚', '🦃', '🐂', '🐅', '🦌', '🐄'].includes(reaction.emoji.name) && user.id === id;
            }

            mes.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                const reaction = collected.first();
                const aposta = Math.floor(Math.random() * 20)

                const bixos = ['🦅', '🦋', '🐕', '🐐', '🐫', '🐍', '🐇', '🐎', '🐘', '🐓', '🐈', '🐊', '🐒', '🐖', '🦚', '🦃', '🐂', '🐅', '🦌', '🐄']

                var vic = false;

                if(bixos[aposta] == reaction){
                    vic = true
                }

                if (vic == true) {
                    c.perfil[id].money += amount*10
                    c.multiplayer.money -= amount*10
                    var result = new Discord.MessageEmbed()
                        .setColor(corVic)
                        .setTitle(`Parabéns! Caiu no **${bixos[aposta]}**, você ganhou **${amount*10}$** 🪙`)
                } else {
                    c.perfil[id].money -= amount
                    c.multiplayer.money += amount
                    result = new Discord.MessageEmbed()
                        .setColor(corDer)
                        .setTitle(`Sinto muito. Caiu no **${bixos[aposta]}**, você perdeu **${amount}$** 🪙`)
                }
                reaction.users.remove(msg.author.id)

                mes.edit(girando)
                setTimeout(() => {
                    mes.edit(result)
                }, 2000);

            }).catch((e) => { e })
        })
    }

}