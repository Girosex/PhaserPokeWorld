let gamestate = {
    preload: preloadAssets,
    create: initGame,
    update: updateGame
};

var n = 0;
let enemy;
let apuntado = false;
let muerto;
let pokeballAire = 0;   //this variable counts how many pokeballs are active, so when it only remains one and the objective has no letters it dies.

var aciertos = 0;
var aciertosTotales = 0;
var fallos = 0;
var fallosTotales = 0;
var tiempo = 0;
var totalTime = 0;
var pokemonAbatidos = 0;
var timer;

let trainer;
let TRAINER_VELOCITY = 400;
let pokeballs;
let pokeball;
let currentPokeballVelocity = 1200;

const IMPACTS_GROUP_SIZE = 30;
let impacts;
const EXPLOSIONS_GROUP_SIZE = 30;
let explosions;

let level = 0;
const TIMER_RHYTHM = 0.2 * Phaser.Timer.SECOND;
let currentEnemyProbability;
let currentEnemyVelocity;
var data = ["json/datalevel.json"]

function preloadAssets() {
    game.load.image("fondoGame", "assets/imgs/gamePlay.jpg");
    game.load.image("atrasGame", "assets/imgs/atrasGame.png");
    game.load.image("atrasGameW", "assets/imgs/atrasGameW.png");
    game.load.image("enemigo", "assets/imgs/snorlax.png");
    game.load.image("trainer", "assets/imgs/entrenador.png");
    game.load.image("pokeball", "assets/imgs/pokeball.png");
    game.load.spritesheet("impact","assets/imgs/impact.png",48,48);
    game.load.spritesheet("explosion","assets/imgs/Explosion.png",64,64);
    game.load.text('palabras', "json/datalevel.json", true);
    game.load.text('waves', 'json/partA.json', true);
    game.load.audio('pop', 'assets/audio/pop.mp3');
    game.load.audio('splat', 'assets/audio/splat.mp3');
    game.load.audio('pokesound', 'assets/audio/pokesound.mp3');
}


function initGame() {

    partNumber = 1;
    game.physics.setBoundsToWorld();

    fondoGame = game.add.image(0, -200, "fondoGame");
    fondoGame.scale.setTo(0.8);

    atrasGame = game.add.button(10, 690, "atrasGameW", VolverAtrasDelGame);
    atrasGame.scale.setTo(0.1);

    loadLevel();
    game.input.keyboard.addCallbacks(this, null, null, keyPressed);
    game.time.events.loop(1000, updateTime, this);

    tiempo = 0;
    aciertos = 0;
    fallos = 0;

    temporizador = game.add.text(5, 5, 'Tiempo: ' + tiempo);

    createTrainer();
    createExplosions(EXPLOSIONS_GROUP_SIZE);
    createImpacts(IMPACTS_GROUP_SIZE);
    createPokeballs();
    createEnemy(n);
    createKeyControlls();

    currentEnemies = waves[n].amount;

    pop = game.add.audio('pop');
    splat = game.add.audio('splat');
    pokesound = game.add.audio('pokesound');
}

function updateTime() {
    tiempo++;
    totalTime++;
    temporizador.setText('Tiempo: ' + tiempo);
}

function createTrainer() {

    let x = game.world.centerX;
    let y = game.world.height - 100;
    trainer = game.add.sprite(x, y, 'trainer');
    trainer.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(trainer);
}

function createImpacts(number) {
    impacts = game.add.group();
    impacts.createMultiple(number, 'impact');
    impacts.forEach(setupImpact, this);
}

function setupImpact(impact) {
    impact.anchor.x = 0.5;
    impact.anchor.y = 0.5;
    impact.animations.add('impact');
}

function createExplosions(number) {
    explosions = game.add.group();
    explosions.createMultiple(number, 'explosion');
    explosions.forEach(setupExplosion, this);
}

function setupExplosion(explosion) {
    explosion.anchor.x = 0.5;
    explosion.anchor.y = 0.5;
    explosion.animations.add('explosion');
}

function resetMember(item) {
    item.kill();
}    

function createEnemy(number) {

    enemy = game.add.group();
    enemy.enableBody = true;
    enemy.createMultiple(22, 'enemigo');
    enemy.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
    enemy.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    enemy.setAll('checkWorldBounds', true);
    game.physics.arcade.enable(enemy);

    createWave(number);
}

function createWave(n) {
    currentEnemyVelocity = waves[n].speed;
    for (i = 0; i < waves[n].amount; i++) {
        game.time.events.add(Math.floor(Math.random() * waves[n].rate), activateEnemy, this);
    }
}

function activateEnemy() {

    let poke = enemy.getFirstExists(false);
    let gw = game.world.width;
    let uw = poke.body.width;
    let w = gw - uw;
    let x = Math.floor(Math.random() * w);
    let z = uw / 2 + x;
            
    poke.reset(z, 0);
    
    let desp = Math.random()*(90+90)-90; 
    let d = Math.sqrt((game.world.centerX + desp - poke.x)**2 + (game.world.height - 100 - poke.y)**2); //distance beetween pokemon and trainer
    poke.body.velocity.x = ((game.world.centerX + desp - poke.x) / d) * currentEnemyVelocity;
    poke.body.velocity.y = ((game.world.height - 100 - poke.y) / d) * currentEnemyVelocity;
    poke.checkWorldBounds = true;
    poke.events.onOutOfBounds.add(pokeOut, this);
            
    palabraHijo = poke.addChild(game.make.text(-30, 0, words[0].palabras[elegirPalabra()]));
    palabrasEnPantalla.push(palabraHijo);
    poke.angle = (Math.atan2(game.world.height - 100 - poke.y, game.world.centerX + desp - poke.x) * 180 / Math.PI) - 90;
}

