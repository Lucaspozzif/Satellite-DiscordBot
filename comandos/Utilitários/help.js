//Bibliotecas
const Discord = require('discord.js');
const c = new Discord.Client();
const { corNeutra } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json')

module.exports = {
    name: 'help',
    aliases: ['h'],
    description: 'Lista os comandos do bot, mostrando detalhes sobre estes',
    execute(msg, args) {
        const data = [];
        const { commands } = msg.client

        const id = msg.author.id

        if (!args.length) {
            data.push(commands.map(command => command.name).join('\n'))
            const embed = new Discord.MessageEmbed()
                .setColor(corNeutra)
                .setTitle(`Olá explorador do espaço!`)
                .setDescription(`Aqui está a lista dos comandos e detalhes sobre ele, leia para poder explorar o espaço com mais liberdade`)
                .addFields({ name: '🛰', value: data });
            return msg.author.send(embed).then(mes => {
                msg.react('📨');
            }).catch(error => { msg.reply('Não consigo acessar sua DM, acho que está havendo alguma interferência do servidor.') })
        }
        const name = args[0].toLowerCase()
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
        if (!command) {
            return msg.reply(`este comando não está listado, verifique se ele foi escrito corretamente`);
        }
        data.push(`${command.name}`);
        if (command.aliases) { data.push(`${command.aliases.join(', ')}`) }
        else { data.push('.') }
        if (command.description) { data.push(`${command.description}`) }
        else { data.push('.') }
        if (command.usage) { data.push(`${command.usage}`) }
        else { data.push('') }
        data.push(`${command.cooldown || 3}`);
        const embedInferior = new Discord.MessageEmbed()
            .setColor(corNeutra)
            .setTitle(`Então você quer saber mais sobre este comando?`)
            .addFields(
                { name: 'Nome:', value: `${data[0]}`, inline: true },
                { name: 'Aliases:', value: `${data[1]}`, inline: true },
                { name: 'Descrição:', value: `${data[2]}` },
                { name: 'Uso', value: `${c.perfil[id].prefix}${command.name} ${data[3]}`, inline: true },
                { name: 'Cooldown', value: `${data[4]} segundos`, inline: true }
            );
        msg.author.send(embedInferior).then(mes => {
            msg.react('📨');
        })
    }
}