// var solutionList = ["Anatomize", "Sanguisugabogg", "Psycho-Frame", "Enemy XII", "Valravn", "200 Stab Wounds", "Cryptworm", "Weeping"]

// var solution = solutionList[Math.floor(Math.random() * solutionList.length)];

// var daysPassed = solutionList.indexOf(solution);

// var request = new Request("https://raw.githubusercontent.com/dav1smcl/metalguessr/refs/heads/main/data.json");
// var response = fetch(request).then(response => response.text());
// var data = JSON.parse(response);

// var solutionList = data;
// var solution = solutionList[Math.floor(Math.random() * solutionList.length)];
// var daysPassed = solutionList.indexOf(solution);
// //console.log(solution);

// solution = solution.toUpperCase();

var row = 0;
var col = 0;

var today = new Date();
today.setHours(today.getHours() - 5);
var startDate = new Date("January 30, 2025");
startDate.setHours(startDate.getHours() - 5);
var timeDifference = today - startDate;
var daysPassed = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) - 1;
console.log(daysPassed);


async function preInitialize() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/dav1smcl/metalguessr/refs/heads/main/data.json");
        const solutionList = await response.json();
        var band = solutionList[daysPassed];
        //console.log(band);
        //console.log(band.link);
        var solution = band.name;
        var solution = solution.toUpperCase();
        //console.log(daysPassed);
        //console.log(solution);
        console.log(band);

        var height = 6;
        var width = solution.length;
        //console.log(width);
    
    
        var gameOver = false;

        return { solution, daysPassed, band, height, width, gameOver };
    } catch (error) {
        console.error(error);
    }   
}

window.onload = async function() {
    const result = await preInitialize();
    if (result) {  
        initialize(result);
    }
}

function endGame( { solution, daysPassed, band, height, width, gameOver } ) {
    //console.log(band)
    document.getElementById("background").style.opacity = 0.5;
    document.getElementById("rect").style.opacity = 1;
    document.getElementById("solutionans").innerText = solution;
    document.getElementById("solutionans").style.opacity = 1;
    
    document.getElementById("solutionimg").src = "puzzles/" + daysPassed + ".png";
    document.getElementById("solutionimg").style.opacity = 1;

    document.getElementById("bandlink").href = band.link;
    document.getElementById("bandlink").style.opacity = 1;
    
    document.getElementById("bandgenre").innerText = band.genre;
    document.getElementById("bandgenre").style.opacity = 1;

    // document.getElementById("close").style.opacity = 1;
}

function initialize( { solution, daysPassed, band, height, width, gameOver } ) {
    //console.log("puzzles/" + daysPassed + ".png");
    document.getElementById("puzzle").src = "puzzles/" + daysPassed + ".png";
    document.getElementById("puzzle").style.opacity = 1;
    
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
    //console.log(dashes);
    //console.log(spaces);
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
                    document.getElementById(r.toString() + "-" + c.toString()).classList.add("space");
                }
            }
        }
    }
    
    document.addEventListener("keydown", (e) => {
        if (gameOver) return;
        
        let currentTile = document.getElementById(row.toString() + "-" + col.toString());
        //console.log(row.toString() + "-" + col.toString());
        //console.log(e.code);
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
            update( { solution, daysPassed, band, height, width, gameOver } );
        }
        
        if (!gameOver && row == height) {
            gameOver = true;
            document.getElementById("answer").innerText = solution;
        }
        //console.log(row.toString() + "-" + col.toString());
    })
}

function update( { solution, daysPassed, band, height, width, gameOver } ) {
    let guess = "";
    // document.getElementById("").innerText = "";
    solution = solution.replace(/ /g, "\u00A0");
    guess = guess.replace(/ /g, "\u00A0");
    guess = guess.toLowerCase();
    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText;
        guess += letter;
        //console.log(letter);
    
    }
    console.log(guess);
    console.log(solution);
    
    if (guess.length != width) {
        // document.getElementById("answer").innerText = "Please enter " + width.toString() + " letters";
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
    }
    if (correct == width) {
        endGame( { solution, daysPassed, band, height, width, gameOver } )
    }
    console.log(correct);
    console.log(width); 
    console.log(letterCount);
    row++;
    col = 0;
}