function pokeOut(poke) {
    currentEnemies -= 1;
    poke.kill();
    if (currentEnemies == 0) game.state.start('stats');
}

const palabrasEnPantalla = [];

function loadLevel() {
    let levelConfig = JSON.parse(game.cache.getText('palabras'));
    let waveConfig = JSON.parse(game.cache.getText('waves'));
    createLevel(levelConfig);
    createWaves(waveConfig);
}

function createLevel(levelConfig) {
    words = levelConfig.datalevel;
}

function createWaves(waveConfig) {
    
    waves = waveConfig.waves;
}


function p(pointer) {
    console.log(pointer.event);
}

function updateGame() {
    game.physics.arcade.overlap(trainer,enemy,enemyHitsTrainer,null,this);
    game.physics.arcade.overlap(pokeballs,enemy,pokeballHitsPoke,null,this);
    
    botonAtrasGame();
}

function elegirPalabra(poke) {
    randomWord = Math.floor(Math.random() * words[0].palabras.length);
    for (i = 0; i<palabrasEnPantalla.length; i++) {
        if (palabrasEnPantalla[i].text[0] == words[0].palabras[randomWord][0]) {
            elegirPalabra();
        }
    }
    return randomWord;  //attach text to sprite
}

function keyPressed(e){
    letra = "";
    letraMayus = "";

    letra += e;
    letraMayus = letra.toUpperCase();

    if(!apuntado && !muerto) {
        for(i = 0; i<palabrasEnPantalla.length; i++) {
            if (palabrasEnPantalla[i].text[0] == letraMayus) {
                apuntado = true;
                enemigoApuntado = i;
                palabraApuntada = palabrasEnPantalla[i].text;
                break;
            }
        }
    }

    if (apuntado) {
        palabraApuntada = contrastKey(letraMayus, palabraApuntada);
        palabrasEnPantalla[enemigoApuntado].text = palabraApuntada;
    }
    else {
        fallos += 1;
        fallosTotales += 1;
    }

    function contrastKey(letra, palabra) {
        if (letra == palabra) { //It only remains the last one.
            pokeballAire += 1;
            aciertos += 1;
            aciertosTotales += 1;
            palabra = "";
            actualizarHijo(palabra, enemigoApuntado);
            apuntado = false;
            muerto = true;
            pokemonAbatidos += 1;
            punteroMuerto = palabrasEnPantalla[enemigoApuntado].parent;
            throwPokeball(punteroMuerto);
        }
        else if(letra == palabra[0]) {
            if (pokeballAire < 0) pokeballAire = 0;
            pokeballAire += 1;
            aciertos += 1;
            aciertosTotales += 1;
            throwPokeball(palabrasEnPantalla[enemigoApuntado].parent);
            palabra = palabra.slice(1, palabra.length);
            actualizarHijo(palabra, enemigoApuntado);
        }
        else {
            fallos += 1;
            fallosTotales += 1;
        }

        return palabra;
    }
}

function actualizarHijo(newWord, index) {
    palabrasEnPantalla[index].setText(newWord);
    palabrasEnPantalla[index].style.fill = "#FF6800";
}

function throwPokeball(poke) {
    pokeball = pokeballs.create(trainer.x - 30, trainer.y - 40, 'pokeball')
    game.physics.arcade.enable(pokeball);
        
    distance = Math.sqrt((poke.x - pokeball.x)**2 + (poke.y - pokeball.y)**2); //distance beetween pokemon and pokeball
    pokeball.body.velocity.x = ((poke.x - pokeball.x) / distance) * currentPokeballVelocity;
    pokeball.body.velocity.y = ((poke.y - pokeball.y) / distance) * currentPokeballVelocity;

    pokesound.play();
}

function createPokeballs() {
    pokeballs = game.add.group();
    pokeballs.enableBody = true;
}

function enemyHitsTrainer(trainer, poke) {
    poke.kill();
    trainer.kill();
    game.time.events.add(2000, goToGameOver, this);
    displayImpact(trainer);
    splat.play();
}

function pokeballHitsPoke(pokeball, poke) {
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

function displayImpact(trainer) {
    let impact = impacts.getFirstExists(false);
    let x = trainer.body.center.x;
    let y = trainer.body.center.y + 20;
    impact.reset(x, y);
    impact.play('impact', 20, false, true);
}

function explosionPokemon(poke) {
    let explosion = explosions.getFirstExists(false);
    let x = poke.body.center.x;
    let y = poke.body.center.y;
    explosion.reset(x, y);
    explosion.play('explosion', 20, false, true);
}

function goToGameOver() {
    game.state.start('gameover');
}

function botonAtrasGame() {
    if (atrasGame.input.pointerOver())
    {
        atrasGame.scale.setTo(0.11);
    }
    else
    {
        atrasGame.scale.setTo(0.1);
    }
}

function VolverAtrasDelGame() {
    game.state.start('menu');
}

function createKeyControlls() {
    cursors = game.input.keyboard.createCursorKeys();
}
