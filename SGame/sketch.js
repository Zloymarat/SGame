let mouth;
let dirt;
let implant;
let brush;
let deletion;
let reset;
let cursorState;
let toolChange;
let toolDiam = 40;
let collisionCount = 0;
let gameState = 'start';//

let stateChanged = false;                     // 8 ДЗ
let seconds = 0;
let state;

function preload() {
  mouthImg = loadImage("/assets/mouth.png");
  deletionImg = loadImage("/assets/deletion.png");
  dirtImg = loadImage("/assets/dirt.png");
  implantImg = loadImage("/assets/implant.png");
  brushImg = loadImage("/assets/brush.png");
  resetImg = loadImage("/assets/reset.png");
}

function setup() {
  createCanvas(600, 530);
  redrawScene();
  cursor(CROSS);
  
  mouth = createSprite(305, 248, windowWidth, windowHeight)
  mouth.addImage('normal', mouthImg);
  mouth.scale = 1;

  deletionlesGroup = new Group();
  for (let i = 20; i < 26; i = i + 5){
    deletion = createSprite(i * 13.4, 320, 40, 80);
    deletion.addImage(deletionImg);
    deletion.scale = 0.16;
    deletion.setCollider('circle', 0, 0, 35); 
    deletionlesGroup.add(deletion);
    deletion.mass = 1;
  }
  
  dirtlesGroup = new Group();
  for (let i = 10; i < 40; i = i + 20){
    dirt = createSprite(i * 13.8, 320, 40, 80);
    dirt.addImage(dirtImg);
    dirt.scale = 0.16;
    dirt.setCollider('circle', 0, 0, 35);
    dirtlesGroup.add(dirt);
    dirt.mass = 1;
    // dirt.rotate = 180;
  }
  
  implant = createSprite(200, 500, windowWidth, windowHeight)
  implant.addImage('normal', implantImg);
  implant.setCollider('circle', 0, 0, 35);
  implant.scale = 0.1;
  implant.mass = 1;
  
  brush = createSprite(400, 500, windowWidth, windowHeight)
  brush.addImage('normal', brushImg);
  brush.setCollider('circle', 0, 0, 35);
  brush.scale = 0.1;
  brush.mass = 1;
  
  reset= createSprite(570, 70, windowWidth, windowHeight)
  reset.addImage('normal', resetImg);
  reset.setCollider('circle', 0, 0, 50);
  reset.scale = 0.08;
  reset.mass = 1;
}

function draw() {
  push();
  background(180)
  fill(135, 206, 235);
  rect(10, 6, 580, 35)
  pop();
  
  push();
  strokeWeight(2);
  stroke(210);
  fill(135, 206, 235);
  ellipse(450, 500, 40, 40);
  pop();
  
  push();
  strokeWeight(2);
  fill(250, 128, 114);
  stroke(210);
  ellipse(150, 500, 40, 40);
  pop();
  
  if (mouseIsPressed && toolChange === false) {
    if (cursorState == 'brush') {
      brush.position.x = mouseX;
      brush.position.y = mouseY;
    }
    else if (cursorState == 'implant') {
      implant.position.x = mouseX;
      implant.position.y = mouseY;
    }  
  }
/////
  
  if (gameState == 'start') { //
    startGame();
  }
  if (gameOver == 'over' && mouseIsPressed && keyCode === 'r') { ///------
    startGame();
  }
  
  else if(gameState == 'draw') {
    clear();
    everything();
  }

  if (collisionCount < 0){
    gameOver();
  }
  if (collisionCount == +30){
    gameOver();
  }
  //
  
  fill(0)
  textSize(20);
  text(`За максимально короткое время удали и почисти зубы: ${seconds}`, 30, 30);
  
  if (frameCount % 70 == 0) {
    seconds++;
  }  

  drawSprites();
}

function redrawScene() {
  background(180);
  imageMode(CORNER);
  image(mouthImg, 50,-10);
  
  drawTools();
}

