let mainstate = {
    preload: preloadAssets,
    create: initGame,
    update: updateGame
};

var partNumber = 0;

function preloadAssets() {
    game.load.image("bg", "assets/imgs/bg.jpg");

    game.load.image("botonPlay", "assets/imgs/botonPlay.png");
    game.load.image("botonAbout", "assets/imgs/botonAbout.png");
    game.load.image("botonWaves", "assets/imgs/botonWaves.png");

    game.load.image("botonPlayNaranja", "assets/imgs/botonPlayNaranja.png");
    game.load.image("botonAboutNaranja", "assets/imgs/botonAboutNaranja.png");
    game.load.image("botonWavesNaranja", "assets/imgs/botonWavesNaranja.png");

    game.load.audio('menu', 'assets/audio/menu.mp3');
}

function initGame() {
    /*BG = game.add.image(0, 0, "background");
    BG.scale.setTo(0.9);*/
    menu = game.add.audio('menu');
    menu.play();

    let w = game.world.witdh;
    let h = game.world.height;

    bg = game.add.tileSprite(12, 0, w, h, 'bg');
    bg2 = game.add.tileSprite(283, 0, w, h, 'bg');

    textTitle = 'PokeWord';
    let styleTitle = {
        font: "bold 80px blackitalic",
        fill: 'orange'
    };

    game.add.text(game.world.width / 5, game.world.height / 12, textTitle, styleTitle);

    textTitle.boundsAlignH = 'center';

    
    //Poner botones
    botonPlayNaranja = game.add.button(game.world.width/3.33, (game.world.height/2)+100, "botonPlayNaranja", ApretarBotonPlay);
    botonPlayNaranja.scale.setTo(0.7);
    botonPlay = game.add.image(game.world.width/3.33, (game.world.height/2)+100, 'botonPlay');
    botonPlay.scale.setTo(0.7);
    botonPlay.visible = false;
    botonPlayNaranja.inputEnabled = true;

    botonOptionsNaranja = game.add.button(game.world.width/3.33, (game.world.height/2)+175, "botonWavesNaranja", ApretarBotonOptions);
    botonOptionsNaranja.scale.setTo(0.7);
    botonOptions = game.add.image(game.world.width/3.33, (game.world.height/2)+175, 'botonWaves');
    botonOptions.scale.setTo(0.7);
    botonOptions.visible = false;
    botonOptionsNaranja.inputEnabled = true;

    botonAboutNaranja = game.add.button(game.world.width/3.33, (game.world.height/2)+250, 'botonAboutNaranja',ApretarBotonAbout );
    botonAboutNaranja.scale.setTo(0.7);
    botonAbout = game.add.image(game.world.width/3.33, (game.world.height/2)+250, 'botonAbout');
    botonAbout.scale.setTo(0.7);
    botonAbout.visible = false;
    botonAboutNaranja.inputEnabled = true;

    game.input.addMoveCallback(p, this);
}

function p(pointer) {
    console.log(pointer.event);
}

function updateGame() {
    bg.tilePosition.y += 0.2;
    bg2.tilePosition.y -= 0.2;

    botonPlayN();
    botonOptionsN();
    botonAboutN();
}

function botonPlayN() {
    if (botonPlayNaranja.input.pointerOver())
    {
        botonPlay.visible = false;
    }
    else
    {
        botonPlay.visible = true;
    }
}
function botonOptionsN() {
    if (botonOptionsNaranja.input.pointerOver())
    {
        botonOptions.visible = false;
    }
    else
    {
        botonOptions.visible = true;
    }
}
function botonAboutN() {
    if (botonAboutNaranja.input.pointerOver())
    {
        botonAbout.visible = false;
    }
    else
    {
        botonAbout.visible = true;
    }
}

function ApretarBotonAbout () {
    game.state.start('about');
}

function ApretarBotonPlay () {
    game.state.start('game');
}
function ApretarBotonOptions () {
    game.state.start('waves');
}