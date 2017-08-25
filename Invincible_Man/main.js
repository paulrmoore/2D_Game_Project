window.onload = function(){
  console.log("Working");

  var gameWindowWidth = parseInt($('.game-window').css('width'));
  var gameWindowHeight = parseInt($('.game-window').css('height'));
  console.log(gameWindowWidth);

  $img = $('<img>').attr('src','Images/rohon/hit1-upgraded.png').attr('class','sprite');
  $img.css({
    'position':'relative',
    'top':gameWindowHeight/2-40,
    'left':gameWindowWidth/2-20
  })
  $('.game-window').append($img);


  var currentKey;
  $(document).keydown(function(event){
    console.log(event.keyCode);

    switch(event.keyCode) {
      case 37:
        characterWalk('left');
        break;
      case 38:
      characterWalk('top');
        break;
      case 39:
        characterWalk('right');
        break;
    }
  })

  var characterWalkSpeed = 10;
  var characterJumpSpeed = 250;

  function characterWalk (direction) {
    if (direction === 'left') {
      $('.sprite').animate({'transform': 'transformX(-10px)'},characterWalkSpeed);
    }
    else if (direction === "right") {
      $('.sprite').animate({'transform': 'transformX(10px)'},characterWalkSpeed);
      console.log('right');
    }
    else if (direction === 'top') {
      $('.sprite').animate({top: '-=80'},characterJumpSpeed);
      $('.sprite').animate({top: '+=80'},characterJumpSpeed);
    }
  }

}
