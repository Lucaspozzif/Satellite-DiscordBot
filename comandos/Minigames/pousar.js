//Bibliotecas
const Discord = require('discord.js');
const Canvas = require('canvas')
const c = new Discord.Client();
const { corNeutra, corDer, corVic } = require('../../database/geral.json')
c.quadrantes = require('../../database/quadrantes.json')
c.perfil = require('../../database/perfil.json')

module.exports = {
    name: 'pousar',
    aliases: ['aterrisar','pou'],
    description: 'Pouse nos planetas para poder interagir com eles',
    execute(msg) {

        const id = msg.author.id
        const ficha = c.perfil[id]
        const quad = c.quadrantes[ficha.quadrante]

        if(ficha.planeta !== 'none'){
            
        }



    }
}