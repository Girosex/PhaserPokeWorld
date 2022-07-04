let wavesstate = {
    preload: preloadAssets,
    create: initWaves,
    update: updateWaves
};

let magnemite;

function preloadAssets() {

    game.load.image("fondoWaves", "assets/imgs/gamePlay.jpg");
    game.load.image("enemigo", "assets/imgs/snorlax.png");
    game.load.image("magneton", "assets/imgs/magneton.png");
    game.load.image("magnemite", "assets/imgs/magnemite.png");
    game.load.image("gengar", "assets/imgs/gengar.png");
    game.load.image("trainer", "assets/imgs/entrenador.png");
    game.load.image("pokeball", "assets/imgs/pokeball.png");
    game.load.spritesheet("impact","assets/imgs/impact.png",48,48);
    game.load.spritesheet("explosion","assets/imgs/Explosion.png",64,64);
    game.load.text('palabras', "json/datalevel.json", true);
    game.load.text('waves', 'json/partA.json', true);
    game.load.text('partB', 'json/partB.json', true);
    game.load.audio('pop', 'assets/audio/pop.mp3');
    game.load.audio('splat', 'assets/audio/splat.mp3');
    game.load.audio('pokesound', 'assets/audio/pokesound.mp3');
    game.load.image("atrasWaves", "assets/imgs/atrasGameW.png");

}
function initWaves() {
    partNumber = 2;
    game.physics.setBoundsToWorld();

    fondoWaves = game.add.image(0, -200, "fondoWaves");
    fondoWaves.scale.setTo(0.8);

    atrasGame = game.add.button(10, 690, "atrasWaves", VolverAtrasDelWave);
    atrasGame.scale.setTo(0.1);

    game.input.keyboard.addCallbacks(this, null, null, keyPressed);
    game.time.events.loop(1000, updateTime, this);

    tiempo = 0;
    aciertos = 0;
    fallos = 0;

    temporizador = game.add.text(5, 5, 'Tiempo: ' + tiempo);

    loadLevel();
    loadPartB();
    createKeyControlls();
    createTrainer();
    createExplosions(EXPLOSIONS_GROUP_SIZE);
    createImpacts(IMPACTS_GROUP_SIZE);
    createPokeballs();
    createEnemy(n);
    createMagneton(n);
    createGengar(n);

    currentEnemies = waves[n].amount + wavesB[n].magneton + wavesB[n].gengar;

    pop = game.add.audio('pop');
    splat = game.add.audio('splat');
    pokesound = game.add.audio('pokesound');
}

function createMagneton(number) {

    magneton = game.add.group();
    magneton.enableBody = true;
    magneton.createMultiple(4, 'magneton');
    magneton.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
    magneton.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    magneton.setAll('checkWorldBounds', true);
    game.physics.arcade.enable(magneton);

    createMagnetonWave(number);
}

function createMagnetonWave(n) {
    currentMagneton = wavesB[n].magneton;
    currentSpecialVelocity = wavesB[n].speed;
    for (i = 0; i < wavesB[n].magneton; i++) {
        game.time.events.add(Math.floor(Math.random() * waves[n].rate), activateMagneton, this);
    }
}

function activateMagneton() {

    let magnet = magneton.getFirstExists(false);
    let gw = game.world.width;
    let uw = magnet.body.width;
    let w = gw - uw;
    let x = Math.floor(Math.random() * w);
    let z = uw / 2 + x;
            
    magnet.reset(z, 0);
    
    let desp = Math.random()*(90+90)-90; 
    let d = Math.sqrt((game.world.centerX + desp - magnet.x)**2 + (game.world.height - 100 - magnet.y)**2); //distance beetween pokemon and trainer
    magnet.body.velocity.x = ((game.world.centerX + desp - magnet.x) / d) * currentSpecialVelocity;
    magnet.body.velocity.y = ((game.world.height - 100 - magnet.y) / d) * currentSpecialVelocity;
    magnet.checkWorldBounds = true;
    magnet.events.onOutOfBounds.add(pokeOut, this);
            
    palabraHijo = magnet.addChild(game.make.text(-30, 0, wordsM[1].palabrasM[elegirPalabraM()]));
    palabrasEnPantalla.push(palabraHijo);
    magnet.angle = (Math.atan2(game.world.height - 100 - magnet.y, game.world.centerX + desp - magnet.x) * 180 / Math.PI) - 90;

    magnet.game.time.events.add(Math.floor(Math.random() * 6000), dropMagnet, this);
}

