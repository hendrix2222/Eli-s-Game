const GAME_SCALE = 2;


function Play() {
    // score stuff
    this.score = 0;
    this.scoreText;
    this.numStars = 0;
    this.velocity_y_text = 0;
    this.jumpable = false;
    this.map = null;
    this.layer = null;

    this.collectStar = function(player, star) {
        // remove star
        star.kill();

        // SCORE!
        this.score += 10;
        this.scoreText.setText('score: ' + this.score);

        this.numStars -= 1;

    }

    this.enableJumping = function(player, tile) {
        this.jumpable = true;

        return true;
    }

    this.preload = function() {
        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.spritesheet('indy', 'assets/player.png', 16, 32);

        // try to load a level here
        game.load.tilemap('testLevel', 'json/testMap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/platforms.png');
    }

    this.create = function() {

        // enable "arcade" physics, whatever that is
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // background
        skySprite = game.add.sprite(0,0, 'sky');
        skySprite.scale.setTo(GAME_SCALE, GAME_SCALE);

        // create the level that we loaded earlier
        this.map = game.add.tilemap("testLevel");
        this.map.addTilesetImage("platforms", "tiles");
        this.layer = this.map.createLayer("Tile Layer 1");
        this.layer.setScale(GAME_SCALE);
        this.map.setCollisionBetween(0,7);
        this.map.setTileIndexCallback([0,1,2,3,4,5,6,7], this.enableJumping, this);
        this.layer.resizeWorld();
           
        // playa, playa
        player = game.add.sprite(32, game.world.height / 2, 'indy');
        player.scale.setTo(GAME_SCALE, GAME_SCALE);
        
        // player physics
        game.physics.arcade.enable(player);

        // physics for the player, slight bounce
        player.body.bounce.y = 0.01;
        player.body.gravity.y = 600;
        player.body.collideWorldBounds = true;

        // walking animations
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        game.camera.follow(player);

        // player controls
        cursors = game.input.keyboard.createCursorKeys();

        // staaaars
        stars = game.add.group();

        // 12, evenly spaced
        var starSpace = game.world.width / 12;
        for(var i = 0; i < 12; ++i)
        {
            // Create in the group
            var star = stars.create(i * starSpace, 0, 'star');

            // enable this or the gravity call will fail
            game.physics.arcade.enable(star);

            // gravity
            star.body.gravity.y = 300;

            // random bounciness
            star.body.bounce.y = 0.7 + Math.random() * 0.2;

            this.numStars += 1;
        }

        // set up the scoreboard, created this last so that it's rendered on top
        this.scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        this.scoreText.fixedToCamera = true;
    },

    this.update = function() {
        this.jumpable = false;

        // collision
        game.physics.arcade.collide(player, this.layer, this.enableJumping, null, this);
        game.physics.arcade.collide(stars, this.layer);

        // player overlap with stars
        game.physics.arcade.overlap(player, stars, this.collectStar, null, this);

        // reset horizontal movement first
        player.body.velocity.x = 0;

        // check for movement
        if(cursors.left.isDown)
        {
            player.body.velocity.x = -150 * GAME_SCALE;
            player.animations.play('left');
        }
        else if(cursors.right.isDown)
        {
            player.body.velocity.x = 150 * GAME_SCALE;
            player.animations.play('right');
        }
        else
        {
            // standing still
            player.animations.stop();
            player.frame = 4;
        }

        // jump, but only on solid ground
        if(cursors.up.isDown && player.body.blocked.down && this.jumpable)
        {
            player.body.velocity.y = -250 * GAME_SCALE;
        }

        // Check to see if we collected all the stars
        if(this.numStars <= 0)
        {
            game.state.start("gameOver");
        }
    }
};
