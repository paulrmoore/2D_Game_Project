//Creating game home page

// game logic begins here
  var $canvas = $('.game-window');
  var context = $canvas[0].getContext("2d");
  $canvas.height = parseInt($('.gameboard').css('height')) - 50;
  $canvas.width = parseInt($('.gameboard').css('width')) - 50;

  if ($canvas.height > 765) {
    $canvas.height = 765;
  }

  var gameSoundtrack = new Audio();
  gameSoundtrack.src = '92_Skirmish.mp3';

  $('#start-game').one('click',function(){
    $('canvas').show();
    $('.rules').show();
    $('.panel-1').show();
    $('.panel-2').show();
    $('.panel-2').append($('.posted-instructions'));
    $('.posted-instructions').show();
    gameSoundtrack.play();
    gameLoop();
  })

  $('#instructions').on('click',function(){
    $('canvas').hide();
    $('.gameboard').append($('.posted-instructions'));
    $('.posted-instructions').show();
  });

//declare global variables
var keys = [];
var frame = 0;

//sets controls for game
$('body').on("keydown", function(event) {
  if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 16 || event.keyCode === 32) {
  keys[event.keyCode] = true;
  // requestAnimationFrame(gameLoop); turn this on for slow mo game
  }
}).on("keyup", function(event) {
  keys[event.keyCode] = false;
});

//create sprite images
var forward = new Image();
forward.src = 'Images/rohon/hit1-upgraded.png';
var reverse = new Image();
reverse.src = 'Images/rohon/hit1-upgraded_reversed.png';
var hitting = new Image();
hitting.src = 'Images/rohon/special2-upgraded.png';
var walkingArray = [];
    walkingArray[0] = new Image();
    walkingArray[0].src = 'Images/rohon/roll2-upgraded.png';
    walkingArray[1] = new Image();
    walkingArray[1].src = 'Images/rohon/roll3-upgraded.png';
    walkingArray[2] = new Image();
    walkingArray[2].src = 'Images/rohon/roll4-upgraded.png';
    walkingArray[3] = new Image();
    walkingArray[3].src = 'Images/rohon/roll5-upgraded.png';
    walkingArray[4] = new Image();
    walkingArray[4].src = 'Images/rohon/roll6-upgraded.png';;
 var characterDirection = forward;

//set character traits
var player = {
  width: 40,
  height: 40,
  x: 130,
  y: 200,
  velocityX: 0,
  velocityY: 0,
  maxSpeed: 5,
  gravity: 0.5, //set to 0.5
  colliided: false,
  collidedDirection: "",
  inAir: false,
  status: 'alive',
  health: 10
}

function gameLoop() {
  // $canvas.height = window.innerHeight - 50;
  // $canvas.width = window.innerWidth - 50;
  $canvas.attr("width", $canvas.width+"px");
  $canvas.attr("height", $canvas.height+"px");
  $canvas.css("border", "2px solid black");


  //calls all other functions
  moveCharacter();
  detectCollisions();
  detectCollisionsForBoss();
  moveFrame();
  drawGround();
  drawEnemies();
  detectCollisionWithEnemies();
  detectCollisionWithBoss();
  moveRock();

  //end game
  if (player.x === platforms[platforms.length-1].x + platforms[platforms.length-1].width || player.status === 'dead' || player.y > 1000) {
    alert('Game Over');
    window.location.reload();
  }

  requestAnimationFrame(gameLoop);
};

