window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 720;

  class InputHandler {
    constructor() {
      this.keys = [];
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
        // console.log(e.key, this.keys,'hello');
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
        // console.log(e.key, this.keys,'goodbye');
      });
    }
  }

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = width;
      this.height = height;
      this.x = 0;
      this.y = 0;
    }
    draw(contex){
      context.fillStyle ='white'
     contex.fillRect(this.x,this.y,this.width,this.height)
    }
  }

  class Background {}

  class Enemy {}

  function handleEnemy() {}

  function displayStatusText() {}

  const input = new InputHandler();
  const player = new Player(canvas.width,canvas.height)

  function animate() {}
});
