// Splash state
var Splash = function () {};

Splash.prototype = {

    // asset loading functions
    
    loadScripts: function () {
        game.load.script('gameOver',    'states/gameOver.js');
        game.load.script('play',        'states/play.js');
    },
    
    loadBgm: function () {

    },

    loadImages: function () {
        game.load.image('gameover-bg',    'assets/images/gameover-bg.jpg');
    },

    loadFonts: function () {

    },

    preload: function () {
        // Add a background image using 'stars' from main.js
        game.add.sprite(0, 0, 'stars');
        // Progress bar - using 'loading' image from main.js
        this.loadingBar = game.make.sprite(game.world.centerX, 400, "loading");
        this.loadingBar.anchor.setTo(0.5);
        game.add.existing(this.loadingBar);
        // Logo - using the 'brand' image from main.js
        this.logo = game.make.sprite(game.world.centerX, 200, 'brand');
        this.logo.anchor.setTo(0.5);
        game.add.existing(this.logo).scale.setTo(0.5);
        // Status text - says that we're loading
        this.status = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
        this.status.anchor.setTo(0.5);
        game.add.existing(this.status);
        // Tell phaser to use the loadingBar as our preload progress bar
        this.load.setPreloadSprite(this.loadingBar);

        // preload function that calls each of our asset loaders
        this.loadScripts();
        this.loadImages();
        this.loadFonts();
        this.loadBgm();
    },

    create: function () {
        // Add game states here
        game.state.add("gameOver", GameOver);
        game.state.add("play", Play);

        // Once we've loaded, lets change the text, then start
        this.status.setText("Ready!");

        setTimeout(function () {
            game.state.start("play");
        }, 1000);
    }
};