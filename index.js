//Bibliotecas do node
const Discord = require('discord.js');
const fs = require('fs');

//sla como chamar saporra
const c = new Discord.Client();
c.commands = new Discord.Collection();
c.cooldowns = new Discord.Collection();

//Bancos de dados
const { validXp, cooldownPadrao, deletar, luck } = require('./database/geral.json');
const { token } = require('./token.json')
c.perfil = require('./database/perfil.json');
c.server = require('./database/server.json');
c.quadrantes = require('./database/quadrantes.json')
c.multiplayer = require('./database/multiplayer.json')

//Encontrar comando
const commandFolders = fs.readdirSync('./comandos');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./comandos/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./comandos/${folder}/${file}`);
        c.commands.set(command.name, command);
    }
}

//Inicializador
c.once('ready', () => {
    console.log('Bot on');

    c.user.setActivity('Admire as estrelas (;help)');

    setInterval(() => {
        for (let i = 0; i < c.multiplayer.acoes.length; i++) {
            const mod = (((Math.random()*4)/10)+0.805)
            c.multiplayer.acoes[i].valor *= mod
            if(c.multiplayer.acoes[i].valor <= 1){

                c.multiplayer.acoes[i].valor = 10;
                /*
                c.multiplayer.acoes[i].comprador = []
                c.multiplayer.acoes[i].unidades = []
                */

            }
            if(c.multiplayer.acoes[i].valor > 100000){

                c.multiplayer.acoes[i].valor = 100000;
                /*
                c.multiplayer.acoes[i].comprador = []
                c.multiplayer.acoes[i].unidades = []
                */

            }
            c.multiplayer.acoes[i].valor = c.multiplayer.acoes[i].valor.toFixed(5)
        }
    }, 1);

    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            for (let k = 0; k < 16; k++) {
                let quadrante = `${i.toString(16)}${j.toString(16)}${k.toString(16)}`

                if (!c.quadrantes[quadrante]) {

                    const coresEstrela = ['#4169E1', '#6495ED', '#8B0000', '#FF8C00', '#FFA500', '#FFD700', '#FFFF00', '#FFE4B5', '#FFFAFA']
                    const corEstrela = coresEstrela[Math.floor(Math.random() * coresEstrela.length)]

                    const planeta = 3 + (Math.floor(Math.random() * 14))

                    c.quadrantes[quadrante] = {
                        estrela: {
                            nome: `Estrela ${quadrante}`,
                            x: 10 + Math.floor(Math.random() * 1004),
                            y: 10 + Math.floor(Math.random() * 700),

                            cor: corEstrela,
                        },
                        planetas: []
                    }

                    for (let l = 0; l < planeta; l++) {

                        let temAtmosfera = Math.floor(Math.random() * 5)
                        let temOxigenio = Math.floor(Math.random() * 5)
                        let temAgua = Math.floor(Math.random() * 5)
                        let temVida = Math.floor(Math.random() * 5)
                        let temRecursos = Math.floor(Math.random() * 2)

                        let atmosfera = false
                        let oxigenio = false
                        let agua = false
                        let vida = false
                        let recursos = false

                        let qtdAtmosfera = 0
                        let qtdOxigenio = 0
                        let qtdAgua = 0
                        let qtdVida = 0
                        let qtdRecursos = 0

                        let g = Math.floor(Math.random() * 200)

                        let a = [Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), Math.floor(Math.random() * 16)]

                        let cor = `#${a[0].toString(16)}${a[1].toString(16)}${a[2].toString(16)}${a[3].toString(16)}${a[4].toString(16)}${a[5].toString(16)}`

                        if (temAtmosfera == 0) {
                            atmosfera = true
                            qtdAtmosfera = Math.floor(Math.random() * 10000) + 1
                        }
                        if (atmosfera == true && temOxigenio == 0) {
                            oxigenio = true
                            qtdOxigenio = Math.floor(Math.random() * 10000) + 1
                        }
                        if (atmosfera == true && temAgua == 0) {
                            agua = true
                            qtdAgua = Math.floor(Math.random() * 10000) + 1
                        }
                        if (atmosfera == true && agua == true && temVida == 0) {
                            vida = true
                            qtdVida = Math.floor(Math.random() * 100) + 1
                        }
                        if (temRecursos == 0) {
                            recursos = true
                            qtdRecursos = Math.floor(Math.random() * 10000) + 1
                        }

                        c.quadrantes[quadrante].planetas[l] = {
                            nome: `Exoplaneta ${quadrante}-${l}`,
                            explorado: [],

                            x: 10 + (Math.random() * 1004),
                            y: 10 + (Math.random() * 700),
                            g: g,

                            cor: cor,

                            atmosfera: [atmosfera, qtdAtmosfera],
                            oxigenio: [oxigenio, qtdOxigenio],
                            agua: [agua, qtdAgua],
                            vida: [vida, qtdVida],
                            recursos: [recursos, qtdRecursos]
                        }
                    }
                    fs.writeFile('./database/quadrantes.json', JSON.stringify(c.quadrantes), err => { if (err) console.log(err) })
                    console.log(`Quadrante ${quadrante}`)

                }
            }
        }
    }
})

