var menu = {
  preload: function () {
    //TODO
  },
  create: function () {

  }
}

var map;
var layer;
var player;
var cursors;
var jumping = false;
var level;
var stars = 0;
var coins = 0;
var health = 2;

var menu = {
  preload: function () {
    health = 2
    coins = 0
    stars = 0
    level = 1
    game.load.spritesheet('button', 'assets/buttons/start.png', 193, 190);

  },
  create: function () {
    game.stage.backgroundColor = "#0047aa"
    game.add.text(game.width/2-140, game.height/2*0.25, '"Mario" Bros', { font: '54px Arial', fill: '#000000' })

    game.add.button(game.width/2-200 , game.height-176, 'button', this.startLevel, this, 2, 1, 0)

    // game.state.start('level1')
  },
  startLevel: function () {
    game.state.start('level1')
  }
}

var hasMort = {
  preload: function () {
    game.load.spritesheet('btnmenu', 'assets/buttons/button_menu2.png', 300, 390);

  },

  create: function () {
    game.stage.backgroundColor = "#0047aa"
    game.add.text(game.width/2-140, game.height/2*0.25, 'Has mort!', { font: '54px Arial', fill: '#000000' })
    game.add.text(game.width/2-330, game.height/2, 'Puntuacio: '+coins, { font: '25px Arial', fill: '#ffff00' })
    game.add.text(game.width/2-330, game.height/2*1.5, 'Vides restants: '+health, { font: '25px Arial', fill: '#ffff00' })
    game.add.button(game.width/2-240 , game.height-200, 'btnmenu', this.menuInicial, this, 2, 1, 0)

  },
  menuInicial: function () {
    game.state.start('menu')
  }
}
var level1 = {

  preload: function () {
    this.game.load.tilemap('mario', 'assets/tilemaps/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');
    // this.game.load.image('player', 'assets/sprites/phaser-dude.png');
    this.game.load.spritesheet('player', 'assets/sprites/player.png', 20, 16)
    game.load.audio('coin',['assets/coin.wav', 'assets/coin.mp3'])
    game.load.audio('jump',['assets/jump.wav', 'assets/jump.mp3'])
    game.load.audio('dust',['assets/dust.wav', 'assets/dust.mp3'])
    game.load.image('dust', 'assets/dust.png')

  },

  create: function () {
    level = 1;
    this.game.stage.backgroundColor = '#787878';

    map = this.game.add.tilemap('mario');

    map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');

    layer = map.createLayer('World1');

    layer.resizeWorld();

    layer.wrap = true;

    cursors = this.game.input.keyboard.createCursorKeys();

    //player
    this.putPlayer(200,50)

    //PARTICULES
    dustParticles = game.add.emitter(0,0,150)
    dustParticles.makeParticles('dust')
    dustParticles.setYSpeed(-200,200)
    dustParticles.setXSpeed(-200,200)
    dustParticles.gravity = 600


    //quins objectes es poden col·lisionar
    map.setCollisionBetween(14, 16)
    map.setCollisionBetween(20, 25)
    map.setCollisionBetween(27, 29)
    map.setCollision(40)

    // funció per a les monedes
    map.setTileIndexCallback(11, this.agafarMoneda, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.agafarMoneda, this)
    this.coinSound = game.add.audio('coin', 0.1)
    this.jumpSound = game.add.audio('jump', 0.1)
    this.dustSound = game.add.audio('dust', 0.1)

    map.setTileIndexCallback(18, this.restarVida, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.restarVida, this)

    //quan toca la bandera o el mastil
    map.setTileIndexCallback(5, this.nextLevel, this)
    map.setTileIndexCallback(10, this.nextLevel, this)
    map.setTileIndexCallback(13, this.nextLevel, this)
    map.setTileIndexCallback(17, this.nextLevel, this)
    // map.setTileLocationCallback(2, 0, 1, 1, this.nextLevel, this)

    //aafar altre bolet
    map.setTileIndexCallback(12, this.agafarVida, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.agafarVida, this)

    map.setTileIndexCallback(19, this.agafarEstrella, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.agafarEstrella, this)



  },
  update: function () {
    //amb això es mira si el player està col·lisionant amb layer ()
    this.game.physics.arcade.collide(player, layer)

    player.body.velocity.x = 0;

    this.inputs()
    this.playerIsDie()

  },
  jumpPlayer: function () {
    player.body.velocity.y = -350
    jumping = true
    this.jumpSound.play()
  },
  inputs: function () {

    if (cursors.up.isDown) {
      if (player.body.onFloor()) {
        this.jumpSound.play()
        player.body.velocity.y = -300;
      }
    }

    if (cursors.down.isDown) {
      player.body.velocity.y = 330;
    }

    if (cursors.left.isDown) {
      player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown) {
      player.body.velocity.x = 150;
    }

    if(player.body.onFloor()) {
      if(jumping) {
        this.dustSound.play()
        jumping = false
        dustParticles.x = player.x + player.height / 2
        dustParticles.y = player.y + player.height

        dustParticles.start(true,3000,0,25)
      }
      if(cursors.up.isDown) {
        this.jumpPlayer()
      }
    }
  },

  playerIsDie: function () {
    if (health == 0) {
      game.state.start('mort')
    } else {
      if(game.world.height < player.body.y) {
        health--
        if(player.body.x < game.world.height) {
          this.putPlayer(player.body.x+90,50)

        } else {
          this.putPlayer(player.body.x-90,50)
        }
      }
    }


  },
  agafarMoneda: function (sprite, tile) {

    tile.alpha = 1
    tile.index = 1

    // this.monedesText.text ='MONEDES: '+ ++monedes
    coins++;
    this.coinSound.play()
    layer.dirty = true;
    return false
  },
  agafarVida: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    if (health < 5) {
      health++;
    }

    layer.dirty = true;
    return false
  },
  restarVida: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    health--;


    layer.dirty = true;
    return false
  },
  agafarEstrella: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    stars++
    layer.dirty = true;
    return false
  },
  render: function () {
    game.debug.text('health: '+ health|| 'FPS: --',10,20,"#00ff00")
    game.debug.text('coins: '+ coins|| 'FPS: --',10,40,"#00ff00")
    game.debug.text('level: '+ level|| 'FPS: --',10,60,"#00ff00")
    game.debug.text('stars: '+ stars|| 'FPS: --',10,80,"#00ff00")
    game.debug.text('player.x: '+ player.body.x|| 'FPS: --',10,100,"#00ff00")
    game.debug.text('player.y: '+ player.body.y|| 'FPS: --',10,120,"#00ff00")
    game.debug.text('jumpin: '+ jumping || 'FPS: --',10,140,"#00ff00")
  },

  putPlayer: function (x,y) {
    player = this.game.add.sprite(x, y, 'player', 0)


    this.game.physics.arcade.enable(player)

    player.body.gravity.y = 600
    //PER A QUE LA CAMARA SEGUEIXI AL JUGADOR.
    this.game.camera.follow(player);
  },
  nextLevel: function (sprite, title) {
    game.state.start('level2')
  }
}
var level2 = {

  preload: function () {
    this.game.load.tilemap('mario', 'assets/tilemaps/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');
    // this.game.load.image('player', 'assets/sprites/phaser-dude.png');
    this.game.load.spritesheet('player', 'assets/sprites/player.png', 20, 16)
    game.load.audio('coin',['assets/coin.wav', 'assets/coin.mp3'])
    game.load.audio('jump',['assets/jump.wav', 'assets/jump.mp3'])
    game.load.audio('dust',['assets/dust.wav', 'assets/dust.mp3'])
    game.load.image('dust', 'assets/dust.png')

  },

  create: function () {
    level = 2;
    this.game.stage.backgroundColor = '#787878';

    map = this.game.add.tilemap('mario');

    map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');

    layer = map.createLayer('World1');

    layer.resizeWorld();

    layer.wrap = true;

    cursors = this.game.input.keyboard.createCursorKeys();


    this.putPlayer(200,50)

    //PARTICULES
    dustParticles = game.add.emitter(0,0,150)
    dustParticles.makeParticles('dust')
    dustParticles.setYSpeed(-200,200)
    dustParticles.setXSpeed(-200,200)
    dustParticles.gravity = 600


    //quins objectes es poden col·lisionar
    map.setCollisionBetween(14, 16)
    map.setCollisionBetween(20, 25)
    map.setCollisionBetween(27, 29)
    map.setCollision(40)

    // funció per a les monedes
    map.setTileIndexCallback(11, this.agafarMoneda, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.agafarMoneda, this)
    this.coinSound = game.add.audio('coin', 0.1)
    this.jumpSound = game.add.audio('jump', 0.1)
    this.dustSound = game.add.audio('dust', 0.1)

    map.setTileIndexCallback(18, this.restarVida, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.restarVida, this)

    //quan toca la bandera o el mastil
    map.setTileIndexCallback(5, this.nextLevel, this)
    map.setTileIndexCallback(10, this.nextLevel, this)
    map.setTileIndexCallback(13, this.nextLevel, this)
    map.setTileIndexCallback(17, this.nextLevel, this)
    // map.setTileLocationCallback(2, 0, 1, 1, this.nextLevel, this)

    //aafar altre bolet
    map.setTileIndexCallback(12, this.agafarVida, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.agafarVida, this)

    map.setTileIndexCallback(19, this.agafarEstrella, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.agafarEstrella, this)



  },
  update: function () {
    //amb això es mira si el player està col·lisionant amb layer ()
    this.game.physics.arcade.collide(player, layer)

    player.body.velocity.x = 0;

    this.inputs()
    this.playerIsDie()

  },
  jumpPlayer: function () {
    player.body.velocity.y = -350
    jumping = true
    this.jumpSound.play()
  },
  inputs: function () {

    if (cursors.up.isDown) {
      if (player.body.onFloor()) {
        this.jumpSound.play()
        player.body.velocity.y = -300;
      }
    }

    if (cursors.down.isDown) {
      player.body.velocity.y = 330;
    }

    if (cursors.left.isDown) {
      player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown) {
      player.body.velocity.x = 150;
    }

    if(player.body.onFloor()) {
      if(jumping) {
        this.dustSound.play()
        jumping = false
        dustParticles.x = player.x + player.height / 2
        dustParticles.y = player.y + player.height

        dustParticles.start(true,3000,0,25)
      }
      if(cursors.up.isDown) {
        this.jumpPlayer()
      }
    }
  },

  playerIsDie: function () {
    if (health == 0) {
      game.state.start('mort')
    } else {
      if(game.world.height < player.body.y) {
        health--
        if(player.body.x < game.world.height) {
          this.putPlayer(player.body.x+90,50)

        } else {
          this.putPlayer(player.body.x-90,50)
        }
      }
    }


  },
  agafarMoneda: function (sprite, tile) {

    tile.alpha = 1
    tile.index = 1

    // this.monedesText.text ='MONEDES: '+ ++monedes
    coins++;
    this.coinSound.play()
    layer.dirty = true;
    return false
  },
  agafarVida: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    if (health < 5) {
      health++;
    }

    layer.dirty = true;
    return false
  },
  restarVida: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    health--;


    layer.dirty = true;
    return false
  },
  agafarEstrella: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    stars++
    layer.dirty = true;
    return false
  },
  render: function () {
    game.debug.text('health: '+ health|| 'FPS: --',10,20,"#00ff00")
    game.debug.text('coins: '+ coins|| 'FPS: --',10,40,"#00ff00")
    game.debug.text('level: '+ level|| 'FPS: --',10,60,"#00ff00")
    game.debug.text('stars: '+ stars|| 'FPS: --',10,80,"#00ff00")
    game.debug.text('player.x: '+ player.body.x|| 'FPS: --',10,100,"#00ff00")
    game.debug.text('player.y: '+ player.body.y|| 'FPS: --',10,120,"#00ff00")
    game.debug.text('jumpin: '+ jumping || 'FPS: --',10,140,"#00ff00")
  },

  putPlayer: function (x,y) {
    player = this.game.add.sprite(x, y, 'player', 0)


    this.game.physics.arcade.enable(player)

    player.body.gravity.y = 600
    //PER A QUE LA CAMARA SEGUEIXI AL JUGADOR.
    this.game.camera.follow(player);
  },
  nextLevel: function (sprite, title) {
    game.state.start('level2')
  }
}


// var game = new Phaser.Game(800, 240, Phaser.AUTO, 'game', {preload: this.preload, create: this.create, update: this.update});
var game = new Phaser.Game(800, 240, Phaser.AUTO, 'game');

game.state.add('menu', menu)
game.state.add('level1', level1)
game.state.add('mort', hasMort)
// game.state.add('level2', level2)

game.state.start('menu')
