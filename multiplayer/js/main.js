import Game from "./game.js";

let socket = io("https://snakegameonline.herokuapp.com/");

let newGame = new Game({
    socket,
});

let element = document.getElementById("play");
let modal = document.getElementById("content");

element.addEventListener("click", () => {
    modal.style.display = "none";
    newGame.iniciarJogo();
});
