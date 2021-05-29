import Game from "./game.js";

let socket = io("https://snakegameonline.herokuapp.com/");

let newGame = new Game({
    socket,
});

let modal = document.getElementById("content");
let count = document.getElementById("counter");

socket.on("startgame", () => {
    let counter = 5;

    let timer = setInterval(() => {
        if( counter == 0 ) {
            clearInterval(timer);
            modal.style.display = "none";
            newGame.iniciarJogo();
        }
        else{
            count.innerHTML = `${counter}`;
            counter--;
        }
    }, 1000);
});

socket.on("restartgame", () => {
    window.location.reload();
});