//Gerar e atualizar banco de dados e gerir xp
c.on('message', msg => {
    if (msg.author.bot || msg.channel.type == 'dm') return
    const id = msg.author.id;
    const serverId = msg.guild.id
    if (!c.server[serverId]) {
        c.server[serverId] = {
            members: [],
            xp: [],
            level: []
        }
    }
    for (let i = 0; i < c.multiplayer.acoes.length; i++) {
        if(!c.multiplayer.acoes[i].comprador.includes(id)){
            c.multiplayer.acoes[i].comprador.push(id)
            c.multiplayer.acoes[i].unidades.push(0)
    }

    }

    if (!c.perfil[id]) {
        let i = [Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), Math.floor(Math.random() * 16)]
        let quadrante = `${i[0].toString(16)}${i[1].toString(16)}${i[2].toString(16)}`
        c.perfil[id] = {
            //prefixo do bot
            prefix: ';',

            //Finanças
            money: 100,

            //Localização espacial
            quadrante: quadrante,
            planeta: 'none',
            status: 'none',
            inside: true,

            //Atributos dos astronautas (atributo: [conteúdoNave, capacidadeNave, conteúdoTraje ,capacidadeTraje])
            energia: [80, 80,80, 80],
            combustivel: [80, 80,80, 80],
            oxigenio: [80, 80,80, 80],
            carbono: [80, 80,80, 80],
            agua: [80, 80,80, 80],
            fragmento: 0,

            //Atributos fisiológicos
            fome: 100,
            sede: 100,
            sono: 100,
            hp: 100,

            nave: {
                nome: 'Cápsula inicial',
                cat: 'nave',
                lvl: 1,
                valor: 10000,
                hp: 1000,

                //Limites da nave, podem ser aumentados com upgrades
                energiaMax: 100,
                combustivelMax: 100,
                oxigenioMax: 100,
                carbonoMax: 100,
                aguaMax: 100,

                motor: {
                    //Usado para saltar para outros quadrantes (;jump <x> <y> <z>)
                    nome: 'propulsor pequeno de combustivel sólido',
                    cat: 'motor',
                    lvl: 1,
                    valor: 2000,
                    att: 2,
                    dur: 100

                },
                gerador: {
                    //Usado para gerar energia para a nave (;energia)
                    nome: 'solar de baixa eficiência',
                    cat: 'gerador',
                    lvl: 1,
                    valor: 2000,
                    att: 100,
                    dur: 100

                },
                catalisador: {
                    //Usado para catalizar gás oxigênio para a nave (;oxigênio)
                    nome: 'biológico',
                    cat: 'catalisador',
                    lvl: 1,
                    valor: 2000,
                    att: 100,
                    dur: 100

                },
                extrator: {
                    //Usado para coletar recursos dos planetas
                    nome: 'coletor espacial de broca',
                    cat: 'extrator',
                    lvl: 1,
                    valor: 10000,
                    att: 100,
                    dur: 100
                }

            },
            traje: {
                //Quando nave: false, os atributos do traje serão usados
                nome: 'Traje espacial básico',
                cat: 'traje',
                lvl: 1,
                valor: 5000,
                atkMax: 20,
                defMax: 20,
                energiaMax: 20,
                oxigenioMax: 20,

                arma: {
                    //Usado para defender o astronauta dos perigos dos exoplanetas
                    nome: 'arma de fragmentos',
                    cat: 'arma',
                    lvl: 1,
                    valor: 1000,
                    att: 5,
                    dur: 100
                },
                defesa: {
                    //Usado para defender o astronauta dos perigos dos exoplanetas
                    nome: 'Escudo de metal',
                    cat: 'defesa',
                    lvl: 1,
                    valor: 50,
                    att: 5,
                    dur: 100
                }

            },
            inventario: [
                {
                    nome: 'Ração espacial 🥫',
                    cat: 'consumivel',
                    valor: 30,
                    fome: 25,
                    sede: 5,
                    sono: 0,
                    hp: 0

                },
                {
                    nome: 'Kit de primeiros socorros 💊',
                    cat: 'consumivel',
                    valor: 100,
                    fome: 0,
                    sede: 0,
                    sono: 10,
                    hp: 100

                }
            ],

            //Explorações
            explorando: false,
            tempo: 0


        }
    }

    const ficha = c.perfil[id]
    var sorteio = Math.floor(Math.random() * luck)

    ficha.money = Math.floor(ficha.money)
    c.multiplayer.money = Math.floor(c.multiplayer.money)

    ficha.energia[1] = ficha.nave.energiaMax
    ficha.combustivel[1] = ficha.nave.combustivelMax
    ficha.oxigenio[1] = ficha.nave.oxigenioMax
    ficha.carbono[1] = ficha.nave.carbonoMax
    ficha.agua[1] = ficha.nave.aguaMax

    //limitadores de chão

    if (ficha.energia[0] < 0) {
        ficha.energia[0] = 0
        if (sorteio == 0) ficha.hp--
        if (ficha.inside == true) {
            msg.reply(`Acabou a energia da sua nave, ligue o seu gerador com **${ficha.prefix}energia**`)
        } else {
            msg.reply(`Acabou a energia do seu traje, retorne para a nave com **${ficha.prefix}retornar**`)
        }
    }
    if (ficha.combustivel[0] < 0) {
        ficha.combustivel[0] = 0
        msg.reply(`Acabou o seu combustível, use o extrator com **${ficha.prefix}extrair**`)
    }
    if (ficha.oxigenio[0] < 0) {
        ficha.oxigenio[0] = 0
        if (sorteio == 0) ficha.hp--
        if (ficha.inside == true) {
            msg.reply(`Acabou o oxigênio da sua nave, ligue o seu catalisador com **${ficha.prefix}oxigenio**`)
        } else {
            msg.reply(`Acabou o oxigênio do seu traje, retorne para a nave com **${ficha.prefix}retornar**`)
        }
    }
    if (ficha.carbono[0] < 0) {
        ficha.carbono[0] = 0
    }
    if (ficha.agua[0] < 0) {
        ficha.agua[0] = 0
        msg.reply(`Acabou a sua água, use o extrator com **${ficha.prefix}extrair**`)
    }
    if (ficha.fome < 0) {
        ficha.fome = 0;
        if (sorteio == 0) ficha.hp--
        msg.reply(`Você está com **faminto**, pegue algo comestível no seu **${ficha.prefix}inventario** ou compre na **${ficha.prefix}loja**`)
    }
    if (ficha.sede < 0) {
        ficha.sede = 0;
        if (sorteio == 0) ficha.hp--
        msg.reply(`Você está com **desidratado**, beba água com **${ficha.prefix}beber**`)
    }
    if (ficha.sono < 0) {
        ficha.sono = 0;
        if (sorteio == 0) ficha.hp--
        msg.reply(`Você está com **exausto**, durma com **${ficha.prefix}dormir**`)
    }
    if (ficha.hp < 0) {
        ficha.hp = 0;
        if (sorteio == 0) ficha.hp--
        msg.reply(`Você está a beira da morte, todo o será reiniciado se você morrer, use um **kit de primeiros socorros** para se curar ou compre um na **${ficha.prefix}loja** o mais rápido`)
        sorteio = Math.floor(Math.random() * luck)
        if (sorteio == 0) delete c.perfil[id]
        msg.reply('Você morreu, todo seu progresso foi deletado')
    }

    //limitadores de topo
    if (ficha.energia[1] < ficha.energia[0]) {
        ficha.energia[0] = ficha.energia[1]
    }
    if (ficha.combustivel[1] < ficha.combustivel[0]) {
        ficha.combustivel[0] = ficha.combustivel[1]
    }
    if (ficha.oxigenio[1] < ficha.oxigenio[0]) {
        ficha.oxigenio[0] = ficha.oxigenio[1]
    }
    if (ficha.carbono[1] < ficha.carbono[0]) {
        ficha.carbono[0] = ficha.carbono[1]
    }
    if (ficha.agua[1] < ficha.agua[0]) {
        ficha.agua[0] = ficha.agua[1]
    }
    if (ficha.fome > 100) {
        ficha.fome = 100
    }
    if (ficha.sede > 100) {
        ficha.sede = 100
    }
    if (ficha.sono > 100) {
        ficha.sono = 100
    }
    if (ficha.hp > 100) {
        ficha.hp = 100
    }

    //Redutores graduais

    if (msg.content.length >= validXp && sorteio == 0) {
        sorteio = Math.floor(Math.random() * 6)
        if (sorteio == 0) ficha.energia[1]--
        if (sorteio == 1) {
            ficha.oxigenio[1]--
            ficha.carbono[1]++
        }
        if (sorteio == 2) ficha.agua[0]--
        if (sorteio == 3) ficha.fome--
        if (sorteio == 4) ficha.sede--
        if (sorteio == 5) ficha.sono--

    }


    let xpAdd = Math.floor(Math.random() * 25) + 10

    if (!c.server[serverId].members.includes(id)) {
        c.server[serverId].members.push(id)
        c.server[serverId].xp.push(0)
        c.server[serverId].level.push(0)
    }

    for (let i = 0; i < c.server[serverId].members.length; i++) {

        if (id == c.server[serverId].members[i] && msg.content.length >= validXp) {
            c.server[serverId].xp[i] += xpAdd

            if (c.server[serverId].xp[i] > c.server[serverId].level[i] * c.server[serverId].level[i] * 800 + 800) {
                c.server[serverId].level[i]++
                ficha.money += Math.floor(c.server[serverId].xp[i] / 100)
                msg.reply(`parabéns, você acabou de alcançar o nível ${c.server[serverId].level[i]}! leve ${Math.floor(c.server[serverId].xp[i] / 100)}$ como presente`)
                return
            }

        }

    }

    //Salvar
    fs.writeFile('./database/perfil.json', JSON.stringify(c.perfil), (err) => { if (err) console.log(err) })
    fs.writeFile('./database/server.json', JSON.stringify(c.server), (err) => { if (err) console.log(err) })
})

