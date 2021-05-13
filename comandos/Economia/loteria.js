//Bibliotecas
const Discord = require('discord.js');
const c = new Discord.Client();
const { corNeutra, corVic, corDer } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json')
c.multiplayer = require('../../database/multiplayer.json')

module.exports = {
    name: 'loteria',
    aliases: ['lot'],
    description: 'Aposte na loteria',
    execute(msg, args) {
        const amount = Math.floor(args[0])
        const id = msg.author.id
        const saldoEmbed = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle(`Você quer comprar um bilhete da loteria?`)
            .setDescription(`O bilhete custa aproximadamente **0.1% do valor** do prêmio acumulado\nValor do bilhete: **${Math.floor(c.multiplayer.loteria / 1000) + 1}** 🪙`)
            .setFooter(`Prêmio acumulado: ${c.multiplayer.loteria}`)

        const girando = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle('Jogando... 🪙')

        msg.channel.send(saldoEmbed).then(mes => {
            mes.react('🪙')

            const filter = (reaction, user) => {
                return ['🪙'].includes(reaction.emoji.name) && user.id === id;
            }

            mes.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                const reaction = collected.first();
                reaction.users.remove(msg.author.id);
                if (reaction) {
                    if (c.perfil[id].money < Math.floor(c.multiplayer.loteria / 100)+1) {
                        msg.channel.send(`Você não tem dinheiro o suficiente :(`)
                        return
                    }

                    const bilhete = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)]
                    const loteria = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)]
                    var tense = ['x', 'x', 'x', 'x', 'x']
                    var count = 0
                    var pontos = 0
                    var amount = 0
                    var vic = true

                    var a = setInterval(() => {
                        if (count < 5) {
                            tense[count] = bilhete[count]
                            const sorteio = new Discord.MessageEmbed()
                                .setColor(corNeutra)
                                .setTitle('Loteria')
                                .setDescription(`Bilhete premiado: ${loteria[0]} ${loteria[1]} ${loteria[2]} ${loteria[3]} ${loteria[4]}\nBilhete comprado: ${tense[0]} ${tense[1]} ${tense[2]} ${tense[3]} ${tense[4]}`)        
                            mes.edit(sorteio)
                            count++
                        } else {
                            for (let i = 0; i < 5; i++) {
                                if (loteria[i] == bilhete[i]) pontos++
                            }
                            if (pontos < 3) {
                                vic = false
                            }
                            if (pontos == 3) {
                                amount = Math.floor(c.multiplayer.loteria / 1000)
                            }
                            if (pontos == 4) {
                                amount = Math.floor(c.multiplayer.loteria / 100)
                            }
                            if (pontos == 5) {
                                amount = c.multiplayer.loteria
                            }
                            const vitoria = new Discord.MessageEmbed()
                                .setColor(corVic)
                                .setTitle('Vitória!')
                                .setDescription(`Parabéns, você acertou **${pontos} de 5**\n Você ganhou ${amount}`)
        
                            const derrota = new Discord.MessageEmbed()
                                .setColor(corDer)
                                .setTitle('Derota.')
                                .setDescription(`Sinto muito, você acertou apenas **${pontos} de 5**`)
                                
                            if(vic == true){
                                c.perfil[id].money += amount
                                c.multiplayer.loteria -= amount/2
                                c.multiplayer.money -= amount/2
                                mes.edit(vitoria)
                            }else{
                                c.perfil[id].money -= Math.floor(c.multiplayer.loteria / 1000)+1
                                c.multiplayer.loteria += Math.floor(c.multiplayer.loteria / 1000)-5
                                c.multiplayer.money -= 6
                                mes.edit(derrota)
                                if(pontos == 5){
                                    c.multiplayer.money -= 10000
                                    c.multiplayer.loteria += 10000
                                }                         
                            }
                            clearInterval(a)
                        }
                    }, 1000);
                }

            })
        })
    }

}