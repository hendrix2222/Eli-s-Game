var GameOver = function () {};

GameOver.prototype = {
    preload: function () {
        // load assets
    },

    create: function () {
        // display 'GameOver' screen
        game.add.sprite(0, 0, 'gameover-bg');
    }
};