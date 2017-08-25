# Invincible Man

Invincible Man is an 8-bit game designed similarly to the old 2D Mario games. The game features a main character named the Dan the Cave Man who must traverse the map and not be killed by his enemies.

## Technologies Used

The relies heavy on `Javascript` for its running. The game takes place on a canvas HTML element which allows one to place objects on an infinite canvas and access those elements via their x and y positions. `JQuery` is also used in this program in order to manipulate the DOM. All images used are sprites found on the internet including the characters as well as the ground platforms and lava. The webpage is setup with `HTML` and styled with `CSS` as usual.

## Extra Aid

The project was planned out using Trello.com which allows users to append cards to a board. These cards represents items that need to be done, user stories, items to do later, etc. The link to the trello board used for this project is https://trello.com/b/AlUcwlHX.

## Game Play

Players have the ability to run left and right through the use of the arrow keys as well as jump with the up arrow. The character only has the ability to single jump. The player will have to jump over lava pits as well as empty trenches. The character experiences gravity so it's important for the player to keep the character on the stage. Along the way, the player will encounter enemies whom he can jump on top, throw a rock at, or stab to kill. To throw a rock, the player must press the spacebar. In order to stab, the player must press the shift key. The player can only walk forward on the map. Once the left edge of the map moves forward, it can not move back.

## RoadBlocks

So my game board was created using the canvas HTML element. I had to learn some new things in order to get it to work. Another big roadblock was implement the logic so that the screen would move with the character. Even harder was trying to make a rock glide across the screen to simulate a thrown rock. As of the motion was done using javascript on the canvas.

## Future Plans

I hope to add lives to my game that way the player has multiple attempts at completing the game. I would also like to add multiple levels to the game in order to extend the duration of the game.

## Bugs with Game

There are a couple of problems with the game but nothing major that affects the functionality. If you walk slow enough, you can walk off the left edge of the screen and fall to your death. Another bug would be the fact that the character can hit the edge of a platform and he spawns right on top. This means that you don't actually have to land on the platform. Platform for now in this game refers to the ground. 
