window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  const fullScreen = document.getElementById('fullScreenButton')
  canvas.width = 800;
  canvas.height = 720;
  let enemies = []
  let score = 0 
  let gameOver = false

  class InputHandler {
    constructor() {
      this.keys = [];
      this.touchY = ''
      this.touchTreshold = 30
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowDown" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight") &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
        }
        else if (e.key === 'Enter' && gameOver) restartGame()
        console.log(e.key, this.keys,'hello');
      });
      window.addEventListener("keyup", (e) => {
        if (
          e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight"
        ) {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
        console.log(e.key, this.keys,'goodbye');
      });
      window.addEventListener('touchstart',e =>{
       this.touchY = e.changedTouches[0].pageY
      })
      window.addEventListener('touchmove',e =>{
      const swipeDistance = e.changedTouches[0].pageY - this.touchY
      if(swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1){
       this.keys.push('swipe up')
      }else if (swipeDistance > this.touchTreshold && this.keys.indexOf('swipe down') === -1){
        this.keys.push('swipe down')
      }
      if(gameOver){
        restartGame()
      }
      })
      window.addEventListener('touchend',e =>{
      console.log(this.keys);
      this.keys.splice(this.keys.indexOf('swipe up'),1)
      this.keys.splice(this.keys.indexOf('swipe down'),1)
      })

    }
  }
  // console.log(ctx);
  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById("playerImage");
      this.frameX = 0;
      this.maxFrame = 8
      this.fps = 20
      this.frameTimer = 0 
      this.frameInterval = 1000/this.fps
      this.frameY = 0;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
    }
    
    restart(){
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.maxFrame = 8
      this.frameY = 0;
    }

    draw(context) {
      // context.strokeStyle = 'white'
      // context.strokeRect(this.x,this.y,this.width,this.height)
      // context.beginPath()
      // context.arc(this.x + this.width/2,this.y + this.height/2,this.width/2,0,Math.PI * 2)
      // context.stroke()
      // context.strokeStyle = 'blue'
      // context.beginPath()
      // context.arc(this.x,this.y,this.width/2,0,Math.PI * 2)
      // context.stroke()


      //* uncomment out the above code if you want to see the collosion detction areas in blue and white do the same for draw method in the Enemy class
      //* the only thing you need is the context.drawImage method in this draw function
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
      //  1 * this.height,this.width,this.height,this.x,this.y,this.width,this.height
      //* frameX and frameY is what makes it change the cureent sprite on the sprite sheet i.e movement
    }
    upadte(input,deltaTime,enemies) {
    
      enemies.forEach(enemy =>{
        const dx = (enemy.x + enemy.width/2) - (this.x + this.width/2)
        const dy = (enemy.y + enemy.height/2) - (this.y + this.height/2)
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < enemy.width/2 + this.width/2){
         gameOver = true
        
        }
      } )



      if(this.frameTimer > this.frameInterval){

        if(this.frameX >= this.maxFrame){
          this.frameX = 0
          console.log(this.frameX);
        }else{
          this.frameX++
        }
        this.frameTimer = 0
      }else{
        this.frameTimer += deltaTime
      }
      if (input.keys.indexOf("ArrowRight") > -1) {
        this.speed = 5;
        console.log(this.speed);
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        this.speed = -5;
      } else if ((input.keys.indexOf("ArrowUp") > -1 || input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('swipe up') > -1) && this.onGround()) {
        this.vy -= 32;
      } else {
        this.speed = 0;
      }
      this.x += this.speed;
      if (this.x < 0) {
        this.x = 0;
      } else if (this.x > this.gameWidth - this.width) {
        this.x = this.gameWidth - this.width;
      }
      this.y += this.vy;
      if (!this.onGround()) {
        this.vy += this.weight;
        this.maxFrame = 5
        this.frameY = 1;
      } else {
        this.vy = 0;
        this.maxFrame = 8
        this.frameY = 0;
      }
      if (this.y > this.gameHeight - this.height) {
        this.y = this.gameHeight - this.height;
        console.log(this.y);
      }
    }

    onGround() {
      // console.log(this.y);
      return this.y >= this.gameHeight - this.height;
    }
  }

  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = document.getElementById("backgroundImage");
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      //* this.width is the width of the background image in px this.height is the height
      this.speed = 7;
    }
    restart(){
      this.x = 0;
      console.log(this.x);
     

    }

    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.x + this.width - this.speed,
        this.y,
        this.width,
        this.height
      ); //* this line makes it appear like endless scroll, two background images are drawn on the canvas i.e the line above
    }
    upadte() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) {
        this.x = 0;
      }
    }
  }

  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = document.getElementById("enemieImage");
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 5
      this.fps = 20
      this.fameTimer = 0 
      this.frameInterval = 1000/this.fps
      this.speed = 8
      this.markedForDeletion = false
    }
    // restart(){

    // }
    draw(context) {
      // context.strokeStyle = 'white'
      // context.strokeRect(this.x,this.y,this.width,this.height)
      // context.beginPath()
      // context.arc(this.x + this.width/2,this.y + this.height/2,this.width/2,0,Math.PI * 2)
      // context.stroke()
      // context.strokeStyle = 'blue'
      // context.beginPath()
      // context.arc(this.x,this.y,this.width/2,0,Math.PI * 2)
      // context.stroke()
      context.drawImage(
        this.image,
        this.frameX * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  
     update(deltaTime){
      if(this.fameTimer > this.frameInterval){

        if(this.frameX >= this.maxFrame){
          this.frameX = 0
          console.log(this.frameX);
        }else{
          this.frameX++
          this.fameTimer = 0
        }
      }else{
        this.fameTimer += deltaTime
      }
      this.x-= this.speed
      if(this.x < 0 - this.width){
        this.markedForDeletion = true
        score++
      }
     }
  
  }

  // enemies.push(new Enemy(canvas.width, canvas.height))
  function handleEnemy(deltaTime) {
    if (enemieTimer > enemieInterval + randomEnemyInterval){
      enemies.push(new Enemy(canvas.width, canvas.height))
      randomEnemyInterval = Math.random() * 1000 + 500
      
      enemieTimer = 0
      console.log(enemieTimer);
    }else{
      enemieTimer += deltaTime
    }
    enemies.forEach(enemy => {
      enemy.draw(ctx)
      // console.log(ctx);
      enemy.update(deltaTime)
    })
    enemies = enemies.filter(enemy => !enemy.markedForDeletion)
  
  }

  function displayStatusText(context) {
    context.textAlign = 'left'
    context.font = '40px Helvetica'
    context.fillStyle = 'black'
    context.fillText(`Score: ${score}`,20,50)
    context.fillStyle = 'white'
    context.fillText(`Score: ${score}`,22,52)
    if(gameOver){
      context.textAlign = 'center'
      context.fillStyle = 'black'
      context.fillText(`Game over press Enter or swipe up to restart`,canvas.width/2,200)
    context.fillStyle = 'white'
    context.fillText(`Game over press Enter or swipe up to restart`,canvas.width/2,202)
    }
  }

  function toggleFullScreen(){
    console.log(document.fullscreenElement);
    if(document.fullscreenElement){
      console.log('yoooo');
    }
  }
toggleFullScreen()
function restartGame(){
player.restart()
background.restart()
 enemies = []
 score = 0 
 gameOver = false
 animate(0);
}
  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);
  let lasTime = 0
  let enemieTimer = 0
  let enemieInterval = 1000
  let randomEnemyInterval = Math.random() * 1000 + 500
  // const enemy_1 = new Enemy(canvas.width, canvas.height);
  // player.draw(ctx)
  // player.upadte()

  function animate(timeStamp) {
    const deltaTime = timeStamp - lasTime
    lasTime = timeStamp
    // console.log(deltaTime);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx); //* this line draws the actual background image onto the canvas, the below lines do the same for the player
    // background.upadte()
    player.draw(ctx);
    player.upadte(input,deltaTime,enemies);
    // enemy_1.draw(ctx);
    // enemy_1.update()
    handleEnemy(deltaTime)
    displayStatusText(ctx)
    if(!gameOver){

      requestAnimationFrame(animate);
    }
  }
  animate(0);
});
