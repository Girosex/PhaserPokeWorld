let game = new Phaser.Game(550, 750, Phaser.CANVAS, 'game');

window.onload = mainState;

function mainState () {
    game.state.add('menu', mainstate);
    game.state.add('about', aboutstate);
    game.state.add('game', gamestate);
    game.state.add('waves', wavesstate);
    game.state.add('gameover', gameoverstate);
    game.state.add('stats', statsstate);
    game.state.start('menu');
}