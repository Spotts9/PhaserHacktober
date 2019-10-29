// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');
gameScene.preload = function() {
  // load images
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('dragon', 'assets/dragon.png');
  this.load.image('treasure', 'assets/treasure.png');
};

// executed once, after assets were loaded
gameScene.create = function() {

  // background
  let bg = this.add.sprite(0, 0, 'background');

  //change origin to top left of the sprite
  bg.setOrigin(0,0);

  //player
  this.player = this.add.sprite(40, this.sys.game.config.height / 2,'player');

  //scale down
  this.player.setScale(0.5);

  //add goal
  this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
  this.treasure.setScale(0.6);

  //group of enemies
  this.enemies = this.add.group({
    key: 'dragon',
    repeat: 5,
    setXY: {
      x: 110,
      y: 100,
      stepX: 80,
      stepY: 20
    }
  });

  //scale enemies
  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);

  // set speeds
  Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
      enemy.speed = Math.random() * 2 + 1;
  }, this);
};

gameScene.update = function(){
    //check for active input
    if (this.input.activePointer.isDown) {
        //player walks
        this.player.x += this.playerSpeed;
    }

    // enemy movement
    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;

    for (let i = 0; i < numEnemies; i++) {

        // move enemies
        enemies[i].y += enemies[i].speed
        // reverse movement if reached the edges
        if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
            enemies[i].speed *= -1;
        } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
            enemies[i].speed *= -1;
        }

        //enemy collision
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
            this.gameOver();
            break;
        }
    }
    //treasure collision
  if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
    this.gameOver();
  };
};

// end the game
gameScene.gameOver = function() {

  // restart the scene
  this.scene.restart();
}
gameScene.init = function(){
    this.playerSpeed=1.5;
    this.enemyMaxY=280;
    this.enemyMinY=80;
};

// our game's configuration
let config = {
  type: Phaser.AUTO,  //Phaser will decide how to render our game (WebGL or Canvas)
  width: 640, // game width
  height: 360, // game height
  scene: gameScene // our newly created scene
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