function dropMagnet() {
    currentEnemies += 1;
    magnemite = game.add.sprite(200, 100, 'magnemite');
    magnemite.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(magnemite);

    magnemite.checkWorldBounds = true;
    magnemite.events.onOutOfBounds.add(pokeOut, this);

    let d = Math.sqrt((game.world.centerX - magnemite.x)**2 + (game.world.height - 100 - magnemite.y)**2);
    magnemite.body.velocity.x = ((game.world.centerX - magnemite.x) / d) * currentEnemyVelocity;
    magnemite.body.velocity.y = ((game.world.height - 100 - magnemite.y) / d) * currentEnemyVelocity;

    palabraHijo = magnemite.addChild(game.make.text(-30, 0, words[0].palabras[elegirPalabra()]));
    palabrasEnPantalla.push(palabraHijo);
    magnemite.angle = (Math.atan2(game.world.height - 100 - magnemite.y, game.world.centerX - magnemite.x) * 180 / Math.PI) - 90;
}

function createGengar(number) {

    gengar = game.add.group();
    gengar.enableBody = true;
    gengar.createMultiple(3, 'gengar');
    gengar.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
    gengar.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    gengar.setAll('checkWorldBounds', true);
    game.physics.arcade.enable(gengar);

    createGengarWave(number);
}

function createGengarWave(n) {
    currentGengar = wavesB[n].gengar;
    currentSpecialVelocity = wavesB[n].speed;
    for (i = 0; i < wavesB[n].gengar; i++) {
        game.time.events.add(Math.floor(Math.random() * waves[n].rate), activateGengar, this);
    }
}

function activateGengar() {

    let geng = gengar.getFirstExists(false);
    let gw = game.world.width;
    let uw = geng.body.width;
    let w = gw - uw;
    let x = Math.floor(Math.random() * w);
    let z = uw / 2 + x;
            
    geng.reset(z, 0);
    
    let desp = Math.random()*(90+90)-90; 
    let d = Math.sqrt((game.world.centerX + desp - geng.x)**2 + (game.world.height - 100 - geng.y)**2); //distance beetween pokemon and trainer
    geng.body.velocity.x = ((game.world.centerX + desp - geng.x) / d) * currentSpecialVelocity;
    geng.body.velocity.y = ((game.world.height - 100 - geng.y) / d) * currentSpecialVelocity;
    geng.checkWorldBounds = true;
    geng.events.onOutOfBounds.add(pokeOut, this);
            
    palabraHijo = geng.addChild(game.make.text(-30, 0, wordsM[2].palabrasL[elegirPalabraL()]));
    palabrasEnPantalla.push(palabraHijo);
    geng.angle = (Math.atan2(game.world.height - 100 - geng.y, game.world.centerX + desp - geng.x) * 180 / Math.PI) - 90;
}

function elegirPalabraM() {
    randomWord = Math.floor(Math.random() * words[1].palabrasM.length);
    for (i = 0; i<palabrasEnPantalla.length; i++) {
        if (palabrasEnPantalla[i].text[0] == words[1].palabrasM[randomWord][0]) {
            elegirPalabra();
        }
    }
    return randomWord;
}

function elegirPalabraL() {
    randomWord = Math.floor(Math.random() * words[2].palabrasL.length);
    for (i = 0; i<palabrasEnPantalla.length; i++) {
        if (palabrasEnPantalla[i].text[0] == words[2].palabrasL[randomWord][0]) {
            elegirPalabra();
        }
    }
    return randomWord;
}

function p(pointer) {
    console.log(pointer.event);
}

