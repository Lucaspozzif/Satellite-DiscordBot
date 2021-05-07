//Bibliotecas
const Discord = require('discord.js');
const c = new Discord.Client();
const { corNeutra, corDer, corVic } = require('../../database/geral.json')
const { naves, canhoes, escudos, motores, geradores, catalisadores, extratores, trajes, armas, defesas, comidas, kitsReparo } = require('../../database/lojas.json')
c.perfil = require('../../database/perfil.json')

module.exports = {
    name: 'loja',
    aliases: ['shop'],
    description: 'Acesse as lojas do jogo',
    execute(msg) {
        const id = msg.author.id
        const Menu1 = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle(`Loja`)
            .setDescription('Clique no emoji correspondente a área de seu interesse')
            .addFields(
                { name: 'Espaço:', value: `🇦 Naves\n🇧 Canhões\n🇨 Escudos\n🇩 Motores\n🇪 Geradores\n🇫 Catalisadores\n🇬 Extratores`, inline: true },
                { name: 'Planetas:', value: `🇭 Trajes\n🇮 Armas\n🇯 Escudos`, inline: true },
                { name: 'Recursos e outros:', value: `🇰 Comida\n🇱 Água\n🇲 Kit de primeiros socorros\n🇳 Fragmentos\n🇴 Kit de reparo` }
            );



        msg.channel.send(Menu1).then(mes => {
            menuInicial(mes)
        })

        function menuInicial(mes) {

            mes.edit(Menu1).then(mes => {
                mes.react('🇦');
                mes.react('🇧');
                mes.react('🇨');
                mes.react('🇩');
                mes.react('🇪');
                mes.react('🇫');
                mes.react('🇬');
                mes.react('🇭');
                mes.react('🇮');
                mes.react('🇯');
                mes.react('🇰');
                mes.react('🇱');
                mes.react('🇲');
                mes.react('🇳');
                mes.react('🇴');

                const filter = (reaction, user) => {
                    return ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴'].includes(reaction.emoji.name) && user.id === id;
                }

                mes.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();
                    const i = 0

                    if (reaction.emoji.name == '🇦') escolherNave(mes, 0)
                    if (reaction.emoji.name == '🇧') escolherApendice(mes, 0, canhoes, 'canhões', 'Dano')
                    if (reaction.emoji.name == '🇨') escolherApendice(mes, 0, escudos, 'escudos', 'Defesa')
                    if (reaction.emoji.name == '🇩') escolherApendice(mes, 0, motores, 'motores', 'Velocidade')
                    if (reaction.emoji.name == '🇪') escolherApendice(mes, 0, geradores, 'geradores', 'Geração')
                    if (reaction.emoji.name == '🇫') escolherApendice(mes, 0, catalisadores, 'catalisadores', 'Filtragem')
                    if (reaction.emoji.name == '🇬') escolherApendice(mes, 0, extratores, 'extratores', 'Eficiência')
                    if (reaction.emoji.name == '🇭') escolherTraje(mes, 0)
                    if (reaction.emoji.name == '🇮') escolherApendice(mes, 0, armas, 'armas', 'Dano')
                    if (reaction.emoji.name == '🇯') escolherApendice(mes, 0, defesas, 'escudos portáteis', 'Defesa')
                    if (reaction.emoji.name == '🇰') escolherComida(mes, 0)
                    if (reaction.emoji.name == '🇱') escolherAgua(mes, 0)
                    if (reaction.emoji.name == '🇲') escolherKitSocorros(mes)
                    if (reaction.emoji.name == '🇳') menuInicial(mes)
                    if (reaction.emoji.name == '🇴') escolherKitReparo(mes,0)
                    mes.reactions.removeAll()
                })
            })
        }
        function escolherNave(mes, i) {

            const escolhido = new Discord.MessageEmbed()
                .setTitle('Loja')
                .setColor(corNeutra)
                .setDescription('Esta é a ala de naves, veja detalhes sobre elas abaixo')
                .addFields(
                    { name: 'Nome', value: naves[i].nome },
                    { name: 'Valor', value: naves[i].valor, inline: true },
                    { name: 'Dano máximo', value: naves[i].atkMax, inline: true },
                    { name: 'Defesa máxima', value: naves[i].defMax, inline: true },
                    { name: 'HP', value: naves[i].hp },
                    { name: 'Capacidade de energia', value: naves[i].energiaMax, inline: true },
                    { name: 'Capacidade de combustível', value: naves[i].combustivelMax, inline: true },
                    { name: 'Capacidade de oxigênio', value: naves[i].oxigenioMax, inline: true },
                    { name: 'Capacidade de água', value: naves[i].aguaMax, inline: true }
                )
                .setFooter(`${i + 1}/${naves.length}`)
            mes.edit(escolhido).then(message => {
                message.react('↩️');
                message.react('⏮');
                message.react('💲');
                message.react('⏭');

                const filter = (reaction, user) => {
                    return ['↩️', '⏮', '💲', '⏭'].includes(reaction.emoji.name) && user.id === id;
                }
                message.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name == '↩️') menuInicial(mes)
                    if (reaction.emoji.name == '⏮') {
                        if (i == 0) escolherNave(mes, 0)
                        else escolherNave(mes, i - 1)
                    }
                    if (reaction.emoji.name == '💲') comprar(mes, naves[i])
                    if (reaction.emoji.name == '⏭') {
                        if (i + 1 == naves.length) escolherNave(mes, naves.length - 1)
                        else escolherNave(mes, i + 1)
                    }
                    mes.reactions.removeAll()


                })
            })
        }
        function escolherTraje(mes, i) {

            const escolhido = new Discord.MessageEmbed()
                .setTitle('Loja')
                .setColor(corNeutra)
                .setDescription('Esta é a ala de trajes, veja detalhes sobre eles abaixo')
                .addFields(
                    { name: 'Nome', value: trajes[i].nome },
                    { name: 'Valor', value: trajes[i].valor, inline: true },
                    { name: 'Dano máximo', value: trajes[i].atkMax, inline: true },
                    { name: 'Defesa máxima', value: trajes[i].defMax, inline: true },
                    { name: 'Capacidade de energia', value: trajes[i].energiaMax, inline: true },
                    { name: 'Capacidade de oxigênio', value: trajes[i].oxigenioMax, inline: true }
                )
                .setFooter(`${i + 1}/${trajes.length}`)
            mes.edit(escolhido).then(message => {
                message.react('↩️');
                message.react('⏮');
                message.react('💲');
                message.react('⏭');

                const filter = (reaction, user) => {
                    return ['↩️', '⏮', '💲', '⏭'].includes(reaction.emoji.name) && user.id === id;
                }
                message.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name == '↩️') menuInicial(mes)
                    if (reaction.emoji.name == '⏮') {
                        if (i == 0) escolherTraje(mes, 0)
                        else escolherTraje(mes, i - 1)
                    }
                    if (reaction.emoji.name == '💲') comprar(mes, trajes[i])
                    if (reaction.emoji.name == '⏭') {
                        if (i + 1 == trajes.length) escolherTraje(mes, trajes.length - 1)
                        else escolherTraje(mes, i + 1)
                    }
                    mes.reactions.removeAll()


                })
            })
        }
        function escolherApendice(mes, i, object, title, atributo) {
            const escolhido = new Discord.MessageEmbed()
                .setTitle('Loja')
                .setColor(corNeutra)
                .setDescription(`Esta é a ala de ${title}, veja detalhes abaixo`).addFields(
                    { name: 'Nome', value: object[i].nome },
                    { name: 'Valor', value: object[i].valor, inline: true },
                    { name: atributo, value: object[i].att, inline: true }
                )
                .setFooter(`${i + 1}/${object.length}`)
            mes.edit(escolhido).then(message => {
                message.react('↩️');
                message.react('⏮');
                message.react('💲');
                message.react('⏭');

                const filter = (reaction, user) => {
                    return ['↩️', '⏮', '💲', '⏭'].includes(reaction.emoji.name) && user.id === id;
                }
                message.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name == '↩️') menuInicial(mes)
                    if (reaction.emoji.name == '⏮') {
                        if (i == 0) escolherApendice(mes, 0, object, title, atributo)
                        else escolherApendice(mes, i - 1, object, title, atributo)
                    }
                    if (reaction.emoji.name == '💲') comprar(mes, object[i])
                    if (reaction.emoji.name == '⏭') {
                        if (i + 1 == object.length) escolherApendice(mes, object.length - 1, object, title, atributo)
                        else escolherApendice(mes, i + 1, object, title, atributo)
                    }
                    mes.reactions.removeAll()
                })
            })
        }
        function escolherComida(mes, i) {
            const escolhido = new Discord.MessageEmbed()
                .setTitle('Loja')
                .setColor(corNeutra)
                .setDescription(`Esta é a ala de alimentos, veja detalhes abaixo`).addFields(
                    { name: 'Nome', value: comidas[i].nome },
                    { name: 'Valor', value: comidas[i].valor, inline: true },
                    { name: 'Alimentação', value: `Fome: ${comidas[i].fome}\nSede: ${comidas[i].sede}\nSono: ${comidas[i].sono}\nHP: ${comidas[i].hp}` }
                )
                .setFooter(`${i + 1}/${comidas.length}`)
            mes.edit(escolhido).then(message => {
                message.react('↩️');
                message.react('⏮');
                message.react('💲');
                message.react('⏭');

                const filter = (reaction, user) => {
                    return ['↩️', '⏮', '💲', '⏭'].includes(reaction.emoji.name) && user.id === id;
                }
                message.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name == '↩️') menuInicial(mes)
                    if (reaction.emoji.name == '⏮') {
                        if (i == 0) escolherComida(mes, 0)
                        else escolherComida(mes, i - 1)
                    }
                    if (reaction.emoji.name == '💲') comprar(mes, comidas[i])
                    if (reaction.emoji.name == '⏭') {
                        if (i + 1 == comidas.length) escolherComida(mes, comidas.length - 1)
                        else escolherComida(mes, i + 1)
                    }
                    mes.reactions.removeAll()
                })
            })
        }
        function escolherAgua(mes, quantidade) {
            const escolhido = new Discord.MessageEmbed()
                .setTitle('Loja')
                .setColor(corNeutra)
                .setDescription(`Esta é a ala de água, veja detalhes abaixo`).addFields(
                    { name: 'Água', value: `(-) ${quantidade}💧 (+)\n$${quantidade} 🪙` },
                );

            mes.edit(escolhido).then(message => {
                message.react('↩️');
                message.react('➖');
                message.react('💲');
                message.react('➕');

                const filter = (reaction, user) => {
                    return ['↩️', '➖', '💲', '➕'].includes(reaction.emoji.name) && user.id === id;
                }
                message.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name == '↩️') menuInicial(mes)
                    if (reaction.emoji.name == '➖') {
                        if (quantidade < 10) escolherAgua(mes, 0)
                        else escolherAgua(mes, quantidade - 10)
                    }
                    if (reaction.emoji.name == '💲') {
                        if (quantidade > c.perfil[id].money) {
                            const embed = new Discord.MessageEmbed()
                                .setColor(corDer)
                                .setTitle('Você não tem dinheiro o suficiente')
                            mes.edit(embed)
                        } else {
                            const embed = new Discord.MessageEmbed()
                                .setColor(corVic)
                                .setTitle(`Você comprou ${quantidade} de água`)
                                .setDescription(`O item foi adicionado ao seu inventário`);
                            mes.edit(embed)
                            c.perfil[id].money -= quantidade
                            c.perfil[id].agua[1] += quantidade

                        }
                    }
                    if (reaction.emoji.name == '➕') escolherAgua(mes, quantidade + 10)
                    mes.reactions.removeAll()
                })
            })
        }
        function escolherKitSocorros(mes) {
            const escolhido = new Discord.MessageEmbed()
                .setTitle('Loja')
                .setColor(corNeutra)
                .setDescription(`Esta é a ala de kit de primeiros socorros, veja detalhes abaixo`).addFields(
                    { name: 'Kit de primeiros socorros', value: `Kit de primeiros socorros 💊\nHP: 100\nPreço: $100 🪙` },
                );

            mes.edit(escolhido).then(message => {
                message.react('↩️');
                message.react('💲');

                const filter = (reaction, user) => {
                    return ['↩️', '💲'].includes(reaction.emoji.name) && user.id === id;
                }
                message.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name == '↩️') menuInicial(mes);

                    if (reaction.emoji.name == '💲') {
                        if (quantidade > c.perfil[id].money) {
                            const embed = new Discord.MessageEmbed()
                                .setColor(corDer)
                                .setTitle('Você não tem dinheiro o suficiente')
                            mes.edit(embed)
                        } else {
                            const embed = new Discord.MessageEmbed()
                                .setColor(corVic)
                                .setTitle(`Você comprou Kit de primeiros socorros 💊`)
                                .setDescription(`O item foi adicionado ao seu inventário`);
                            mes.edit(embed)
                            c.perfil[id].money -= 100
                            c.perfil[id].inventario.push(
                                {
                                    nome: 'Kit de primeiros socorros 💊',
                                    cat: 'consumivel',
                                    valor: 100,
                                    fome: 0,
                                    sede: 0,
                                    sono: 10,
                                    hp: 100

                                }
                            )
                        }
                    }
                    mes.reactions.removeAll()
                })
            })

        };
        function escolherFragmentos(mes) {

        }
        function escolherKitReparo(mes, i) {
            const escolhido = new Discord.MessageEmbed()
                .setTitle('Loja')
                .setColor(corNeutra)
                .setDescription(`Esta é a ala de kits de reparo e upgrades, veja detalhes abaixo`).addFields(
                    { name: 'Nome', value: kitsReparo[i].nome },
                    { name: 'Valor', value: kitsReparo[i].valor }
                )
                .setFooter(`${i + 1}/${kitsReparo.length}`)
            mes.edit(escolhido).then(message => {
                message.react('↩️');
                message.react('⏮');
                message.react('💲');
                message.react('⏭');

                const filter = (reaction, user) => {
                    return ['↩️', '⏮', '💲', '⏭'].includes(reaction.emoji.name) && user.id === id;
                }
                message.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name == '↩️') menuInicial(mes)
                    if (reaction.emoji.name == '⏮') {
                        if (i == 0) escolherKitReparo(mes, 0)
                        else escolherKitReparo(mes, i - 1)
                    }
                    if (reaction.emoji.name == '💲') comprar(mes, kitsReparo[i])
                    if (reaction.emoji.name == '⏭') {
                        if (i + 1 == kitsReparo.length) escolherKitReparo(mes, kitsReparo.length - 1)
                        else escolherKitReparo(mes, i + 1)
                    }
                    mes.reactions.removeAll()
                })
            })
        }
        function comprar(mes, object) {
            if (object.valor > c.perfil[id].money) {
                const embed = new Discord.MessageEmbed()
                    .setColor(corDer)
                    .setTitle('Você não tem dinheiro o suficiente')
                mes.edit(embed)
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(corVic)
                    .setTitle(`Você comprou ${object.nome}`)
                    .setDescription(`O item foi adicionado ao seu inventário`);
                mes.edit(embed)
                c.perfil[id].money -= object.valor
                c.perfil[id].inventario.push(object)
            }
        }
    }
}