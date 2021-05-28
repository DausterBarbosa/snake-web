class Game{
    constructor({socket}){
        this.canvas;
        this.context;
        this.points;
        this.enemypoints;

        this.socket = socket;

        this.box = 32;
        this.direction = "right";
        this.jogo;
        this.snake = [];
        this.enemysnake = [];
        this.snake[0] = {
            x: 8 * this.box,
            y: 8 * this.box,
        };
        this.food;

        this.connectSocket();
        this.configureDom();
    }

    configureDom(){
        this.canvas = document.getElementById("snake-game");
        this.context = this.canvas.getContext("2d");

        this.points = document.getElementById("mypoints");
        this.enemypoints = document.getElementById("enemypoints");
        
        document.addEventListener("keydown", (event) => this.update(event));
    }

    connectSocket(){
        this.socket.on("enemyposition", (enemyposition) => {
            this.enemysnake = enemyposition;
        });

        this.socket.on("generateFood", (foodPosition) => {
            this.food = foodPosition;
        });

        this.socket.on("enemypoint", () => {
            this.enemypoints.innerHTML = `${this.enemysnake.length}`;
        });

        this.socket.on("winnergame", () => {
            alert("Você venceu o jogo!!!");
        });

        this.socket.on("lostgame", () => {
            alert("Você perdeu o jogo!!!");
        });
    }

    criarBG(){
        this.context.fillStyle = "lightgreen";
        this.context.fillRect(0, 0, 16 * this.box, 16 * this.box);
    }

    criarCobrinhaInimiga(){
        for(let x = 0; x < this.enemysnake.length; x++){
            this.context.fillStyle = "blue";
            this.context.fillRect(this.enemysnake[x].x, this.enemysnake[x].y, this.box, this.box);
        }
    }
    
    criarCobrinha(){
        for(let x = 0; x < this.snake.length; x++){
            this.context.fillStyle = "green";
            this.context.fillRect(this.snake[x].x, this.snake[x].y, this.box, this.box);
        }
    }
    
    drawFood(){
        this.context.fillStyle = "red";
        this.context.fillRect(this.food.x, this.food.y, this.box, this.box);
    }
    
    limite(){
        if(this.snake[0].x > 15 * this.box && this.direction == "right") this.snake[0].x = 0;
        if(this.snake[0].x < 0 && this.direction == "left") this.snake[0].x = 16 * this.box;
        if(this.snake[0].y > 15 * this.box && this.direction == "down") this.snake[0].y = 0;
        if(this.snake[0].y < 0 && this.direction == "up") this.snake[0].y = 16 * this.box;
    }
    
    update(event){
        if(event.keyCode == 37 && this.direction != "right") this.direction = "left";
        if(event.keyCode == 38 && this.direction != "down") this.direction = "up";
        if(event.keyCode == 39 && this.direction != "left") this.direction = "right";
        if(event.keyCode == 40 && this.direction != "up") this.direction = "down";
    }
    
    verificaColisao(){
        for(let i = 1; i < this.snake.length; i++){
            if(this.snake[0].x == this.snake[i].x && this.snake[0].y == this.snake[i].y){
                clearInterval(this.jogo);
                this.socket.emit("lostgame");
                alert("Você perdeu o jogo!!!");
            }
        }
    }

    verfifyPoints(){
        if(this.snake.length == 20){
            clearInterval(this.jogo);
            this.socket.emit("winnergame");
            alert("Você venceu o jogo!!!")
        }
    }

    updatePoints(){
        this.points.innerHTML = `${this.snake.length}`;
        this.socket.emit("enemypoint");
        this.verfifyPoints();
    }
    
    direcaoCobra(){
        let snakeX = this.snake[0].x;
        let snakeY = this.snake[0].y;
    
        if(this.direction == "right") snakeX += this.box;
        if(this.direction == "left") snakeX -= this.box;
        if(this.direction == "up") snakeY -= this.box;
        if(this.direction == "down") snakeY += this.box;
    
        if(snakeX != this.food.x || snakeY != this.food.y){
            this.snake.pop();
        }
        else{
            this.socket.emit("comidacapturada");
            this.updatePoints();
        }
    
        let newHead = {
            x: snakeX,
            y: snakeY,
        };
    
        this.snake.unshift(newHead);

        this.socket.emit("position", this.snake);
    }

    loopGame(){
        this.limite();
        this.verificaColisao();
        this.criarBG();
        this.criarCobrinha();
        this.criarCobrinhaInimiga();
        this.drawFood();
        this.direcaoCobra();
    }

    iniciarJogo(){
        this.jogo = setInterval(() => this.loopGame(), 100);
    }
}

export default Game;