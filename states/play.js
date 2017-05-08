
function Play() {
    // score stuff
    this.score = 0;
    this.scoreText;
    this.numStars = 0;
    this.velocity_y_text = 0;
    this.jumpable = false;

    this.collectStar = function(player, star) {
        // remove star
        star.kill();

        // SCORE!
        this.score += 10;
        this.scoreText.setText('score: ' + this.score);

        this.numStars -= 1;

    }

    this.enableJumping = function(player, platform) {
        this.jumpable = true;
    }

    this.preload = function() {
        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    }

    this.create = function() {

        // enable "arcade" physics, whatever that is
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // background
        game.add.sprite(0,0, 'sky');

        // group for stuff we can jump on
        platforms = game.add.group();

        // invisible walls for checking the edges
        walls = game.add.group();

        // enable physics for these groups
        platforms.enableBody = true;
        game.physics.arcade.enable(platforms);
        walls.enableBody = true;

        // the ground
        var ground = platforms.create(0, game.world.height - 64, 'ground');

        // scale it to fit
        ground.scale.setTo(2, 2);

        // don't let it fall away
        ground.body.immovable = true;

        // ledges
        var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;
        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;

        // walls
        var wall = walls.create(0, 0, 'left');
        wall.scale.setTo(0, game.world.height);
        wall.body.immovable = true;
        wall = walls.create(game.world.width, 0, 'right');
        wall.scale.setTo(0, game.world.height);
        wall.body.immovable = true;

        // playa, playa
        player = game.add.sprite(32, game.world.height - 150, 'dude');

        // player physics
        game.physics.arcade.enable(player);

        // physics for the player, slight bounce
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.collideWorldBounds = true;

        // walking animations
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        // player controls
        cursors = game.input.keyboard.createCursorKeys();

        // staaaars
        stars = game.add.group();

        // 12, evenly spaced
        for(var i = 0; i < 12; ++i)
        {
            // Create in the group
            var star = stars.create(i * 70, 0, 'star');

            // enable this or the gravity call will fail
            game.physics.arcade.enable(star);

            // gravity
            star.body.gravity.y = 6;

            // random bounciness
            star.body.bounce.y = 0.7 + Math.random() * 0.2;

            this.numStars += 1;
        }

        // set up the scoreboard, created this last so that it's rendered on top
        this.scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        // debug the y velocity of the player
        this.velocity_y_text = game.add.text(16, 58, 'velocity y: 0', { fontSize: '32px', fill: '#000' });
    },

    this.update = function() {
        this.jumpable = false;

        // update our debug value
        this.velocity_y_text.setText(player.body.velocity.y);

        // collision
        game.physics.arcade.collide(player, platforms, this.enableJumping, null, this);
        game.physics.arcade.collide(player, walls);
        game.physics.arcade.collide(stars, platforms);
        
        // player overlap with stars
        game.physics.arcade.overlap(player, stars, this.collectStar, null, this);

        // reset horizontal movement first
        player.body.velocity.x = 0;

        // check for movement
        if(cursors.left.isDown)
        {
            player.body.velocity.x = -150;
            player.animations.play('left');
        }
        else if(cursors.right.isDown)
        {
            player.body.velocity.x = 150;
            player.animations.play('right');
        }
        else
        {
            // standing still
            player.animations.stop();
            player.frame = 4;
        }

        // jump, but only on solid ground
        if(cursors.up.isDown && player.body.touching.down && this.jumpable)
        {
            player.body.velocity.y = -350;
        }

        // Check to see if we collected all the stars
        if(this.numStars <= 0)
        {
            game.state.start("gameOver");
        }
    }
};
