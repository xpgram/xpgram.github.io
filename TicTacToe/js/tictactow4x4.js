
// Call methods when the page loads
var gameState = new GameState();
window.onload = function() {watch()};
resetBoard();

// Constructor for a new gamestate object
function GameState() {
    this.boardSize = 4;
    this.board = [];
    this.active = false;
    this.winningSet = [];       // This is because I'm not adding 8 different checkWinCon functions. It's a clumsy solution, but whatever.

    // Resets the board, or blanks it.
    this.resetBoard = function() {
        this.board = [];
        for (let i = 0; i < 16; i++)
            this.board.push("")
    };

    // Returns 'X' for X won, 'O' for you get it, or '' for no win.
    this.getWinner = function() {
        var r = "";     // The return char
        var t = "";     // Used for finding t-t-t, a squence of 3 inside the game board.
        for (let x = 0; x < this.boardSize; x++) {
            for (let y = 0; y < this.boardSize; y++) {
                if (this.board[this.coord(x,y)] === "")
                    continue;
                t = this.board[this.coord(x,y)];

                // Check right
                if ((x+2) < this.boardSize) {
                    if (t === this.board[this.coord(x+1,y)] && t === this.board[this.coord(x+2,y)]) {
                        r = t;
                        this.winningSet = [this.coord(x,y), this.coord(x+1,y), this.coord(x+2,y)];
                        break;
                    }
                }

                // Check down
                if ((y+2) < this.boardSize) {
                    if (t === this.board[this.coord(x,y+1)] && t === this.board[this.coord(x,y+2)]) {
                        r = t;
                        this.winningSet = [this.coord(x,y), this.coord(x,y+1), this.coord(x,y+2)];
                        break;
                    }
                }

                // Check down-right
                if ((x+2) < this.boardSize & (y+2) < this.boardSize) {
                    if (t === this.board[this.coord(x+1,y+1)] && t === this.board[this.coord(x+2,y+2)]) {
                        r = t;
                        this.winningSet = [this.coord(x,y), this.coord(x+1,y+1), this.coord(x+2,y+2)];
                        break;
                    }
                }

                // Check up-right
                if ((x+2) < this.boardSize & (y-2) >= 0) {
                    if (t === this.board[this.coord(x+1,y-1)] && t === this.board[this.coord(x+2,y-2)]) {
                        r = t;
                        this.winningSet = [this.coord(x,y), this.coord(x+1,y-1), this.coord(x+2,y-2)];
                        break;
                    }
                }
            }

            if (r != "") {
                break;
            }
        }

        return r;
    };

    // Returns true if the entire board is full.
    this.isBoardFull = function() {
        var r = true;
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] == "") {
                r = false;
                break;
            }
        }
        return r;
    };

    // Returns the value of a cell: 'X', 'O' or ''
    this.getCellVal = function(n) {
        // If n is out of bounds, I'm just gonna let the thing raise its own exception
        return this.board[n];
    };

    // Converts a coordinate pair into a linear value for accessing the board.
    this.coord = function(x, y) {
        return (y*this.boardSize + x);
    };

    // Sets the value of a cell (must be empty)
    // player must be either 'X' or 'O'
    this.setCellVal = function(player, n) {
        if (player != "X" && player != "O")
            this.board[-4];  // Sure would be a shame if something happened to this little boy, here...

        this.board[n] = player;
    };
}

// "Invisibles" all the X/O board elements, and tells gameState to do the same.
function resetBoard() {
    var arrayO = document.getElementsByClassName("O");
    var arrayX = document.getElementsByClassName("X");
    for (var i = 0; i < arrayO.length; i++)
        arrayO[i].style.transform = "translateY(-100%)";
    for (var i = 0; i < arrayX.length; i++)
        arrayX[i].style.transform = "translateY(100%)";
}

// 'watch()' disables the 'Stop Game' button. Not sure why it's called that.
function watch() {
    btnEnable(document.getElementById('btnStart'));
    btnDisable(document.getElementById('btnStop'));
}

// Determines which player will go first by 'rolling dice'
// The higher roll wins.
function rollForTurn() {
    var rolls = [];
    var roll = '';
    var minRoll = 1;
    var maxRoll = 6;
    var first = "";
    var txt = "";

    // Roll dice for the players. Do not accept p1 == p2 as an answer.
    do {
        rolls = []
        for (let i = 0; i < 2; i++) {
            // random whole number between 1 and 6 inclusive
            roll = Math.floor(Math.random()*(maxRoll - minRoll) + minRoll);
            rolls.push(roll);
        }
    } while (rolls[0] === rolls[1]);
    diceRoll(); // Play highly-engaging sounds for enhance of the **user experiance**

    // Display results to the player.
    txt = "Player 1 rolled [" + rolls[0] + "]<br>";
    writeMsg(txt);
    txt = txt + "Player 2 rolled [" + rolls[1] + "]<br><br>";
    setTimeout(function() {writeMsg(txt);}, 1000);      // Delay 2nd message for soap-opera drama

    // Determine who won
    if (rolls[0] < rolls[1])
        first = "Player 1";
    else
        first = "Player 2";
    
    // Display result
    setTimeout(function(){ txt = txt + first + " wins, please choose a square.";}, 2000);
    setTimeout(function() {writeMsg(txt);}, 2000);
    setTimeout(function() {hideGameMsg();}, 3000);

    return first;       // Okay. So this function isn't exactly.. focused. That's okay.
}

