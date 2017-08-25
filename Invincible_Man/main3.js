// (function (){
//   var requestAnimationFrame = window.requestAnimationFrame
//   window.requestAnimationFrame = requestAnimationFrame;
// })();

  var $canvas = $('.game-window');
  var context = $canvas[0].getContext("2d");
  $canvas.height = window.innerHeight - 50;
  $canvas.width = window.innerWidth - 50;

//creates 2D canvas after window loads
window.onload = function(){
  console.log("Working");
  // $canvas = $('.game-window');
  // context = $canvas[0].getContext("2d");
  gameLoop();
}

//declare global variables
var keys = [];
var frame = 0;
var maxFrame = 0;

//sets controls for game
$('body').on("keydown", function(event) {
  if (event.keyCode === 37 || event.keyCode === 39) {
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
  inAir: false
}

function gameLoop() {
  // requestAnimationFrame(gameLoop);

  // $canvas.height = window.innerHeight - 50;
  // $canvas.width = window.innerWidth - 50;
  $canvas.attr("width", $canvas.width+"px");
  $canvas.attr("height", $canvas.height+"px");
  $canvas.css("border", "2px solid black");


  //draws character
  // context.drawImage(characterDirection, player.x - frame , player.y, player.width, player.height);

  //calls all other functions
  moveCharacter();
  detectCollisions();
  moveFrame();
  drawPlatforms();
  drawEnemies();


  // console.log('Positive means player through floor', player.y + player.height - platforms[i].y  );

  //end game
  if (player.x === platforms[platforms.length-1].x + 10) {
    alert('Game Over')
  }

  requestAnimationFrame(gameLoop);
};

function moveCharacter() {
  // context.drawImage(characterDirection, player.x - frame , player.y, player.width, player.height);

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
      characterDirection = forward;
    while (player.velocityX < player.maxSpeed) {
      player.velocityX += 1;
      player.x += player.velocityX;
    }
    player.x += player.velocityX
  }
  else {
    player.velocityX = 0;
  }

  //character jumps
  $('body').on("keydown", function(event) {
    if (event.keyCode === 38 && player.inAir === false) {
      player.velocityY = -12;
      player.inAir = true;
    }
  })

  player.velocityY += player.gravity;
  player.y += player.velocityY;

  context.drawImage(characterDirection, player.x - frame , player.y, player.width, player.height);
}

  var brick = new Image();
  var brick2 = new Image();
  var brick3 = new Image();

  brick3.src = "Images/brick3.jpg";
  brick2.src = "Images/brick2.png";
  brick.src = "Images/brick.png";

  var brickObject = {
    width: 20,
    height: 20
  }

  var platforms = [
  {x: 0, y: $canvas.height-150, width: 500, height: 150, type: "brick", variable: brick, shm: false},
  // {x: 530, y: $canvas.height-250, width: 125, height: 50, type: "brick", variable: brick, shm: false},
  // {x: 700, y: $canvas.height-150, width: 500, height: 150, type: "brick", variable: brick, shm: false},
  // {x: 1300, y: $canvas.height-150, width: 500, height: 150, type: "brick", variable: brick, shm: false},
  // {x: 2000, y: $canvas.height-150, width: 300, height: 150, type: "brick", variable: brick, shm: false},

  //winning platforms
  // {x: 2500, y: window.innerHeight-300, width: 50, height: 50, type: "brick", variable: brick, shm: false}
  ];

  drawPlatforms = function() {
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
  }

detectCollision = function(box1, box2) {
	return (box1.x <= box2.x + box2.width && box2.x <= box1.x + box1.width && box1.y <= box2.y + box2.height && box2.y <= box1.y + box1.height)
}

detectCollisions = function() {
	var resultforloop = false;
	for(i=0;i<platforms.length;i++) {
		if(detectCollision(player, platforms[i])) {
			resultforloop = true;
			player.collided = true;

      if(player.y + player.height - platforms[i].y > 0 && player.x < platforms[i].x + player.width)  {
        resultforloop = true;
  			player.collided = true;
        player.velocityY = 0;
        player.collidedDirection = "down";
        player.inAir = false;
        player.y = platforms[i].y - player.height;
        return;
      }
      else if(player.x > platforms[i].width - 50 + player.width  && player.inAir === true ) {
        player.collided = false;
      }
    }
  }
}


function moveFrame() {
	frame = Math.max(frame,player.x - $canvas.width/2);
	maxFrame = frame;
}

var enemy = new Image();
enemy.src = 'Images/rohon/smash-straight4_reversed.png';

var enemies = [
  {x: 300, y: platforms[0].y -40, width:40, height:40, shm:{max:360, min:340}, alive: true, going_positive: true,  speed: 0.1}
];

drawEnemies = function() {
	for(i=0;i<enemies.length;i++) {
		if(enemies[i].alive) {
			context.drawImage(enemy, enemies[i].x - frame, enemies[i].y, enemies[i].width, enemies[i].height);
		} else {
			if(enemies[i].height > 0)
				context.drawImage(enemy, enemies[i].x - frame, enemies[i].y, enemies[i].width, enemies[i].height);
		}
	}
}
