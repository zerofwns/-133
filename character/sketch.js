//stage
var stage = 0;

//character
var posX = 200;
var posY = 432;
var sizeX = 25;
var sizeY = 25;
var state = charFront;

//speed
var moveSpeed = 4;

//jump
var jump = false;
var direction = 1;
var velocity = 2;
var jumpPower = 10;
var fallingSpeed = 4;
var minHeight = 432;
var maxHeight = 0;
var jumpCounter = 0;


function setup() 
{
    createCanvas(1024, 576);
}

function draw() 
{
    if (stage == 0){
        world();
        
        switch (state){
      case 'charJump':
        charJump();
        break;
      case 'charLeft':
        charLeft();
        break;
      case 'charRight':
        charRight();
        break;
      case 'charJumpLeft':
        charJumpLeft();
        break;
      case 'charJumpRight':
        charJumpRight();
        break;
      default:
        charFront();
        break;
        
    }
    
    gravity();
    charControl();
    console.log(key);  
    }
  
}

function charControl()
{
     if (keyIsDown(UP_ARROW)) {
        jump = true;
        state = 'charJump';
     }
    if (keyIsDown(DOWN_ARROW)) {
        state = 'charFront';
     }
    if (keyIsDown(RIGHT_ARROW)) {
        if (keyIsDown(UP_ARROW)){
            posX += moveSpeed;
            jump = true;
            state = 'charJumpRight';
        }
        else {
        posX += moveSpeed;
        state = 'charRight';
        }
     }
    if (keyIsDown(LEFT_ARROW)) {
        if (keyIsDown(UP_ARROW)){
            posX -= moveSpeed;
            jump = true;
            state = 'charJumpLeft';
        }
        else {
        posX -= moveSpeed;
        state = 'charLeft';
        }
    }
}

function gravity()
{
  if(posY >= minHeight && jump == false){
      posY=posY;
      jumpCounter = 0;
      state = 'charFront';
  }
    else{
      posY = posY + (direction * velocity);  
    }
    
  if(jump){
      if(posY <= maxHeight || jumpCounter >= jumpPower){
          if(posY >= minHeight){
              posY = minHeight;
              jump = false;
          }
          else{
          velocity = fallingSpeed; //fall
          }
      }
      else{
          velocity = -jumpPower; //jump
          jumpCounter = jumpCounter + 1;
      }
  }
    else{
      velocity = fallingSpeed; //fall
    }
}

function charFront()
{
    noStroke();
    fill(0, 0, 0);
    circle(posX, posY - 100, 29); //head
    stroke(0, 0, 0);
    strokeWeight(8);
    line(posX, posY - 100, posX , posY - 50); //body
    line(posX, posY - 90, posX + 8 , posY - 70); //right hand 
    line(posX, posY - 90, posX - 10 , posY - 70); //left hand
    line(posX - 10, posY - 70, posX - 10 , posY - 50); //left hand_s
    line(posX + 8, posY - 70, posX + 10 , posY - 50); //right hand_s
    line(posX, posY - 55, posX - 5 , posY - 30); //left leg
    line(posX, posY - 55, posX + 5 , posY - 30); //right leg
    line(posX - 5, posY - 30, posX - 8 , posY); //left knee
    line(posX + 5, posY - 30, posX + 8 , posY); //right knee
}

function charRight()
{
    noStroke();
    fill(0, 0, 0);
    circle(posX, posY - 100, 29); //head
    stroke(0, 0, 0);
    strokeWeight(8);
    line(posX, posY - 100, posX , posY - 50); //body
    line(posX, posY - 90, posX + 10 , posY - 70); //right hand 
    line(posX, posY - 90, posX - 12, posY - 70); //left hand
    line(posX - 12, posY - 70, posX - 11, posY - 50); //left hand_s
    line(posX + 10, posY - 70, posX + 20 , posY - 55); //right hand_s
    line(posX, posY - 55, posX , posY - 30); //left leg
    line(posX, posY - 55, posX + 7, posY - 30); //right leg
    line(posX, posY - 30, posX - 12 , posY); //left knee
    line(posX + 7, posY - 30, posX + 8 , posY); //right knee
}

