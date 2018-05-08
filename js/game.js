
var game = new Phaser.Game(800, 240, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {

  game.load.tilemap('mario', 'assets/tilemaps/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');
  // game.load.image('player', 'assets/sprites/phaser-dude.png');
  game.load.spritesheet('player','assets/sprites/player.png', 20,16)


}

var map;
var layer;
var p;
var cursors;

function create() {

  game.stage.backgroundColor = '#787878';

  map = game.add.tilemap('mario');

  map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');

  layer = map.createLayer('World1');

  layer.resizeWorld();

  layer.wrap = true;

  cursors = game.input.keyboard.createCursorKeys();

  //player
  p = game.add.sprite(250,50, 'player',0)

  game.physics.arcade.enable(p)

  p.body.gravity.y = 600


  //quins objectes es poden col·lisionar
  map.setCollisionBetween(15, 16)
  map.setCollisionBetween(20, 25)
  map.setCollisionBetween(27, 29)
  map.setCollision(40)

  //PER A QUE LA CAMARA SEGUEIXI AL JUGADOR.
  game.camera.follow(p);

}

function update() {
  //amb això es mira si el player està col·lisionant amb layer ()
  game.physics.arcade.collide(p, layer)

  p.body.velocity.x = 0;

  inputs()

}

function inputs() {

  if (cursors.up.isDown)
  {
    if (p.body.onFloor())
    {
      p.body.velocity.y = -300;
    }
  }

  if (cursors.down.isDown)
  {
    p.body.velocity.y = 330;
  }

  if (cursors.left.isDown)
  {
    p.body.velocity.x = -150;
  }
  else if (cursors.right.isDown)
  {
    p.body.velocity.x = 150;
  }
}