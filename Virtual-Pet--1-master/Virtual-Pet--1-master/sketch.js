//Create variables here
var doggo, dog, happy, database, foodS, foodStock;
var garden, bedroom, bathroom;
var fedTime, lastFed;
var foodObj, epic;
var changeState, readGameS, gameS;
var list1 = [];
var test = 25;
function preload()
{
  //load images here
  dog = loadImage("images/dogImg.png");
  happy = loadImage("images/dogImg1.png");
  garden = loadImage("images/img/Garden.png");
  bedroom = loadImage("images/img/Bedroom.png");
  bathroom = loadImage("images/img/washroom.png");
}

function setup() {
  createCanvas(494,801);
  doggo = createSprite(255,340,10,10);
  doggo.addImage(dog);
  doggo.scale = 0.5;
  database = firebase.database();
  foodStock = database.ref("food");
  foodStock.on("value",readStock);
  readGameS = database.ref("gameState");
  readGameS.on("value", readState)
  feed = createButton("Feed your Dog");
  feed.position(640,95);
  feed.mousePressed(feedDog);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  }); 
  addFood = createButton("Add Food");
  addFood.position(750,95);
  addFood.mousePressed(addFoods);
  foodObj = new Food(foodS,lastFed);
}


function draw() {  
  
  if(hour() < (lastFed + 2)){
    writeState("playing");
    foodObj.garden();
  }
  else if(hour() == (lastFed + 2)){
    writeState("sleeping");
    foodObj.bedroom();
  }
  else if(hour() < (lastFed + 4)){
    writeState("business");
    foodObj.bathroom();
  }
  else{
    writeState("hunger");
    background(30,30,30);
    fill("white");
    textSize(16);
    text("Remaining meals left: " + foodS,20,60);
    
    if(lastFed >= 12){
      text("Last Fed at " + lastFed%12 + " PM",350,30);
    }
    else if(lastFed == 0){
      text("Last Fed at 12 AM",350,30);
    }
    else{
      text("Last Fed at " + lastFed + " AM");
    }
    feed.show();
    addFood.show();
    doggo.addImage(dog);
    foodObj.display();
  }
  console.log(gameS);
  if(gameS != "hunger"){
    feed.hide();
    addFood.hide();
    doggo.remove();
  }
  drawSprites();
}
 
function readStock(data){
  foodS = data.val();
}
function writeStock(x){
  if(x <= 0){
    x = 0;
  }
  else{
    x -= 1;
  }
  database.ref('/').update({
    food:x
  })
}

function readState(data){
  gameS = data.val();
}
function writeState(x){
  database.ref('/').update({
    gameState:x
  })
}
function feedDog(){
  doggo.addImage(happy);
  console.log(foodS);
  foodS -= 1;
  foodObj.updateFood(foodS);
  list1[0] -= 1;
  database.ref('/').update({
    food : foodS,
    FeedTime : hour()
  })
  //console.log(foodObj.getFood());
}
function addFoods(){
  foodS ++;
  database.ref('/').update({
    food : foodS
  })
  list1[0] += 1;
}




