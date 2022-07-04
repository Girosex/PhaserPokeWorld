let statsstate = {
    preload: preloadAssets,
    create: initStats,
    update: updateStats
};

function preloadAssets() {
    game.load.image("fondoGame", "assets/imgs/gamePlay.jpg");
    game.load.image("atrasStats", "assets/imgs/atrasGameW.png");
    game.load.image("tabla", "assets/imgs/tablaPunt.png");
    game.load.image("resume", "assets/imgs/resume.png");
}

function initStats() {
    fondoGame = game.add.image(0, -200, "fondoGame");
    fondoGame.scale.setTo(0.8);

    tablaPunts = game.add.image(100, 150, "tabla");

    nwave = game.add.text(200, 200, 'Wave ' + waves[n].wave, { fontSize: '40px', fill: '#252850' });
    tiempoTardado = game.add.text(130, 260, 'Time: ' + tiempo, { fontSize: '40px', fill: '#FFFFFF' });
    numeroAciertos = game.add.text(130,320, 'Score: ' + aciertos, { fontSize: '40px', fill: '#FFFFFF' });
    accuracy = Math.round(aciertos / (aciertos+fallos)* 100);
    precision = game.add.text(130, 380, 'Accuracy: ' + accuracy + '%', { fontSize: '40px', fill: '#FFFFFF' });

    n += 1;

    resume = game.add.button(150, 500, "resume", resumeGame);

    atrasStats = game.add.button(10, 690, "atrasStats", VolverAtrasDeStats);
    atrasStats.scale.setTo(0.1);
}

function p(pointer) {
    console.log(pointer.event);
}

function updateStats() {
    botonAtrasStats();
}

function resumeGame() {
    if(n == 4) game.state.start('gameover');
    else if (partNumber == 1) game.state.start('game');
    else if (partNumber = 2) game.state.start('waves');
}

function botonAtrasStats() {
    if (atrasGame.input.pointerOver())
    {
        atrasGame.scale.setTo(0.11);
    }
    else
    {
        atrasGame.scale.setTo(0.1);
    }
}

function VolverAtrasDeStats() {
    game.state.start('menu');
}