// Initiates the game and rolls for turn order.
function startGame() {
    gameState.active = true;
    resetBoard();
    gameState.resetBoard();

    var activePlayer = rollForTurn();
    
    // Game has started: enable/disable control buttons accordingly.
    btnDisable(document.getElementById('btnStart'));
    btnEnable(document.getElementById('btnStop'));

    var showPlayer = document.getElementById('showPlayer');
    showPlayer.innerHTML = activePlayer;
    showPlayer.style.color = (activePlayer === "Player 1") ? "blue" : "red";
        // The above line, doing anything more would require a pretty sizeable refactor.
        // I guess I could name "Player 1" with a constant.
}

// Disables the given button element, and styles it accordingly.
function btnDisable(btn) {
    btn.style.border = "2px solid rgb(153, 153, 153)";
    btn.style.backgroundColor = "rgb(214, 214, 194)";
    btn.disabled = true;
}

// Enables the given button element, and styles it accordingly.
// (Ah, now I get why it was split into two different functions)
function btnEnable(btn) {
    if (btn.id === "btnStart") {
        btn.style.border = "2px solid rgb(0, 153, 0)";
        btn.style.backgroundColor = "rgb(57, 230, 0)";
    }
    else if (btn.id === "btnStop") {
        btn.style.border = "2px solid rgb(204, 0, 0)";
        btn.style.backgroundColor = "rgb(255, 51, 51)";
    }
    btn.disabled = false;
}

// Ends the current game, clears the board
function stopGame() {
    gameState.active = false;

    // Hide the message display
    hideGameMsg();

    // Swap enabled buttons
    btnDisable(document.getElementById('btnStop'));
    btnEnable(document.getElementById('btnStart'));

    // Set active player display to '?'
    var showPlayer = document.getElementById('showPlayer');
    showPlayer.innerHTML = "Game Stopped";
    showPlayer.style.color = 'purple';

    // Clear the board of all plays
    resetBoard();

    // Clears the move-log
    document.getElementById('boardState').innerHTML = "";
}

// Shows the message dialog
function showGameMsg() {
    document.getElementById('gameMsgBox').style.display = 'block';
}

// Hides the message dialog
function hideGameMsg() {
    clearMsg();
    document.getElementById('gameMsgBox').style.display = 'none';
}

// Writes a message into the message dialog
function writeMsg(txt) {
    document.getElementById('gameMsg').innerHTML = txt;
    showGameMsg();
}

// Clears all text from the message dialog
// Technically, this shouldn't be necessary; writeMsg() shows the dialog and rewrites it,
// otherwise it's always hidden.
function clearMsg() {
    document.getElementById('gameMsg').innerHTML = "";
}

// Saves the user's settings (which player is X)
// This feature is silly. I don't even know what it's for.
function saveSettings() {
    if (gameState.active) {
        alert("Cannot configure; game is already playing!");
        return;
    }

    var p1IsX = document.getElementById("radio-p1x").checked;
    var playerIdentities = ['X', 'O'];
    if (!p1IsX)
        playerIdentities = ['O', 'X'];

    document.getElementById('p1Display').innerHTML = playerIdentities[0];
    document.getElementById('p2Display').innerHTML = playerIdentities[1];
}

// Returns as a 2-element array which identities each player is playing by.
function getAvatars() {
    var p1Avatar = document.getElementById("p1Display").innerHTML;
    var p2Avatar = document.getElementById("p2Display").innerHTML;
    return [p1Avatar, p2Avatar];
}

// Returns the active player's avatar identity thing
function determineAvatar() {
    var avatars = getAvatars();
    var active = document.getElementById('showPlayer').innerHTML;
    return (active === "Player 1") ? avatars[0] : avatars[1];
}

// Handles post-play events, including a game-win check and swapping the turn player.
function avatarPlaced() {
    var showPlayer = document.getElementById('showPlayer');

    // Check for a win
    var winner = gameState.getWinner();
    if (winner != "") {
		showPlayer.innerHTML = "Game Stopped";      // This should be put in a function
        showPlayer.style.color='purple';
        gameState.active = false;
    }
    // Check for a tie
    checkForTie();

    // Swap turn player
    if (showPlayer.innerHTML === "Player 1") {
        showPlayer.innerHTML = "Player 2";
        showPlayer.style.color = "red";
    } else {
        showPlayer.innerHTML = "Player 1";
        showPlayer.style.color = "blue";
    }
}

