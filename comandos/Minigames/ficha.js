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

        let energia = `${ficha.energia[0]}/${ficha.energia[1]}`
        let oxigenio = `${ficha.oxigenio[0]}/${ficha.oxigenio[1]}`

        if(ficha.inside == false){
            energia = `${ficha.energia[2]}/${ficha.energia[3]} (traje)`
            oxigenio = `${ficha.oxigenio[2]}/${ficha.oxigenio[3]} (traje)`

        }

        const embed = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle(`Relatório de bordo de ${msg.author.username}`)
            .addFields(
                {name: 'Relatório pessoal:',value:`HP: \`${ficha.hp}\`\n\nDinheiro: \`${ficha.money}\`\nQuadrante: \`${ficha.quadrante}\`\nPlaneta: \`${ficha.planeta}\`\nStatus: \`${ficha.status}\`\nNa nave: \`${ficha.inside}\`\nFome: \`${ficha.fome}%\`\nSede: \`${ficha.sede}%\`\nSono: \`${ficha.sono}%\``},
                {name: 'Recursos',value: `Energia: \`${energia}\`\nHidrogênio: \`${ficha.combustivel[0]}/${ficha.combustivel[1]}\`\nOxigênio: \`${oxigenio}\`\n Água: \`${ficha.agua[0]}/${ficha.agua[1]}\`\nFragmentos: \`${ficha.fragmento}\``},
                {name: `Nave ${ficha.nave.nome}:`,value:`\nMotor **${ficha.nave.motor.nome}**: \`${ficha.nave.motor.att}\` de Velocidade\nEstado: \`${ficha.nave.motor.dur}%\`\n\nGerador **${ficha.nave.gerador.nome}**: \`${ficha.nave.gerador.att}\` de eficiência\nEstado: \`${ficha.nave.gerador.dur}%\`\n\nCatalisador de O2 **${ficha.nave.catalisador.nome}**: \`${ficha.nave.catalisador.att}\` de eficiência\nEstado: \`${ficha.nave.catalisador.dur}%\`\n\nExtrator planetário **${ficha.nave.extrator.nome}**: \`${ficha.nave.extrator.att}\` de coleta\nEstado: \`${ficha.nave.extrator.dur}%\``},
                {name: `Traje ${ficha.traje.nome}`,value: `\nArma ${ficha.traje.arma.nome}: \`${ficha.traje.arma.att}/${ficha.traje.atkMax}\`\nEstado: \`${ficha.traje.arma.dur}\`\n\nEscudo ${ficha.traje.defesa.nome}: \`${ficha.traje.defesa.att}/${ficha.traje.defMax}\`\nEstado: \`${ficha.traje.defesa.dur}\``}
            );

        msg.author.send(embed)
        msg.react('📨')

    }

}
