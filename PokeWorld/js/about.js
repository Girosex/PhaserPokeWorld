let aboutstate = {
    preload: preloadAssets,
    create: initGame,
    update: updateGame
};

function preloadAssets() {
    game.load.image("fondoAbout", "assets/imgs/aboutGame.jpg");
    game.load.image("atrasAbout", "assets/imgs/atrasGame.png");
}

function initGame() {
    fondoAbout = game.add.image(0, 0, "fondoAbout");
    fondoAbout.scale.setTo(0.6);
    
    atrasAbout = game.add.button(10, 690, "atrasAbout", VolverAtrasDelAbout);
    atrasAbout.scale.setTo(0.1);

    let textTitle2 = '\n\nThis game is about typing the words \nwhich are appearing as fast as you \ncan, avoiding the wild pokemons to \nreach our poke-trainer. \n\n\n\n\nLegenDaddys\n\n\n\n\nAdrian Stoican \nSergio Juan Perez Jiménez \nAlejandro Nortes del Rio-Hortega';
    let styleTitle2 = {
        font: "bold 26px Arial",
        fill: "white",
        align: "center"
    };
    let textTitle1 = 'ABOUT\n\n\n\n\n\nGROUP\n\n\n\nDeveloped by';
    let styleTitle1 = {
        font: "bold 34px italic",
        fill: "pink",
        align: "center"
    };

    game.add.text(50, 20, textTitle2, styleTitle2);
    game.add.text(145, 30, textTitle1, styleTitle1);

    textTitle2.boundsAlignH = 'center';
    textTitle1.boundsAlignH = 'center';
}

function p(pointer) {
    console.log(pointer.event);
}

function updateGame() {
    botonAtrasAbout();
}

function botonAtrasAbout() {
    if (atrasAbout.input.pointerOver())
    {
        atrasAbout.scale.setTo(0.11);
    }
    else
    {
        atrasAbout.scale.setTo(0.1);
    }
}

function VolverAtrasDelAbout() {
    game.state.start('menu');
}