function moveCharacter() {
  leftPoint = player.x;
  //player always
  player.velocityY += player.gravity;
  player.y += player.velocityY;

  //draws character
  context.drawImage(characterDirection, player.x - frame , player.y, player.width, player.height);


    if (player.x === 0){
      console.log('boundary');
      player.x = 30;
    }

    //walk left
    if (keys[37]) {
    characterDirection = reverse;
      while (player.velocityX > -player.maxSpeed) {
        player.velocityX -= 1;
        player.x += player.velocityX;
      }
      player.x += player.velocityX;
    }

    //walk right
    else if (keys[39]) {
      while (player.velocityX < player.maxSpeed) {
        player.velocityX += 1;
        player.x += player.velocityX;
      }
      rightPoint = player.x;
      player.x += player.velocityX;
    }
    //character attacks
    else if (keys[16]) {
      characterDirection = hitting;
      player.x += 3;
      for(i=0;i<enemies.length;i++) {
        if(enemies[i].alive) {
          if(detectCollision(player, enemies[i])) {
            collidedWithEnemy = true;
            enemies[i].alive = false;
          }
        }
      }
    }
    else {
      characterDirection = forward;
      player.velocityX = 0;
    }

    //character jumps
    $('body').on("keydown", function(event) {
      if (event.keyCode === 38 && player.inAir === false) {
        player.velocityY = -10;
        player.inAir = true;
      }
    })
      $('body').on("keypress", function(event) {
        if (event.keyCode === 32) {
          console.log('Rock drawn')
          drawRock();
        }
    })
}

var Rock = new Image();

var RockArray = [
  {x: player.x + player.width, y: player.y + 10, width: 50, height: 50, type: "Rock", variable: Rock, velocityX: 0},
];

var rockCounter = 0;

drawRock = function() {
  rockCounter++
  if (rockCounter < 10000) {
  console.log(rockCounter)
  Rock.src = "Images/Sprite_FX_Rocks_0018.png";
  RockArray[0].x = player.x + player.width;
  RockArray[0].y = player.y + 10;
  RockArray[0].velocityX = 8;
  RockArray[0].isFired = true;
  console.log(player.x, RockArray[0].x);
  console.log('drawRock done');
}
}

moveRock = function() {
    //rock hits enemy
    if (RockArray[0].isFired) {
        context.drawImage(RockArray[0].variable, RockArray[0].x - frame, RockArray[0].y, 10, 10);
        RockArray[0].x += RockArray[0].velocityX;
      for(i=0;i<enemies.length;i++) {
        if(enemies[i].alive) {
         if(detectCollision(RockArray[0], enemies[i])) {
              collidedWithEnemy = true;
              RockArray[0].isFired = false;
              enemies[i].alive = false;
              console.log(RockArray[0].x, enemies[i].x);
              // RockArray[0].x = player.x + player.width - frame;
          }
        }
      }

      //rock hits boss
        if(bosses[0].alive) {
          if(detectCollision(RockArray[0], bosses[0])) {
            collidedWithEnemy = true;
            RockArray[0].isFired = false;
            bosses[0].health -= 10;
            if (bosses[0].health < 1){
              bosses[0].alive = false;
            }
            console.log(bosses[0].health);
          }
        }
    }
  }