function updateWaves() {
    game.physics.arcade.overlap(trainer,enemy,enemyHitsTrainer,null,this);
    game.physics.arcade.overlap(trainer,magneton,magnetonHitsTrainer,null,this);
    game.physics.arcade.overlap(trainer,gengar,gengarHitsTrainer,null,this);
    game.physics.arcade.overlap(pokeballs,enemy,pokeballHitsPoke,null,this);
    game.physics.arcade.overlap(pokeballs,magneton,pokeballHitsMagneton,null,this);
    game.physics.arcade.overlap(pokeballs,gengar,pokeballHitsGengar,null,this);
    game.physics.arcade.overlap(pokeballs,magnemite,pokeballHitsMagnemite,null,this);
    
    trainerMove();
    botonAtrasWave();
}

function pokeballHitsMagneton() {
    pokeballAire -= 1;
    pokeball.kill();
    if (muerto && pokeballAire == 1) {
        explosionPokemon(palabrasEnPantalla[enemigoApuntado].parent);
        palabrasEnPantalla[enemigoApuntado].parent.kill();
        muerto = false;
        pop.play();
        currentEnemies -=1;
        if(currentEnemies == 0 && n < 3) {
            game.state.start('stats');
        }
        //else if (currentEnemies == 0) game.state.start('gameover'); should not be necessary, but sometimes the stats don't pop up so you stay in an infinite loop
    }
}

function pokeballHitsMagnemite() {
    pokeballAire -= 1;
    pokeball.kill();
    if (muerto && pokeballAire == 1) {
        explosionPokemon(palabrasEnPantalla[enemigoApuntado].parent);
        palabrasEnPantalla[enemigoApuntado].parent.kill();
        muerto = false;
        pop.play();
        currentEnemies -=1;
        if(currentEnemies == 0 && n < 3) {
            game.state.start('stats');
        }
        //else if (currentEnemies == 0) game.state.start('gameover'); should not be necessary, but sometimes the stats don't pop up so you stay in an infinite loop
    }
}

function pokeballHitsGengar() {
    pokeballAire -= 1;
    pokeball.kill();
    if (muerto && pokeballAire == 1) {
        explosionPokemon(palabrasEnPantalla[enemigoApuntado].parent);
        palabrasEnPantalla[enemigoApuntado].parent.kill();
        muerto = false;
        pop.play();
        currentEnemies -=1;
        if(currentEnemies == 0 && n < 3) {
            game.state.start('stats');
        }
        //else if (currentEnemies == 0) game.state.start('gameover'); should not be necessary, but sometimes the stats don't pop up so you stay in an infinite loop
    }
}

function magnetonHitsTrainer(trainer, poke) {
    poke.kill();
    trainer.kill();
    game.time.events.add(2000, goToGameOver, this);
    displayImpact(trainer);
    splat.play();
}

function gengarHitsTrainer(trainer, poke) {
    poke.kill();
    trainer.kill();
    game.time.events.add(2000, goToGameOver, this);
    displayImpact(trainer);
    splat.play();
}

function createKeyControlls() {
    cursors = game.input.keyboard.createCursorKeys();
}

function trainerMove() {
    trainer.body.velocity.x = 0;
    if(cursors.left.isDown || game.input.speed.x < 0)
    trainer.body.velocity.x = -TRAINER_VELOCITY;
    else if(cursors.left.isDown || game.input.speed.x > 0)
    trainer.body.velocity.x = TRAINER_VELOCITY;
}

function loadPartB() {
    partBConfig = JSON.parse(game.cache.getText('partB'));
    configWordsM = JSON.parse(game.cache.getText('palabras'));
    createPartB(partBConfig);
    createWordsM(configWordsM);
}

function createPartB(partBConfig) {
    wavesB = partBConfig.waves;
}

function createWordsM(configWordsM) {
    wordsM = configWordsM.datalevel;
}

function botonAtrasWave() {
    if (atrasGame.input.pointerOver())
    {
        atrasGame.scale.setTo(0.11);
    }
    else
    {
        atrasGame.scale.setTo(0.1);
    }
}

function VolverAtrasDelWave() {
    game.state.start('menu');
}