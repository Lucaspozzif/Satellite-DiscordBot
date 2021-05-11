//Bibliotecas
const Discord = require('discord.js');
const c = new Discord.Client();
const { corNeutra, corVic, corDer } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json')
c.multiplayer = require('../../database/multiplayer.json')

module.exports = {
    name: 'slots',
    aliases: ['slot','s'],
    description: 'aposte no caça níqueis',
    args: true,
    usage: '<amount>', 
    execute(message, args){
   
       const id = message.author.id;
       const amount = Math.floor(args[0])
 
       if (amount < 0 || amount > c.perfil[id].money || isNaN(amount)) {
        msg.channel.send(`Você não tem dinheiro o suficiente :(`)
        return
    }
 
       const n1 = Math.floor(Math.random()*7)+1;
       const n2 = Math.floor(Math.random()*7)+1;
       const n3 = Math.floor(Math.random()*7)+1;
       const emojih = ['','🧨','🥔','🍒','🎮','🪙','💎','🤑']
 
       var lucro = 0
       var sus = true
 
       if(n1 == n2 || n1 == n3){
          lucro = Math.floor(n1*n1*aposta/10) - (aposta/2)
       }else if(n2 == n3){
          lucro = Math.floor(n2*n2*aposta/10) - (aposta/2)
       }else if(n1 == n2== n3){
          lucro = Math.floor(n1*n1*n1*aposta/10) - (aposta/2)
       }else{
          lucro = -aposta
          sus = false
       }
 
       const inicio = new Discord.MessageEmbed()
       .setColor(corNeutro)
       .setTitle(trad.estagio)
       .setDescription(`(...)(...)(...)`);
 
       const estagio1 = new Discord.MessageEmbed()
       .setColor(corNeutro)
       .setTitle(trad.estagio)
       .setDescription(`(${emojih[n1]})(...)(...)`);
 
       const estagio2 = new Discord.MessageEmbed()
       .setColor(corNeutro)
       .setTitle(trad.estagio)
       .setDescription(`(${emojih[n1]})(${emojih[n2]})(...)`);
 
       const estagio3 = new Discord.MessageEmbed()
       .setColor(corNeutro)
       .setTitle(trad.estagio)
       .setDescription(`(${emojih[n1]})(${emojih[n2]})(${emojih[n3]})`);
 
       const vitoria = new Discord.MessageEmbed()
       .setColor(corSucesso)
       .setTitle(trad.estagio)
       .setDescription(`(${emojih[n1]})(${emojih[n2]})(${emojih[n3]})\n${trad.vitoria.descricao} **${lucro} ${emoji[3]} moedas**`)
       .setFooter(trad.vitoria.rodape);
 
       const derrota = new Discord.MessageEmbed()
       .setColor(corDerrota)
       .setTitle(trad.estagio)
       .setDescription(`(${emojih[n1]})(${emojih[n2]})(${emojih[n3]})\n${trad.derrota.descricao} **${-lucro} ${emoji[3]} moedas**`)
       .setFooter(trad.derrota.rodape)
 
       message.channel.send(inicio).then((msg) => {
          setTimeout(() => {msg.edit(estagio1)},1000)
          setTimeout(() => {msg.edit(estagio2)},2000)
          setTimeout(() => {msg.edit(estagio3)},3000)
          if(!isNaN(aposta)){
          c.perfil [id].money = money + lucro
          }
          if(lucro > 0){
             setTimeout(() => {msg.edit(vitoria)},4000)
             msg.react(emoji[3])
          }else{
             setTimeout(() => {msg.edit(derrota)},4000)
             msg.react(emoji[3])
          }
       })
    }
 }
 