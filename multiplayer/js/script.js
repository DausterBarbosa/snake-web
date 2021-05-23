var socket = io("https://snakegameonline.herokuapp.com/");

let canvas = document.getElementById("snake-game");
let context = canvas.getContext("2d");
let box = 32;
let direction = "right";
let jogo;
let snake = [];
let enemysnake = [];

snake[0] = {
    x: 8 * box,
    y: 8 * box,
};

food = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box,
};

document.addEventListener("keydown", update);

let element = document.getElementById("play");

let modal = document.getElementById("content");

let container = document.getElementById("container");

let oponente = document.getElementById("oponente");
oponente.style.display = "none";

criarBG();
criarCobrinha();
drawFood();

element.addEventListener("click", () => {
    modal.style.display = "none";
    jogo = setInterval(iniciarJogo, 100);
});

socket.on("enemyposition", position => {
    enemysnake = position;
});

socket.on("aguardandooponente", data => {
    console.log(data.status);
    if(data.status == true){
        element.style.display = "none";
        oponente.style.display = "inline";
    }
    else{
        element.style.display = "inline";
        oponente.style.display = "none";
    }
});

function criarBG(){
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, 16 * box, 16 * box);
}

function criarCobrinha(){
    for(x = 0; x < snake.length; x++){
        context.fillStyle = "green";
        context.fillRect(snake[x].x, snake[x].y, box, box);
    }
}

function criarCobrinhaInimiga(){
    for(x = 0; x < enemysnake.length; x++){
        context.fillStyle = "blue";
        context.fillRect(enemysnake[x].x, enemysnake[x].y, box, box);
    }
}

function drawFood(){
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, box, box);
}

function limite(){
    if(snake[0].x > 15 * box && direction == "right") snake[0].x = 0;
    if(snake[0].x < 0 && direction == "left") snake[0].x = 16 * box;
    if(snake[0].y > 15 * box && direction == "down") snake[0].y = 0;
    if(snake[0].y < 0 && direction == "up") snake[0].y = 16 * box;
}

function update(event){
    if(event.keyCode == 37 && direction != "right") direction = "left";
    if(event.keyCode == 38 && direction != "down") direction = "up";
    if(event.keyCode == 39 && direction != "left") direction = "right";
    if(event.keyCode == 40 && direction != "up") direction = "down";
}

function verificaColisao(){
    for(let i = 1; i < snake.length; i++){
        if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
            clearInterval(jogo);
            alert("asdfasdf");
        }
    }
}

function direcaoCobra(){
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(direction == "right") snakeX += box;
    if(direction == "left") snakeX -= box;
    if(direction == "up") snakeY -= box;
    if(direction == "down") snakeY += box;

    if(snakeX != food.x || snakeY != food.y){
        snake.pop();
    }
    else{
        food.x = Math.floor(Math.random() * 15 + 1) * box;
        food.y = Math.floor(Math.random() * 15 + 1) * box;
    }

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    snake.unshift(newHead);

    socket.emit("position", snake);
}

function iniciarJogo(){
    limite();
    verificaColisao();
    criarBG();
    criarCobrinha();
    criarCobrinhaInimiga();
    drawFood();
    direcaoCobra();
}