//sets variables for map drawing
  //draws bricks and rocks
  var brick = new Image();
  brick.src = "Images/brick.png";

  var rock = new  Image();
  rock.src = "Images/rocktile.png";



  var brickObject = {
    width: 20,
    height: 20
  }

  var platforms = [
  {x: 0, y: $canvas.height-90, width: 500, height: 90, type: "rock", variable: rock, shm: false},
  {x: 0, y: $canvas.height-130, width: 500, height: 40, type: "brick", variable: brick, shm: false},
  {x: 600, y: $canvas.height-90, width: 500, height: 90, type: "rock", variable: rock, shm: false},
  {x: 600, y: $canvas.height-130, width: 500, height: 40, type: "brick", variable: brick, shm: false},
  {x: 1300, y: $canvas.height-90, width: 260, height: 90, type: "rock", variable: rock, shm: false},
  {x: 1300, y: $canvas.height-130, width: 260, height: 40, type: "brick", variable: brick, shm: false},
  {x: 1700, y: $canvas.height-90, width: 300, height: 90, type: "rock", variable: rock, shm: false},
  {x: 1700, y: $canvas.height-130, width: 300, height: 40, type: "brick", variable: brick, shm: false},
  {x: 2100, y: $canvas.height-90, width: 700, height: 90, type: "rock", variable: rock, shm: false},
  {x: 2100, y: $canvas.height-130, width: 700, height: 40, type: "brick", variable: brick, shm: false},
  {x: 3000, y: $canvas.height-90, width: 600, height: 90, type: "rock", variable: rock, shm: false},
  {x: 3000, y: $canvas.height-130, width: 600, height: 40, type: "brick", variable: brick, shm: false},
  ];

  //draws lava
  var lava = new Image();
  lava.src = 'Images/Lava/l0.png';

  var lavaObject = {
    width: 20,
    height: 20
  };

  var lavaGround = [
    {x: 500, y: $canvas.height-50, width: 100, height: 100, type: "lava", variable: lava},
    {x: 1100, y: $canvas.height-50, width: 200, height: 100, type: "lava", variable: lava},
    {x: 1560, y: $canvas.height-50, width: 130, height: 100, type: "lava", variable: lava},
    {x: 2000, y: $canvas.height-50, width: 100, height: 100, type: "lava", variable: lava}
  ];

  drawGround = function() {
    for (i=0; i<platforms.length;i++) {
      var xStart = platforms[i].x;
      var yStart = platforms[i].y;
      var xNumber = platforms[i].width/brickObject.width;
      var yNumber = platforms[i].height/brickObject.height;

        for(k=0;k<xNumber;k++) {
    				for(l=0;l<yNumber;l++) {
    					context.drawImage(platforms[i].variable, xStart + brickObject.width * k - frame, yStart + brickObject.height * l, brickObject.width, brickObject.height)
				    }
			   }
      }

    for (i=0; i<lavaGround.length;i++) {
        var xStart = lavaGround[i].x;
        var yStart = lavaGround[i].y;
        var xNumber = lavaGround[i].width/lavaObject.width;
        var yNumber = lavaGround[i].height/lavaObject.height;

          for(k=0;k<xNumber;k++) {
      				for(l=0;l<yNumber;l++) {
      					context.drawImage(lavaGround[i].variable, xStart + lavaObject.width * k - frame, yStart + lavaObject.height * l, lavaObject.width, lavaObject.height)
  				    }
  			   }
    }
  }

//general detect collision function
detectCollision = function(box1, box2) {
	return  (box1.x <= box2.x + box2.width - 15 && box2.x <= box1.x + box1.width - 15 && box1.y <= box2.y + box2.height && box2.y <= box1.y + box1.height)
}

//detect collisions with ground
detectCollisions = function() {
  	for(i=0;i<platforms.length;i++) {
  		if(detectCollision(player, platforms[i])) {
  			player.collided = true;

        if(player.y + player.height - platforms[i].y > 0)  {
    			player.collided = true;
          player.velocityY = 0;
          player.collidedDirection = "down";
          player.inAir = false;
          player.y = platforms[i].y - player.height;
          return;
        }

      }
    }
    //lava detection kills player
    for(i=0;i<lavaGround.length;i++) {
  		if(detectCollision(player, lavaGround[i])) {
  			player.collided = true;

        if(player.y + player.height - lavaGround[i].y > 15)  {
          player.collided = true;
    			player.status = 'dead';
          return;
        }

      }
    }

    //ground detectin for enemies
    for(j=0;j<enemies.length;j++) {
        for(i=0;i<platforms.length;i++) {
          if(detectCollision(enemies[j], platforms[i])) {
            enemies[j].collided = true;

            if(enemies[j].y + enemies[j].height - platforms[i].y > 0){
              // console.log(enemies[j].y, enemies[j].height, platforms[i].y); //see where enemies land
              enemies[j].collided = true;
              enemies[j].velocityY = 0;
              enemies[j].y = platforms[i].y - enemies[j].height;
              return;
            }

          }
        }
      }

    //ground detection for boss
}

