let gameoverstate = {
    preload: preloadAssets,
    create: createGameOver,
    update: updateGameOver
};

function preloadAssets() {
    game.load.image("fondoGameOver", "assets/imgs/gameOverScreen.jpg");
    game.load.image("atrasGameOver", "assets/imgs/atrasGameW.png");
}

function createGameOver() {
    fondoGameOver = game.add.image(40, 40, "fondoGameOver");
    fondoGameOver.scale.setTo(0.5);

    atrasGameOver = game.add.button(220, 600, "atrasGameOver", VolverAtrasDelGameOver);
    atrasGameOver.scale.setTo(0.2);

    tiempoTardado = game.add.text(130, 350, 'Time: ' + totalTime, { fontSize: '40px', fill: '#FFFFFF' });
    numeroAbatidos = game.add.text(130,410, 'Downed: ' + pokemonAbatidos, { fontSize: '40px', fill: '#FFFFFF' });
    accuracy = Math.round(aciertosTotales / (aciertosTotales+fallosTotales)* 100);
    precision = game.add.text(130, 470, 'Accuracy: ' + accuracy + '%', { fontSize: '40px', fill: '#FFFFFF' });

}

function p(pointer) {
    console.log(pointer.event);
}

function updateGameOver() {

    botonAtrasGameOver();
    
}

function botonAtrasGameOver() {
    if (atrasGameOver.input.pointerOver())
    {
        atrasGameOver.scale.setTo(0.22);
    }
    else
    {
        atrasGameOver.scale.setTo(0.2);
    }
}

function VolverAtrasDelGameOver() {
    game.state.start('menu');
}