//Executar comandos
c.on('message', msg => {
    if (msg.author.bot || msg.channel.type == 'dm') return

    const id = msg.author.id;
    const serverId = msg.guild.id;

    if (!msg.content.startsWith(c.perfil[id].prefix)) {
    } else {
        const args = msg.content.slice(c.perfil[id].prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = c.commands.get(commandName)
            || c.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

        if (!command) {
            msg.channel.send(`Não consegui encontrar **${msg.content}**. :(`).then(mes => {
                mes.delete({ timeout: deletar * 1000 })
                msg.delete({ timeout: deletar * 1000 })
            })
            return
        }

        if (command.permissions) {
            const authorPerms = msg.channel.permissionsFor(msg.author);
            if (!authorPerms || !authorPerms.has(command.permissions))
                msg.channel.send(`Parado aí membro comum, você não pode fazer isso! Apenas o **Adm** tem tais poderes`).then(mes => {
                    mes.delete({ timeout: deletar * 1000 })
                    msg.delete({ timeout: deletar * 1000 })
                })
        }
        if (command.args && !args.length) {
            let reply = `Este comando precisa de argumentos`

            if (command.usage) {
                reply += `, o uso correto é **${c.perfil[id].prefix}${command.name} ${command.usage}**.`
            }
            return msg.channel.send(reply).then(mes => {
                mes.delete({ timeout: deletar * 1000 })
                msg.delete({ timeout: deletar * 1000 })
            })
        }

        const { cooldowns } = c;
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection())
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || cooldownPadrao) * 1000;

        if (timestamps.has(id)) {
            const expirationTime = timestamps.get(id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;

                let horas = Math.floor(timeLeft / 3600)
                let minutos = Math.floor(timeLeft / 60) - horas * 60
                let segundos = Math.floor(timeLeft) - horas * 3600 - minutos * 60

                return msg.reply(`para usar este comando novamente, aguarde **${horas}:${minutos}:${segundos}**`).then(mes => {
                    mes.delete({ timeout: timeLeft * 1000 })
                    msg.delete({ timeout: timeLeft * 1000 })
                })
            }
        }
        timestamps.set(id, now);
        setTimeout(() => { timestamps.delete(id) }, cooldownAmount);

        try {
            command.execute(msg, args)
        } catch (error) {
            console.error(`${msg.content}\n\n\n${error}`);
            msg.reply(`Houve um erro ao executar este comando, tente mais tarde`).then(mes => {
                mes.delete({ timeout: deletar * 1000 })
                msg.delete({ timeout: deletar * 1000 })
            })
        }
    }
    //Salvar
    fs.writeFile('./database/perfil.json', JSON.stringify(c.perfil), (err) => { if (err) console.log(err) })
    fs.writeFile('./database/server.json', JSON.stringify(c.server), (err) => { if (err) console.log(err) })
    fs.writeFile('./database/quadrantes.json', JSON.stringify(c.quadrantes), (err) => { if (err) console.log(err) })
    fs.writeFile('./database/multiplayer.json', JSON.stringify(c.multiplayer), (err) => { if (err) console.log(err) })

})

//login
c.login(token)

//Funções