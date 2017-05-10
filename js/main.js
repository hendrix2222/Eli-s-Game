// Create a new Phaser game:
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

// Create a 'main' object
var Main = function () {};

// Prototype the Main object as a phaser state object
Main.prototype = {

    preload: function () {
        // Load our image assets and the js script that will display the splash
        game.load.image('stars',    'assets/images/stars.jpg');
        game.load.image('loading',  'assets/images/loading.png');
        game.load.image('brand',    'assets/images/logo.png');
        game.load.script('utils',   'js/utils.js');
        game.load.script('splash',  'js/splash.js');
    },

    create: function () {
        // Add our splash screen state to the manager and tell it to start
        game.state.add('splash', Splash);
        game.state.start('splash');
    }
};

// Add the main state and start it, this will, in turn, start the splash
game.state.add('Main', Main);
game.state.start('Main');
