// var solutionList = ["Anatomize", "Sanguisugabogg", "Psycho-Frame", "Enemy XII", "Valravn", "200 Stab Wounds", "Cryptworm", "Weeping"]

var url = "https://raw.githubusercontent.com/dav1smcl/metalguessr/refs/heads/main/data.json?token=GHSAT0AAAAAAC5ZT77EL22P5XSO4QNPKCI2Z4XXQRA";

console.log(solution);
var height = 6;
var width = solution.length;

console.log(width);
var row = 0;
var col = 0;

var gameOver = false;

window.onload = function() {
    initialize();
}

function endGame() {
    document.getElementById("background").style.opacity = 0.5;
    document.getElementById("rect").style.opacity = 1;
    document.getElementById("answer").innerText = solution;
    document.getElementById("answer").style.opacity = 1;
    document.getElementById("solutionimg").src = "puzzles/" + solutionIndex + ".png";
    document.getElementById("solutionimg").style.opacity = 1;

}

function initialize() {
    console.log("puzzles/" + solutionIndex + ".png");
    document.getElementById("puzzle").src = "puzzles/" + solutionIndex + ".png";

    var dashes = [];
    var spaces = [];

    for (let d = 0; d < solution.length; d++) {
        if (solution[d] == '-') {
            dashes.push(d);
        }
    }
    for (let s = 0; s < solution.length; s++) {
        if (solution[s] == ' ') {
            spaces.push(s);
        }
    }
    console.log(dashes);
    console.log(spaces);
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            document.getElementById("board").appendChild(tile);
            document.getElementById("board").style.width = ( (width * 64) + (width * 5) ).toString() + "px";

            for (let d = 0; d < dashes.length; d++) {
                if (dashes[d] == c) {
                    document.getElementById(r.toString() + "-" + c.toString()).innerText = "-";
                    document.getElementById(r.toString() + "-" + c.toString()).classList.add("skip");
                }
            }

            for (let s = 0; s < spaces.length; s++) {
                if (spaces[s] == c) {
                    document.getElementById(r.toString() + "-" + c.toString()).innerText = "\u00A0";
                    document.getElementById(r.toString() + "-" + c.toString()).classList.add("skip");
                }
            }
        }
    }

    document.addEventListener("keydown", (e) => {
        if (gameOver) return;

        let currentTile = document.getElementById(row.toString() + "-" + col.toString());

        if (("KeyA" <= e.code && e.code <= "KeyZ") || ("Digit0" <= e.code && e.code <= "Digit9")) {
            if (currentTile.classList.contains("skip")) {
                col++;
                currentTile = document.getElementById(row.toString() + "-" + col.toString());
            }
            if (col < width) {
                if (currentTile.innerText == "") {
                    if ("KeyA" <= e.code && e.code <= "KeyZ") {
                        currentTile.innerText = e.key.toUpperCase();
                    } else if ("Digit0" <= e.code && e.code <= "Digit9") {
                        currentTile.innerText = e.key;
                    }
                    col++;
                }
            }
            else {
                if (col < width) {
                    col++;
                    currentTile = document.getElementById(row.toString() + "-" + col.toString());
                    currentTile.innerText = e.code[3];
                    col++;
                }
            }
        }

        else if (e.code == "Backspace") {
            if (0 < col && col <= width) {
                col--;
            }
            let currentTile = document.getElementById(row.toString() + "-" + col.toString());
            
            if (currentTile.classList.contains("skip")) {
                col--;
                currentTile = document.getElementById(row.toString() + "-" + col.toString());
            }
            currentTile.innerText = "";
        }
        else if (e.code == "Enter") {
            update();
        }

        if (!gameOver && row == height) {
            gameOver = true;
            document.getElementById("answer").innerText = solution;
        }
    })
}

function update() {
    let guess = "";
    document.getElementById("answer").innerText = "";

    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText;
        guess += letter;
    }

    guess = guess.toLowerCase();

    console.log(guess);

    if (guess.length != width) {
        document.getElementById("answer").innerText = "Please enter " + width.toString() + " letters";
        return;
    }

    let correct = 0;

    let letterCount = {};
     
    for (let i = 0; i < width; i++) {
        let letter = solution[i];
        if (letterCount[letter]) {
            letterCount[letter]++;
        }
        else {
            letterCount[letter] = 1;
        }
    }

    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText;
        
        if (letter == solution[c]) {
            currentTile.classList.add("correct");
            correct++;
            letterCount[letter]--;
        }

        if (correct == width) {
            endGame()
        }
    }

    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText;
        
        if (!currentTile.classList.contains("correct")) {
            if (solution.includes(letter) && letterCount[letter] > 0) {
                currentTile.classList.add("present");
                letterCount[letter]--;
            }
            else {
            currentTile.classList.add("absent");
            }
        }
        if (correct == width) {
            endGame()
        }
    }

    row++;
    col = 0;
}