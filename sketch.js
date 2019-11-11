var PLAY = 1;
var END = 0;
var gameState = PLAY;

var girl, girl_running, girl_collided;         
var ground, invisibleGround, groundImage;

var bonesGroup, boneImage;
var obstaclesGroup, obstacle1, obstacle2;
var sound1, sound2, sound3, sound4;
var score;
var gameOver, restart;

var bg1;

function preload(){
  girl_running = loadAnimation("Run.png");
  girl_collided = loadImage("Dead.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("Bone.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  
  gameOverImg = loadImage("gameover.png");
  restartImg = loadImage("restart.png");
  
  sound1 = loadSound ("jump.mp3");
  sound2 = loadSound ("die.mp3");
  sound3 = loadSound ("checkPoint.mp3");
  sound4 = loadSound ("horror.mp3");
  
  bg2 = loadImage ("BG.png");
}

function setup() {
  createCanvas(600, 200);
  
  sound4.play();
  
  bg1 = createSprite(300,100);
  bg1.addImage (bg2);
  bg1.scale = 0.4;
  girl = createSprite(50,140,20,50);
  girl.addAnimation("running", girl_running);
  girl.addAnimation("collided",girl_collided);
  girl.scale = 0.2;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
 
  
  invisibleGround = createSprite(50,140,400,10);
  invisibleGround.visible = false;
  
  bonesGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  gameOver = createSprite(300,50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,130);
  restart.addImage(restartImg);
  
  gameOver.visible = false;
  restart.visible = false;
  
  gameOver.scale = 0.3;
  restart.scale = 0.3;
}

function draw() {
  background("pink");
  textSize (15);
  fill ("black");
  text("Score: "+ score, 500,50);
  girl.collide(invisibleGround);
  
  if (gameState===PLAY){
  score = score + Math.round(getFrameRate()/60);
    if(keyDown("space")) {
    girl.velocityY = -10;
      sound1.play();
  }
  ground.velocityX = -4;
  girl.velocityY = girl.velocityY + 0.8
  if (score>0 && score%100 === 0){
      sound3.play();
    } 
  if (ground.x < 0){
    ground.x = ground.width/2;
     
  }
    
   spawnBones();
  spawnObstacles(); 
    
    if (obstaclesGroup.isTouching(girl)){
      gameState = END;
      sound2.play();
    }
  }
  
  else if (gameState===END){
   gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    girl.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    bonesGroup.setVelocityXEach(0);
    
    //change the trex animation
    girl.changeAnimation("collided", girl_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    bonesGroup.setLifetimeEach(-1); 
    
    if (mousePressedOver(restart)){
    reset();
    }
  }
  
  drawSprites();
}

function spawnBones() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var bone = createSprite(600,120,40,10);
    bone.y = Math.round(random(50,80));
    bone.addImage(cloudImage);
    bone.scale = 0.5;
    bone.velocityX = -3;
    
     //assign lifetime to the variable
    bone.lifetime = 200;
    
    //adjust the depth
    bone.depth = girl.depth;
    girl.depth = girl.depth + 1;
    
    //add each cloud to the group
    bonesGroup.add(bone);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,110,10,40);
    obstacle.velocityX = -4;
    obstacle.setCollider ("rectangle", 0,0, obstacle.width, obstacle.height);
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.7;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  bonesGroup.destroyEach();
  
  girl.changeAnimation("running", girl_running);
  
  score = 0;
  
}