function drawTools() {
  push();
  strokeWeight(2);
  stroke(210);
  fill(135, 206, 235);
  ellipse(450, 500, 40, 40);
  pop();
  
  push();
  strokeWeight(2);
  fill(250, 128, 114);
  stroke(210);
  ellipse(150, 500, 40, 40);
  pop();  
}

function mousePressed() {
  let distBlue = dist(mouseX, mouseY, 450, 500);
  let distRed = dist(mouseX, mouseY, 150, 500);
  toolChange = false;
  
  if(distBlue < toolDiam/2) {
    cursorState = 'brush';
    toolChange = true;
  }
  else if(distRed < toolDiam/2) {
    cursorState = 'implant';
    toolChange = true;
  }
}

  function startGame() {
  if (brush.overlap(dirt)) {
      dirt.shapeColor = color(255)
  }
  brush.overlap(dirtlesGroup, addPoint);
  brush.overlap(deletionlesGroup, takePoint);
  
  if (implant.overlap(deletion)) {
    deletion.shapeColor = color(255)
  }
  implant.overlap(deletionlesGroup, addPoint1);
  implant.overlap(dirtlesGroup, takePoint1); 
    
  implant.overlap(reset, takePoint2);
  brush.overlap(reset, takePoint2);
    
  textSize(20);
  text(collisionCount, 60, 70);   
  }
  
  function addPoint(dirtlesGroup, dirt) {
  if (dirt.mass == 1) {
    collisionCount = collisionCount + 10;
    dirt.mass = 0.5;
    dirt.remove();
  }
}
  function takePoint(deletionlesGroup, deletion) {
  if (dirt.mass == 1) {
    collisionCount = collisionCount + 10;
    deletion.mass = 0.5;
    deletion.remove();
  }
}

  function addPoint1(deletionlesGroup, deletion) {
  if (deletion.mass == 1) {
    collisionCount = collisionCount - 10;
    deletion.mass = 0.5;
    deletion.remove();
  }
}
  function takePoint1(dirtlesGroup, dirt) {
  if (dirt.mass == 1) {
    collisionCount = collisionCount - 10;
    dirt.mass = 0.5;
    dirt.remove();
  } 
}    
  function takePoint2(reset) {/////////////////
  if (reset.mass == 1) {
    collisionCount = collisionCount - 50;
    reset.mass = 0.5;
    reset.remove();
  } 
  drawSprites();
}

function gameOver() { //

  background(255, 33, 33);
  fill(0);
  textSize(17);
  text("GAME OVER", 250, 273);
  text('press Restart', 245, 470);
  gameState = 'over';
  
  noLoop();

  button = createButton('Restart')
  button.position(270, 490);
  button.mousePressed(restartGame);
  
  dirtlesGroup.removeSprites();
  deletionlesGroup.removeSprites();
  brush.remove();
  implant.remove();
  reset.remove();

    if (collisionCount === 30) {             // 8ДЗ
    state = 'over'; 
    stateChanged = true;
  }
  if (stateChanged) {                        // 8 ДЗ
    stateChanged = false;
    let body = document.querySelector('body');
    
    let form = document.createElement('form');
    form.style.position = "absolute";
    form.style.top = "16%"; // отступ сверху
    form.style.left = "40%"; 
    form.style.transform = "translateX(-50%)";

    let newBtn = document.createElement('button');
    newBtn.textContent = "Save";
    
    let newInput = document.createElement('input');
    newInput.setAttribute('type', 'text');
    newInput.setAttribute('placeholder', 'Enter your name');
    newInput.setAttribute('maxlength', 20);
    newInput.required = true;
    
    body.appendChild(form);
    form.appendChild(newInput);
    form.appendChild(newBtn);
    
    form.addEventListener('submit', (e) => {
      console.log("button pressed");
      // here will be POST request to server
      form.remove();
      e.preventDefault();
    });
  }                                           // 8 ДЗ
}
function restartGame(){
  document.location.reload(true);
}