// Simply checks that all squares have been filled in.
// This, I guess, assumes a win would have been caught first.
function checkForTie() {
    if (gameState.active && gameState.isBoardFull()) {
        var txt = "Oh no! Nobody wins, it was a tie!";
        tieSound();
        writeMsg(txt);
        setTimeout(function() {stopGame();}, 3000);     // I have a question, actually..
                // Why do we have to wrap stopGame() in another function?
    }
}

// Shows the winner-winner-dinner-chicken uh dialog thing
function gameWon(winningSet) {
    gameState.active = false;
    var activePlayer = document.getElementById('showPlayer').innerHTML;
    var txt = "That's three in a row, " + activePlayer + " wins!";
    writeMsg(txt);

    // This needs its own function, too... I just don't.. ugh.
    btnEnable(document.getElementById('btnStart'));
    btnDisable(document.getElementById('btnStop'));
    document.getElementById('showPlayer').innerHTML = "Game Stopped";
    document.getElementById('showPlayer').style.color = 'purple';

    glowBoard(winningSet);
}

// Makes the game board get party
function glowBoard(pos) {
    var squares = document.getElementsByClassName('square');
    var colors = ["#F88", "#8F8", "#88F"];
    var baseColor = squares[0].style.backgroundColor;
    
    for (let p = 0; p < pos.length; p++) {
        let bg = squares[pos[p]];
        for (let i = 1; i <= 10; i++) {
            setTimeout(function() {bg.style.backgroundColor = colors[(i+p) % 3];}, i*100 + p*250);
        }
        setTimeout(function() {bg.style.backgroundColor = baseColor;}, 1100 + p*250);
    }

    blink();
    winSound();
    setTimeout(function() {stopGame();}, 1700);
}

// Plays sounds - ye
function squareSound() {
    var sound = document.getElementById("placeAvatar");
    sound.currentTime = 0;      // Is this so that the sound is repeatable?
    sound.play();
}
function tieSound() {
    var sound = document.getElementById("tieGame");
    sound.currentTime = 0;
    sound.play();
}
function winSound() {
    var sound = document.getElementById("winGame");
    sound.currentTime = 0;
    sound.play();
}
function diceRoll() {
    var sound = document.getElementById("diceRoll");
    sound.currentTime = 0;
    sound.play();
}

// Makes the background get party
function blink() {
    var body = document.getElementById('body');
    var colors = ['#F88', '#FF8', '#8F8', '#8FF', '#88F', '#F8F'];
    for (let i = 0; i <= 17; i++) {
        setTimeout(function() {body.style.backgroundColor = colors[i % colors.length];}, i*100);
    }
    setTimeout(function() {body.style.backgroundColor = 'white';}, 1800);
}

// Animates the square, when clicked.
function squareAnimate(n) {
    if (gameState.active == false)
        return;     // Do nothing--git, git, GIT OUTTA HERE

    // Make sure it's empty..
    if (gameState.getCellVal(n) === "") {
        var square = document.getElementsByClassName("square")[n];
        var paintAvatar = determineAvatar();                            // Gets the player, 'X' or 'O'
        var selected = square.getElementsByClassName(paintAvatar)[0];   // Gets the .X or .O element

        // The animation is different for either letter
        if (paintAvatar == 'O')
            animateO(selected);
        else if (paintAvatar == 'X')
            animateX(selected);
        
        gameState.setCellVal(paintAvatar, n);      // Adds the player's move to the board

        checkForWinCon();
        avatarPlaced();
        squareSound();
    }
}

// Checks whether the game was won, does something
function checkForWinCon() {
    var winner = gameState.getWinner();

    if (winner != "")
        gameWon(gameState.winningSet);

    if (gameState.isBoardFull()) {
        gameState.active = false;

        // So, here's the problem.
        // The button swapping thing? That should be in a wrap-up function that's called whenever the
        // game ends, win or lose. It isn't though.
        // So right now, at this moment, I have no idea if it's happened or not.
        // Do I need to swap the buttons here?
    }
}

// Animates the element O up and down
function animateO(selected) {
    selected.style.transform = (selected.style.transform == "translateY(-100%)" || null) ? "translateY(0)" : "translateY(-100%)";
}

// Animate the element X down and up
function animateX(selected) {
    selected.style.transform = (selected.style.transform == "translateY(100%)" || null) ? "translateY(0)" : "translateY(100%)";
}

// This is a debugging feature I've implemented
function log(txt) {
    old = document.getElementById("test_log").innerHTML;
    document.getElementById("test_log").innerHTML = old + "<br>" + txt;
}

function logh() {
    log('Here');
}

function logBoard() {
    var row = "";
    for (let i = 0; i < gameState.board.length; i++) {
        row = row + gameState.board[i];
        if (gameState.board[i] === "")
            row = row + '_';
        if (row.length === 4) {
            log(row);
            row = "";
        }
    }
}