let statsbstate = {
    preload: preloadAssets,
    create: initStatsB,
    update: updateStatsB
};

function preloadAssets() {
    game.load.image("fondoGame", "assets/imgs/gamePlay.jpg");
    game.load.image("atrasStatsB", "assets/imgs/atrasGameW.png");
    game.load.image("tabla", "assets/imgs/tablaPunt.png");
    game.load.image("resumeB", "assets/imgs/resume.png");
}

function initStatsB() {
    console.log(game.state)
    fondoGame = game.add.image(0, -200, "fondoGame");
    fondoGame.scale.setTo(0.8);

    tablaPunts = game.add.image(100, 150, "tabla");

    nwave = game.add.text(200, 200, 'Wave ' + waves[n].wave, { fontSize: '40px', fill: '#252850' });
    tiempoTardado = game.add.text(130, 260, 'Time: ' + tiempo, { fontSize: '40px', fill: '#FFFFFF' });
    numeroAciertos = game.add.text(130,320, 'Score: ' + aciertos, { fontSize: '40px', fill: '#FFFFFF' });
    accuracy = Math.round(aciertos / (aciertos+fallos)* 100);
    precision = game.add.text(130, 380, 'Accuracy: ' + accuracy + '%', { fontSize: '40px', fill: '#FFFFFF' });

    n += 1;

    resumeB = game.add.button(150, 500, "resumeB", resumeWaves);

    atrasStatsB = game.add.button(10, 690, "atrasStatsB", VolverAtrasDeStatsB);
    atrasStatsB.scale.setTo(0.1);
}

function p(pointer) {
    console.log(pointer.event);
}

function updateStatsB() {
    botonAtrasStatsB();
}

function resumeWaves() {
    if(n == 4) game.state.start('gameover');
    else game.state.start('waves');
}

function botonAtrasStatsB() {
    if (atrasStatsB.input.pointerOver())
    {
        atrasStatsB.scale.setTo(0.11);
    }
    else
    {
        atrasStatsB.scale.setTo(0.1);
    }
}

function VolverAtrasDeStatsB() {
    game.state.start('menu');
}