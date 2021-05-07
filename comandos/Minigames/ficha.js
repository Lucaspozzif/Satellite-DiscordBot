//Bibliotecas
const Discord = require('discord.js');
const c = new Discord.Client();
const { corNeutra, corVic, corDer } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json');
c.server = require('../../database/server.json')

module.exports = {
    name: 'ficha',
    aliases: [''],
    description: 'Acesse sua ficha e veja seus itens',
    execute(msg) {

        const id = msg.author.id;
        const ficha = c.perfil[id]

        var xp = 0;
        var lvl = 0

        for (let i = 0; i < c.server[msg.guild.id].members.length; i++) {
            if (id == c.server[msg.guild.id].members[i]) {
                xp = c.server[msg.guild.id].xp[i]
                lvl = c.server[msg.guild.id].level[i]

            }
        }

        const embed = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle(`Relatório de bordo de ${msg.author.username}`)
            .addFields(
                { name: 'Status do tripulante', value: `Status: ${ficha.status}\nHP 🩸: ${ficha.hp}%\nFome 🍜: ${ficha.fome}%\nSede 🥤: ${ficha.sede}%\nSono 🛏: ${ficha.sono}%\n\nNa nave 🚀: ${ficha.inside}` },
                { name: 'Status da Nave', value: `Nome: ${ficha.nave.nome}\n Nível: ${ficha.nave.lvl}\nQuadrante 🌌: ${ficha.x}${ficha.y}${ficha.z}\nPlaneta 🪐: ${ficha.planeta}\nEnergia ⚡️: ${ficha.energia[1]}/${ficha.energia[0]}\nCombustível 🛢: ${ficha.combustivel[1]}/${ficha.combustivel[0]}\nOxigênio 💨: ${ficha.oxigenio[1]}/${ficha.oxigenio[0]} (outros gases: ${ficha.carbono[1]})\nÁgua 💧: ${ficha.agua[1]}/${ficha.agua[0]}` },
                { name: 'Apêndices da Nave', value: `Canhão ${ficha.nave.canhao.nome} ⚙️: ${ficha.nave.canhao.att} de dano\nEstado: ${ficha.nave.canhao.dur}%\n\nEscudo ${ficha.nave.escudo.nome} 🛡: ${ficha.nave.escudo.att} de defesa\nEstado: ${ficha.nave.escudo.dur}%\n\nMotor ${ficha.nave.motor.nome} 🚀: ${ficha.nave.motor.att} de velocidade\nEstado: ${ficha.nave.motor.dur}%\n\nGerador ${ficha.nave.gerador.nome} 🔋: ${ficha.nave.gerador.att} de energia\nEstado: ${ficha.nave.gerador.dur}%\n\nCatalisador ${ficha.nave.catalisador.nome} 🧫: ${ficha.nave.catalisador.att} de oxigênio\nEstado: ${ficha.nave.catalisador.dur}%\n\nExtrator ${ficha.nave.extrator.nome} 🔩: ${ficha.nave.extrator.att} de eficiência\nEstado: ${ficha.nave.extrator.dur}%` }
            );

        msg.author.send(embed)
        msg.react('📨')

    }

}