function charLeft()
{
    noStroke();
    fill(0, 0, 0);
    circle(posX, posY - 100, 29); //head
    stroke(0, 0, 0);
    strokeWeight(8);
    line(posX, posY - 100, posX , posY - 50); //body
    line(posX, posY - 90, posX + 12, posY - 70); //right hand 
    line(posX, posY - 90, posX - 10, posY - 70); //left hand
    line(posX - 10, posY - 70, posX - 20, posY - 55); //left hand_s
    line(posX + 12, posY - 70, posX + 11, posY - 50); //right hand_s
    line(posX, posY - 55, posX - 7, posY - 30); //left leg
    line(posX, posY - 55, posX , posY - 30); //right leg
    line(posX - 7, posY - 30, posX - 8, posY); //left knee
    line(posX , posY - 30, posX + 12, posY); //right knee
    
}

function charJump()
{
    noStroke();
    fill(0, 0, 0);
    circle(posX, posY - 100, 29); //head
    stroke(0, 0, 0);
    strokeWeight(8);
    line(posX, posY - 100, posX , posY - 50); //body
    line(posX, posY - 85, posX + 20 , posY - 80); //right hand 
    line(posX, posY - 85, posX - 20 , posY - 80); //left hand
    line(posX - 20, posY - 80, posX - 35 , posY - 80); //left hand_s
    line(posX + 20, posY - 80, posX + 35 , posY - 80); //right hand_s
    line(posX, posY - 55, posX - 15 , posY - 30); //left leg
    line(posX, posY - 55, posX + 15 , posY - 30); //right leg
    line(posX - 15, posY - 30, posX - 8 , posY); //left knee
    line(posX + 15, posY - 30, posX + 8 , posY); //right knee
}

function charJumpRight()
{
    noStroke();
    fill(0, 0, 0);
    circle(posX + 10, posY - 100, 29); //head
    stroke(0, 0, 0);
    strokeWeight(8);
    line(posX + 10, posY - 100, posX , posY - 50); //body
    line(posX +10, posY - 90, posX + 8 +10, posY - 70); //right hand 
    line(posX +10, posY - 90, posX - 17 +10 , posY - 80); //left hand
    line(posX - 17 +10, posY - 80, posX - 10, posY - 60); //left hand_s
    line(posX + 8 +10, posY - 70, posX + 20 +10, posY - 80); //right hand_s
    line(posX, posY - 55, posX, posY - 30); //left leg
    line(posX, posY - 55, posX + 20, posY - 30); //right leg
    line(posX, posY - 30, posX - 30, posY); //left knee
    line(posX + 20, posY - 30, posX + 8, posY); //right knee
}

function charJumpLeft()
{
    noStroke();
    fill(0, 0, 0);
    circle(posX, posY - 100, 29); //head
    stroke(0, 0, 0);
    strokeWeight(8);
    line(posX, posY - 100, posX , posY - 50); //body
    line(posX, posY - 90, posX + 17 , posY - 80); //right hand 
    line(posX, posY - 90, posX - 8 , posY - 70); //left hand
    line(posX - 8, posY - 70, posX - 20 , posY - 80); //left hand_s
    line(posX + 17, posY - 80, posX + 10 , posY - 60); //right hand_s
    line(posX, posY - 55, posX - 20, posY - 30); //left leg
    line(posX, posY - 55, posX, posY - 30); //right leg
    line(posX - 20, posY - 30, posX - 8, posY); //left knee
    line(posX, posY - 30, posX + 30 , posY); //right knee
}

function world()
{
    background(100, 155, 255);

    noStroke();
    fill(0, 155, 0);
    rect(0, 432, 1024, 144); //grass   
}
