//Bibliotecas
const Discord = require('discord.js');
const c = new Discord.Client();
const { corNeutra, corVic, corDer } = require('../../database/geral.json')
c.perfil = require('../../database/perfil.json')
c.multiplayer = require('../../database/multiplayer.json')

module.exports = {
   name: 'slots',
   aliases: ['slot'],
   description: 'Aposte no caça níqueis',
   args: true,
   usage: '<aposta>',
   execute(msg, args) {
      const amount = Math.floor(args[0])
      var lucro = -amount

      const id = msg.author.id

      const init = new Discord.MessageEmbed()
         .setColor(corNeutra)
         .setTitle('Slots')
         .setDescription(`aposte no caça níqueis`)

         msg.channel.send(init).then(mes=>{
            mes.react('🪙')

            const filter = (reaction, user) => {
                return ['🪙'].includes(reaction.emoji.name) && user.id === id;
            }

            mes.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                const reaction = collected.first();
                if(reaction){
                   roletar(mes)

                }
                reaction.users.remove(msg.author.id)

            })
            
         })
      function roletar(mes) {
         const emojis = ['🍒', '🍋', '🍊', '🍺', '🔔', '💎', '🤑']

         const slot = [Math.floor(Math.random() * emojis.length), Math.floor(Math.random() * emojis.length), Math.floor(Math.random() * emojis.length)]
         var slots = ['⬛️', '⬛️', '⬛️']
         var i = 0
         var sus = true

         var a = setInterval(() => {
            if (amount < 0 || amount > c.perfil[id].money || isNaN(amount)) {
               msg.channel.send(`Você não tem dinheiro o suficiente :(`)
               return clearInterval(a)
            }
            console.log(i)
            if(i > 3) return clearInterval(a)
            if (i == 3) {
               if (slot[0] == slot[1] || slot[0] == slot[2]) {
                  lucro = Math.floor((slot[0] * slot[0]) * amount / 10)

               }if (slot[1] == slot[2]) {
                  lucro = Math.floor((slot[1] * slot[1]) * amount / 10)
               }
               if (slot[0] == slot[1] && slot[0] == slot[2] && slot[1] == slot[2]) {
                  lucro = Math.floor((slot[0] * slot[0] * slot[0]) * amount / 10)

               }
               c.perfil[id].money += lucro
               c.multiplayer -= lucro
               if(lucro <= 0){
                  i ++
                  const falha = new Discord.MessageEmbed()
                  .setColor(corDer)
                  .setTitle('Slots')
                  .setDescription(`${slots[0]} ${slots[1]} ${slots[2]}\nVocê perdeu`)

                  mes.edit(falha).then(mes=>{
                     mes.react('🪙')
         
                     const filter = (reaction, user) => {
                         return ['🪙'].includes(reaction.emoji.name) && user.id === id;
                     }
         
                     mes.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                         const reaction = collected.first();
                         if(reaction){
                            roletar(mes)
         
                         }
                         reaction.users.remove(msg.author.id)
         
                     })
                     
                  })
                  return clearInterval(a)
               }
               i ++
               const acerto = new Discord.MessageEmbed()
               .setColor(corVic)
               .setTitle('Slots')
               .setDescription(`${slots[0]} ${slots[1]} ${slots[2]}\nVocê ganhou ${lucro}`)

               mes.edit(acerto).then(mes=>{
                  mes.react('🪙')
      
                  const filter = (reaction, user) => {
                      return ['🪙'].includes(reaction.emoji.name) && user.id === id;
                  }
      
                  mes.awaitReactions(filter, { max: 1, time: 150000, errors: ['time'] }).then(collected => {
                      const reaction = collected.first();
                      reaction.users.remove(msg.author.id)
                      if(reaction){
                         roletar(mes)
                      }
                  })
               })

               return clearInterval(a)
            }

            const roleta = new Discord.MessageEmbed()
               .setColor(corNeutra)
               .setTitle('Slots')
               .setDescription(`${slots[0]} ${slots[1]} ${slots[2]}`)

            slots[i] = emojis[slot[i]]
            mes.edit(roleta)
            i++

         }, 1000);
      }
   }
}