detectCollisionsForBoss = function() {
for(i=0;i<platforms.length;i++) {
  if(detectCollision(bosses[0], platforms[i])) {
    bosses[0].collided = true;

    if(bosses[0].y + bosses[0].height - platforms[i].y > 0)  {
      console.log(bosses[0].y, bosses[0].y + bosses[0].height - platforms[i].y);
      bosses[0].collided = true;
      bosses[0].velocityY = 0;
      bosses[0].collidedDirection = "down";
      bosses[0].y = platforms[i].y - bosses[0].height;
      return;
    }

  }
}
}

function moveFrame() {
	frame = Math.max(frame,player.x - $canvas.width/2);
}

//create enmies
var enemy = new Image();
enemy.src = 'Images/rohon/smash-straight4_reversed.png';

var boss = new Image();
boss.src = 'Images/rohon/special7-upgraded_reverse.png';

enemyGravity = 8;
var enemies = [
  {x: Math.floor(Math.random() * 3000)+ 150, y: 300, width:40, height:40, alive: true, going_positive: true,  speed: 0.1, velocityY: enemyGravity , collided: false},
  {x: Math.floor(Math.random() * 3000)+ 150, y: 300, width:40, height:40, alive: true, going_positive: true,  speed: 0.1, velocityY: enemyGravity, collided: false},
  {x: Math.floor(Math.random() * 3000)+ 150, y: 300, width:40, height:40, alive: true, going_positive: true,  speed: 0.1, velocityY: enemyGravity, collided: false},
  {x: Math.floor(Math.random() * 3000)+ 150, y: 300, width:40, height:40, alive: true, going_positive: true,  speed: 0.1, velocityY: enemyGravity , collided: false},
  {x: Math.floor(Math.random() * 3000)+ 150, y: 300, width:40, height:40, alive: true, going_positive: true,  speed: 0.1, velocityY: enemyGravity , collided: false},
  {x: Math.floor(Math.random() * 3000)+ 150, y: 300, width:40, height:40, alive: true, going_positive: true,  speed: 0.1, velocityY: enemyGravity , collided: false},
  {x: Math.floor(Math.random() * 3000)+ 150, y: 300, width:40, height:40, alive: true, going_positive: true,  speed: 0.1, velocityY: enemyGravity , collided: false}
];

var bosses = [
  {x: platforms[platforms.length - 1].x + platforms[platforms.length - 1].width/2 , y: 0, width:120, height:100, health: 100, alive: true, going_positive: true,  speed: 0.1, velocityY: enemyGravity , collided: false}
];

drawEnemies = function() {
	for(i=0;i<enemies.length;i++) {
		if(enemies[i].alive) {
			context.drawImage(enemy, enemies[i].x - frame, enemies[i].y, enemies[i].width, enemies[i].height);
		}
    enemies[i].y += enemies[i].velocityY
	}

  for(i=0;i<bosses.length;i++) {
    if(bosses[i].alive) {
      context.drawImage(boss, bosses[i].x - frame, bosses[i].y, bosses[i].width, bosses[i].height);
    }
    bosses[i].y += bosses[i].velocityY
  }
}

detectCollisionWithEnemies = function() {
	for(i=0;i<enemies.length;i++) {
		if(enemies[i].alive) {
			if(detectCollision(player, enemies[i]) && ((player.y + player.height) - enemies[i].y < 10)) {
        console.log(player.x, enemies[i].x)
				player.velocityY = -2
				enemies[i].alive = false;
        console.log('killed');
			} else if(detectCollision(player, enemies[i])) {
				collidedWithEnemy = true;
        player.status = 'dead';
			}
		}
	}
}

detectCollisionWithBoss = function() {
	for(i=0;i<bosses.length;i++) {
		if(bosses[i].alive) {
			if(detectCollision(player, bosses[i]) && ((player.y + player.height) - bosses[i].y < 10)) {
				player.velocityY = -2;
        bosses[0].health -= 1;
        if (bosses[0].health < 1){
          bosses[0].alive = false;
        }
        console.log('boss hit');
			} else if(detectCollision(player, bosses[i])) {
				player.status='dead';
			}
		}
	}
}
