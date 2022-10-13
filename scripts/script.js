
// ##################################################################################
// VARIABLES
// ##################################################################################

let numOfRows = 5;
let numOfColumns = 5;
let isMoveableShowing = false;
let selectedId = "";

// name of piece => CustomPiece
let customPieces = {};
// color-name => number
let numOfEachPiece = { "black-king": 0, "white-king": 0, "black-pawn": 0, "white-pawn": 0, "black-knight": 0, "white-knight": 0, "black-rook": 0, "white-rook": 0, "black-bishop": 0, "white-bishop": 0, "black-queen": 0, "white-queen": 0 };

let availibleEnPassant = null;
let turnBaseOn = true;
let whiteTurn = true;
let transforming = false;
let gameOver = true;

// white danger zone = places white pieces can be captured; black danger zone = places black pieces can be captured
// white moveable spaces = places that white pieces can move; black moveable spaces = places that black pieces can move
// danger zones but more
// Only difference between colorMoveableSpaces and colorDangerZones is the way that pawns' moves are utilized
// danger zones use the attack spaces; moveable zones use the move spaces
let whiteDangerZones = [];
let blackDangerZones = [];
let blackMoveableSpaces = [];
let whiteMoveableSpaces = [];

let blackKingDots = 0;
let whiteKingDots = 0;

const pointsOfEachPiece = { "king": 40, "pawn": 1, "knight": 3, "rook": 5, "bishop": 3, "queen": 9 };
const defaltPieces = ["king", "pawn", "knight", "rook", "bishop", "queen", "black-king", "white-king", "black-pawn", "white-pawn", "black-knight", "white-knight", "black-rook", "white-rook", "black-bishop", "white-bishop", "black-queen", "white-queen"];

let whiteScore = 0;
let blackScore = 0;

let selectedPiece = "";
let isCustomizing = false;
let settingRow = false;
let settingColumn = false;
let removing = false;



// ##################################################################################
// BOARD MAKING
// ##################################################################################

// gets user input for number of rows
function setRows() {
    if ((parseInt(document.getElementById("row-input").value) < parseInt(document.getElementById("row-input").min)) || (document.getElementById("row-input").value == "")) {
        document.getElementById("row-input").value = document.getElementById("row-input").min;
    }
    else if (parseInt(document.getElementById("row-input").value) > parseInt(document.getElementById("row-input").max)) {
        document.getElementById("row-input").value = document.getElementById("row-input").max;
    }

    numOfRows = parseInt(document.getElementById("row-input").value);
}

// gets user input for number of columns
function setColumns() {
    if ((parseInt(document.getElementById("column-input").value) < parseInt(document.getElementById("column-input").min)) || (document.getElementById("column-input").value == "")) {
        document.getElementById("column-input").value = document.getElementById("column-input").min;
    }
    else if (parseInt(document.getElementById("column-input").value) > parseInt(document.getElementById("column-input").max)) {
        document.getElementById("column-input").value = document.getElementById("column-input").max;
    }

    numOfColumns = parseInt(document.getElementById("column-input").value);
}

// makes the chess board
function makeBoard() {
    let rowStr = "";
    let columnStr = "";
    let boxWidth = " 70px "
    document.getElementById("container").innerHTML = "";
    for (let i = 0; i < numOfRows; i++) {
        rowStr += boxWidth;
        for (let k = 0; k < numOfColumns; k++) {
            if (!isCustomizing) {
                document.getElementById("container").innerHTML += "<div id=" + i + "-" + k + " onclick=\"hideMoveableSpaces();\" ></div>";
            }
            else {
                document.getElementById("container").innerHTML += "<div id=" + i + "-" + k + " onclick=\"addSelectedPiece('" + i + "-" + k + "');\"></div>";
            }

        }
    }
    for (let o = 0; o < numOfColumns; o++) {
        columnStr += boxWidth;
    }

    if (numOfColumns % 2 != 0) {
        let bool = true;
        for (let x = 0; x < document.getElementById("container").getElementsByTagName("*").length; x++) {
            if (bool) {
                document.getElementById("container").getElementsByTagName("*")[x].classList.add("light-space")
                bool = false;
            }
            else {
                document.getElementById("container").getElementsByTagName("*")[x].classList.add("dark-space")
                bool = true;
            }
        }
    }
    else {
        let bool = true;
        for (let x = 0; x < document.getElementById("container").getElementsByTagName("*").length; x++) {
            if (bool) {
                document.getElementById("container").getElementsByTagName("*")[x].classList.add("light-space")
                bool = false;
            }
            else {
                document.getElementById("container").getElementsByTagName("*")[x].classList.add("dark-space")
                bool = true;
            }

            if ((x + 1) % numOfColumns == 0) {
                bool = !bool;
            }
        }
    }

    document.getElementById("container").style.gridTemplateRows = rowStr;
    document.getElementById("container").style.gridTemplateColumns = columnStr;
}

// makes the chess board with given size
function makeCustomBoard(r, c) {
    let rowStr = "";
    let columnStr = "";
    let boxWidth = " 70px "
    document.getElementById("container").innerHTML = "";
    for (let i = 0; i < r; i++) {
        rowStr += boxWidth;
        for (let k = 0; k < c; k++) {
            if (!isCustomizing) {
                document.getElementById("container").innerHTML += "<div id=" + i + "-" + k + " onclick=\"hideMoveableSpaces();\" ></div>";
            }
            else {
                document.getElementById("container").innerHTML += "<div id=" + i + "-" + k + " onclick=\"addSelectedPiece('" + i + "-" + k + "');\"></div>";
            }

        }
    }
    for (let o = 0; o < c; o++) {
        columnStr += boxWidth;
    }


    if (c % 2 != 0) {
        let bool = true;
        for (let x = 0; x < document.getElementById("container").getElementsByTagName("*").length; x++) {
            if (bool) {
                document.getElementById("container").getElementsByTagName("*")[x].classList.add("light-space")
                bool = false;
            }
            else {
                document.getElementById("container").getElementsByTagName("*")[x].classList.add("dark-space")
                bool = true;
            }
        }
    }
    else {
        let bool = true;
        for (let x = 0; x < document.getElementById("container").getElementsByTagName("*").length; x++) {
            if (bool) {
                document.getElementById("container").getElementsByTagName("*")[x].classList.add("light-space")
                bool = false;
            }
            else {
                document.getElementById("container").getElementsByTagName("*")[x].classList.add("dark-space")
                bool = true;
            }

            if ((x + 1) % numOfColumns == 0) {
                bool = !bool;
            }
        }
    }

    document.getElementById("container").style.gridTemplateRows = rowStr;
    document.getElementById("container").style.gridTemplateColumns = columnStr;
}

// adds pieces to the board
function addPiece(color, type, pos) {
    numOfEachPiece[color + "-" + type] += 1;
    let o = 0;
    let added = false;
    document.getElementById(pos).onclick = "";
    while (!added) {
        let id = color + "-" + type + "-" + o;
        if (defaltPieces.includes(type)) {
            if (type == "pawn") {
                if (!isCustomizing) {
                    if (document.getElementById(id) == null) {
                        document.getElementById(pos).innerHTML += "<img id=\"" + id + "\" src=\"images/" + color + "-" + type + ".png\" onclick='showMoveableSpaces(\"" + id + "\", \"true\")' class=\"piece\"  alt=\"" + color + " " + type + " piece" + "; times moved:0; enPassantable:F;\">";
                        added = true;
                    }
                }
                else {
                    if (document.getElementById(id) == null) {
                        document.getElementById(pos).innerHTML += "<img id=\"" + id + "\" src=\"images/" + color + "-" + type + ".png\" onclick=\"addSelectedPiece('" + pos + "');\" class=\"piece\"  alt=\"" + color + " " + type + " piece" + "; times moved:0; enPassantable:F;\">";
                        added = true;
                    }
                }
            }
            else {
                if (!isCustomizing) {
                    if (document.getElementById(id) == null) {
                        document.getElementById(pos).innerHTML += "<img id=\"" + id + "\" src=\"images/" + color + "-" + type + ".png\" onclick='showMoveableSpaces(\"" + id + "\", \"true\")' class=\"piece\"  alt=\"" + color + " " + type + " piece" + "; times moved:0;\">";
                        added = true;
                    }
                }
                else {
                    if (document.getElementById(id) == null) {
                        document.getElementById(pos).innerHTML += "<img id=\"" + id + "\" src=\"images/" + color + "-" + type + ".png\" onclick=\"addSelectedPiece('" + pos + "');\" class=\"piece\"  alt=\"" + color + " " + type + " piece" + "; times moved:0;\">";
                        added = true;
                    }
                }
            }
        }
        else {
            if (!isCustomizing) {
                if (document.getElementById(id) == null) {
                    document.getElementById(pos).innerHTML += "<img id=\"" + id + "\" src=\"images/" + color + "-custom.png\" onclick='showMoveableSpaces(\"" + id + "\", \"true\")' class=\"piece\"  alt=\"" + color + " " + type + " piece" + "; times moved:0;\">";
                    added = true;
                }
            }
            else {
                if (document.getElementById(id) == null) {
                    document.getElementById(pos).innerHTML += "<img id=\"" + id + "\" src=\"images/" + color + "-custom.png\" onclick=\"addSelectedPiece('" + pos + "');\" class=\"piece\"  alt=\"" + color + " " + type + " piece" + "; times moved:0;\">";
                    added = true;
                }
            }
        }
        o++;
    }
}

// re-adds the a piece to the board, used when starting a custom game
function reAddPieces() {

    let eachPiece = {};
    for (let key in numOfEachPiece) {
        eachPiece[key] = 0;
    }

    let newPieces = [];

    document.querySelectorAll(".piece").forEach(element => {
        let id = element.id;
        let pos = element.parentElement.id;
        let color = id.substring(0, id.indexOf("-"));
        let type = id.substring(id.indexOf("-") + 1, id.indexOf("-", id.indexOf("-") + 1));
        let newID = color + "-" + type + "-" + eachPiece[color + "-" + type];
        eachPiece[color + "-" + type]++;
        newPieces.push(pos + " " + newID);
        document.getElementById(pos).onclick = "";
        document.getElementById(id).parentElement.removeChild(element);
    });

    newPieces.forEach(element => {
        let pos = element.substring(0, element.indexOf(" "));
        let piece = element.substring(element.indexOf(" ") + 1);
        let color = piece.substring(0, piece.indexOf("-"));
        let type = piece.substring(piece.indexOf("-") + 1, piece.indexOf("-", piece.indexOf("-") + 1));

        if (defaltPieces.includes(type)) {
            if (type == "pawn") {
                document.getElementById(pos).innerHTML += "<img id=\"" + piece + "\" src=\"images/" + color + "-" + type + ".png\" onclick='showMoveableSpaces(\"" + piece + "\", \"true\")' class=\"piece\"  alt=\"" + color + " " + type + " piece" + "; times moved:0; enPassantable:F;\">";
            }
            else {
                document.getElementById(pos).innerHTML += "<img id=\"" + piece + "\" src=\"images/" + color + "-" + type + ".png\" onclick='showMoveableSpaces(\"" + piece + "\", \"true\")' class=\"piece\"  alt=\"" + color + " " + type + " piece" + "; times moved:0;\">";
            }
        }
        else {
            document.getElementById(pos).innerHTML += "<img id=\"" + piece + "\" src=\"images/" + color + "-custom.png\" onclick='showMoveableSpaces(\"" + piece + "\", \"true\")' class=\"piece\"  alt=\"" + color + " " + type + " piece" + "; times moved:0;\">";
        }
    });
}

// adds a full row of a certain piece, used when placing pawns in a classic game 
function addRowOf(rowIndex, color, typeofPiece) {
    for (let i = 0; i < numOfColumns; i++) {
        addPiece(color, typeofPiece, (rowIndex + "-" + i));
    }
}

// creates a normal chess game
function makeClassicGame() {
    gameOver = false;
    turnBaseOn = true;
    whiteTurn = true;
    numOfRows = 8;
    numOfColumns = 8;
    makeBoard();

    addPiece("black", "rook", "0-0");
    addPiece("black", "rook", "0-7");

    addPiece("black", "knight", "0-1");
    addPiece("black", "knight", "0-6");

    addPiece("black", "bishop", "0-2");
    addPiece("black", "bishop", "0-5");

    addPiece("black", "queen", "0-3");
    addPiece("black", "king", "0-4");

    addPiece("white", "rook", "7-0");
    addPiece("white", "rook", "7-7");

    addPiece("white", "knight", "7-1");
    addPiece("white", "knight", "7-6");

    addPiece("white", "bishop", "7-2");
    addPiece("white", "bishop", "7-5");

    addPiece("white", "queen", "7-3");
    addPiece("white", "king", "7-4");

    addRowOf(1, "black", "pawn");
    addRowOf((numOfRows - 2), "white", "pawn");

    checkDangerZones();
}

// ##################################################################################
// CUSTOMIZING
// ##################################################################################

// sets up the menu for selecting pieces for a custom game
function pieceSelectorSetup() {
    let selectorContainer = document.getElementById("piece-selector-container");
    selectorContainer.innerHTML += "<button id='start-game-button' onclick='startGame(); displayTurn();' >Start Game</button><button id='add-row-button' onclick='addRowToggle();'>Add Row of Selected Piece</button><button id='add-column-button' onclick='addColumnToggle();'>Add Column of Selected Piece</button><button id='remove-button' onclick='removeToggle();'>Remove</button>";
    selectorContainer.innerHTML += "<br><label for=\"code-input\">Piece Code <input id=\"code-input\" type=\"text\"></label><button id='add-custom-piece' onclick='decodeCustomPiece();'>Add Custom Piece</button>";

    let columnStr = "";
    let rowStr = " 70px 70px "
    for (let i = 0; i < 6; i++) {
        columnStr += " 70px ";
    }

    selectorContainer.innerHTML += "<div id=\"piece-selector-grid\" class='piece-selector-container'></div>";
    let container = document.getElementById("piece-selector-grid");

    container.style.gridTemplateRows = rowStr;
    container.style.gridTemplateColumns = columnStr;

    container.innerHTML += "<div id='white-king-selection'><img id='white-king' src='images/white-king.png' class='selector-piece' onclick='pieceSelected(\"white-king\")'></div>";
    container.innerHTML += "<div id='white-queen-selection'><img id='white-queen' src='images/white-queen.png' class='selector-piece' onclick='pieceSelected(\"white-queen\")'></div>";
    container.innerHTML += "<div id='white-knight-selection'><img id='white-knight' src='images/white-knight.png' class='selector-piece' onclick='pieceSelected(\"white-knight\")'></div>";
    container.innerHTML += "<div id='white-rook-selection'><img id='white-rook' src='images/white-rook.png' class='selector-piece' onclick='pieceSelected(\"white-rook\")'></div>";
    container.innerHTML += "<div img id='white-bishop-selection'><img id='white-bishop' src='images/white-bishop.png' class='selector-piece' onclick='pieceSelected(\"white-bishop\")'></div>";
    container.innerHTML += "<div id='white-pawn-selection'><img id='white-pawn' src='images/white-pawn.png' class='selector-piece' onclick='pieceSelected(\"white-pawn\")'></div>";

    container.innerHTML += "<div id='black-king-selection'><img id='black-king' src='images/black-king.png' class='selector-piece' onclick='pieceSelected(\"black-king\")'></div>";
    container.innerHTML += "<div id='black-queen-selection'><img id='black-queen' src='images/black-queen.png' class='selector-piece' onclick='pieceSelected(\"black-queen\")'></div>";
    container.innerHTML += "<div id='black-knight-selection'><img id='black-knight' src='images/black-knight.png' class='selector-piece' onclick='pieceSelected(\"black-knight\")'></div>";
    container.innerHTML += "<div id='black-rook-selection'><img id='black-rook' src='images/black-rook.png' class='selector-piece' onclick='pieceSelected(\"black-rook\")'></div>";
    container.innerHTML += "<div id='black-bishop-selection'><img id='black-bishop' src='images/black-bishop.png' class='selector-piece' onclick='pieceSelected(\"black-bishop\")'></div>";
    container.innerHTML += "<div id='black-pawn-selection'><img id='black-pawn' src='images/black-pawn.png' class='selector-piece' onclick='pieceSelected(\"black-pawn\")'></div>";
}

// toggles the selected piece
function pieceSelected(piece) {
    if (defaltPieces.includes(piece)) {
        if (selectedPiece == piece) {
            document.getElementById(piece + "-selection").innerHTML = (document.getElementById(piece + "-selection").innerHTML).substring(0, (document.getElementById(piece + "-selection").innerHTML).indexOf("<img src="));
            selectedPiece = "";
        }
        else {
            if (selectedPiece != "") {
                if (defaltPieces.includes(selectedPiece)) {
                    document.getElementById(selectedPiece + "-selection").lastChild.remove();
                }
                else {
                    document.getElementById(selectedPiece + "-selection").style.color = "black";
                }
            }
            selectedPiece = piece;
            document.getElementById(piece + "-selection").innerHTML += "<img src='images/selected-icon.png' class='selected-icon' onclick='pieceSelected(\"" + selectedPiece + "\")'>";
        }
    }
    else if (piece == selectedPiece) {
        document.getElementById(piece + "-selection").style.color = "black";
        selectedPiece = "";
    }
    else {
        if (defaltPieces.includes(selectedPiece)) {
            document.getElementById(selectedPiece + "-selection").lastChild.remove();
        }
        else if (selectedPiece != "") {
            document.getElementById(selectedPiece + "-selection").style.color = "black";
        }

        selectedPiece = piece;
        document.getElementById(piece + "-selection").style.color = "green";
    }
}

// toggles the ability to place a row of the selected piece
function addRowToggle() {
    if (settingRow) {
        settingRow = false;
        document.getElementById("add-row-button").style.color = "black";
    }
    else {
        settingRow = true;
        document.getElementById("add-row-button").style.color = "red";
        settingColumn = false;
        document.getElementById("add-column-button").style.color = "black";
        removing = false;
        document.getElementById("remove-button").style.color = "black";
        let ps = document.querySelectorAll("img.piece");
        for (let i = 0; i < ps.length; i++) {
            ps[i].onclick = function () { addSelectedPiece(ps[i].parentNode.id) }
        }
    }
}

// toggles the ability to place a column of the selected piece
function addColumnToggle() {
    if (settingColumn) {
        settingColumn = false;
        document.getElementById("add-column-button").style.color = "black";
    }
    else {
        settingColumn = true;
        document.getElementById("add-column-button").style.color = "red";
        settingRow = false;
        document.getElementById("add-row-button").style.color = "black";
        removing = false;
        document.getElementById("remove-button").style.color = "black";
        let ps = document.querySelectorAll("img.piece");
        for (let i = 0; i < ps.length; i++) {
            ps[i].onclick = function () { addSelectedPiece(ps[i].parentNode.id) }
        }
    }
}

// toggles the ability to remove pieces
function removeToggle() {
    if (removing) {
        removing = false;
        document.getElementById("remove-button").style.color = "black";
    }
    else {
        removing = true;
        document.getElementById("remove-button").style.color = "red";
        settingColumn = false;
        document.getElementById("add-column-button").style.color = "black";
        settingRow = false;
        document.getElementById("add-row-button").style.color = "black";

        let ps = document.querySelectorAll("img.piece");
        for (let i = 0; i < ps.length; i++) {
            ps[i].onclick = function () {
                let space = ps[i].parentNode;
                let pieceType = ps[i].id.substring(0, ps[i].id.indexOf("-", ps[i].id.indexOf('-') + 1));
                space.removeChild(ps[i]);
                numOfEachPiece[pieceType]--;
                space.onclick = function () {
                    addSelectedPiece(space.id)
                }
            }
        }
    }
}

// add the selected piece to a specified place
function addSelectedPiece(spacePos) {
    if (removing) {
        return;
    }

    if (selectedPiece == "") {
        return;
    }

    if (defaltPieces.includes(selectedPiece)) {
        let color = selectedPiece.substring(0, selectedPiece.indexOf("-"));
        let piece = selectedPiece.substring(selectedPiece.indexOf("-") + 1);
        let row = spacePos.substring(0, spacePos.indexOf("-"));
        let column = spacePos.substring(spacePos.indexOf("-") + 1);

        if (settingRow) {
            for (let i = 0; i < numOfColumns; i++) {
                try {
                    if (document.getElementById(row + "-" + i).firstChild.id.substring(0, document.getElementById(row + "-" + i).firstChild.id.indexOf("-", document.getElementById(row + "-" + i).firstChild.id.indexOf("-"))) != selectedPiece) {
                        numOfEachPiece[document.getElementById(row + "-" + i).firstChild.id.substring(0, document.getElementById(row + "-" + i).firstChild.id.indexOf("-", document.getElementById(row + "-" + i).firstChild.id.indexOf("-") + 1))]--;
                        document.getElementById(row + "-" + i).firstChild.remove();
                    }
                } catch (err) { }

                addPiece(color, piece, row + "-" + i);
            }
        }
        else if (settingColumn) {
            for (let i = 0; i < numOfRows; i++) {
                try {
                    if (document.getElementById(i + "-" + column).firstChild.id.substring(0, document.getElementById(i + "-" + column).firstChild.id.indexOf("-", document.getElementById(i + "-" + column).firstChild.id.indexOf("-"))) != selectedPiece) {
                        numOfEachPiece[document.getElementById(i + "-" + column).firstChild.id.substring(0, document.getElementById(i + "-" + column).firstChild.id.indexOf("-", document.getElementById(i + "-" + column).firstChild.id.indexOf("-") + 1))]--;
                        document.getElementById(i + "-" + column).firstChild.remove();
                    }
                } catch (err) { }

                addPiece(color, piece, i + "-" + column);
            }
        }
        else {
            try {
                if (document.getElementById(spacePos).firstChild.id.substring(0, document.getElementById(spacePos).firstChild.id.indexOf("-", document.getElementById(spacePos).firstChild.id.indexOf("-"))) != selectedPiece) {
                    numOfEachPiece[document.getElementById(spacePos).firstChild.id.substring(0, document.getElementById(spacePos).firstChild.id.indexOf("-", document.getElementById(spacePos).firstChild.id.indexOf("-") + 1))]--;
                    document.getElementById(spacePos).firstChild.remove();
                }
            } catch (err) { }

            addPiece(color, piece, spacePos);
        }
    }
    else {
        let customPiece = customPieces[selectedPiece];
        let color = (customPiece.color == "b") ? "black" : "white";
        let piece = customPiece.name;
        let row = spacePos.substring(0, spacePos.indexOf("-"));
        let column = spacePos.substring(spacePos.indexOf("-") + 1);

        if (settingRow) {
            for (let i = 0; i < numOfColumns; i++) {
                try {
                    if (document.getElementById(row + "-" + i).firstChild.id.substring(0, document.getElementById(row + "-" + i).firstChild.id.indexOf("-", document.getElementById(row + "-" + i).firstChild.id.indexOf("-"))) != selectedPiece) {
                        numOfEachPiece[document.getElementById(row + "-" + i).firstChild.id.substring(0, document.getElementById(row + "-" + i).firstChild.id.indexOf("-", document.getElementById(row + "-" + i).firstChild.id.indexOf("-") + 1))]--;
                        document.getElementById(row + "-" + i).firstChild.remove();
                    }
                } catch (err) { }

                addPiece(color, piece, row + "-" + i);
            }
        }
        else if (settingColumn) {
            for (let i = 0; i < numOfRows; i++) {
                try {
                    if (document.getElementById(i + "-" + column).firstChild.id.substring(0, document.getElementById(i + "-" + column).firstChild.id.indexOf("-", document.getElementById(i + "-" + column).firstChild.id.indexOf("-"))) != selectedPiece) {
                        numOfEachPiece[document.getElementById(i + "-" + column).firstChild.id.substring(0, document.getElementById(i + "-" + column).firstChild.id.indexOf("-", document.getElementById(i + "-" + column).firstChild.id.indexOf("-") + 1))]--;
                        document.getElementById(i + "-" + column).firstChild.remove();
                    }
                } catch (err) { }

                addPiece(color, piece, i + "-" + column);
            }
        }
        else {
            try {
                if (document.getElementById(spacePos).firstChild.id.substring(0, document.getElementById(spacePos).firstChild.id.indexOf("-", document.getElementById(spacePos).firstChild.id.indexOf("-"))) != selectedPiece) {
                    numOfEachPiece[document.getElementById(spacePos).firstChild.id.substring(0, document.getElementById(spacePos).firstChild.id.indexOf("-", document.getElementById(spacePos).firstChild.id.indexOf("-") + 1))]--;
                    document.getElementById(spacePos).firstChild.remove();
                }
            } catch (err) { }

            addPiece(color, piece, spacePos);
        }

    }
}

// ##################################################################################
// BUILD A PIECE
// ##################################################################################

// Class for all custom pieces, piece attributes can be accessed through here
class CustomPiece {
    constructor(name, color, points, movementType, movementRules) {
        this.name = name;
        this.color = color;
        this.points = points;
        this.movementType = movementType;
        this.movementRules = movementRules;
    }
}

// decodes the given code, creates an instance of a custom piece, and add a selection button
function decodeCustomPiece() {
    let code = document.getElementById("code-input").value;

    if (!verifyCode(code)) {
        return;
    }

    code = code.split("|");

    let n = code[0];
    let c = code[1];
    let p = parseInt(code[2]);
    let mt = code[3];
    let mr = [];
    for (let i = 4; i < code.length; i++) {
        mr.push(code[i]);
    }

    let piece = new CustomPiece(n, c, p, mt, mr);
    customPieces[n] = piece;
    c = (c == "b") ? "black" : "white";
    numOfEachPiece[c + "-" + n] = 0;

    document.getElementById("piece-selector-grid").innerHTML += "<button id='" + n + "-selection' onclick='pieceSelected(\"" + n + "\")'>" + n + "</button>"
}

// checks if the given code is valid
function verifyCode(code) {
    code = code.split("|");

    if (code.length < 4) {
        window.alert("Invalid piece code");
        return false;
    }

    let n = code[0];
    let c = code[1];
    let p = parseInt(code[2]);
    let mt = code[3];
    let mr = [];
    for (let i = 4; i < code.length; i++) {
        mr.push(code[i]);
    }

    if (n in numOfEachPiece) {
        window.alert("Piece's name is already being used");
        return false;
    }

    if (n in customPieces) {
        window.alert("Piece's name is already being used");
        return false;
    }

    if (c != "b" && c != "w") {
        window.alert("Invalid piece code");
        return false;
    }

    if (typeof p != "number" || isNaN(p)) {
        window.alert("Invalid piece code");
        return false;
    }

    if (mt != "s" && mt != "u") {
        window.alert("Invalid piece code");
        return false;
    }

    if (mt == "s" && mr.length != 8) {
        window.alert("Invalid piece code");
        return false;
    }

    if (mt == "u") {
        let newArr = []
        for (let i = 0; i < mr.length; i++) {
            if (!newArr.includes(mr[i])) {
                newArr.push(mr[i]);
            }
            else {
                window.alert("Invalid piece code");
                return false;
            }
        }
    }

    for (let i = 0; i < mr.length; i++) {
        if (mt == "s") {
            if (mr[i].length != 3) {
                window.alert("Invalid piece code");
                return false;
            }
            let num = parseInt(mr[i].substring(0, 2));
            let j = mr[i].substring(2);
            if (typeof num != "number" || isNaN(num)) {
                if (mr[i].substring(0, 2) != "@@") {
                    window.alert("Invalid piece code");
                    return false;
                }
            }
            if (j != "?" && j != "#") {
                window.alert("Invalid piece code");
                return false;
            }
        }
        else {
            let r = mr[i].split("_");
            if (r.length != 2) {
                window.alert("Invalid piece code");
                return false;
            }
            let y = parseInt(r[0]);
            let x = parseInt(r[1]);
            if (typeof y != "number" || isNaN(y)) {
                window.alert("Invalid piece code");
                return false;
            }
            if (typeof x != "number" || isNaN(x)) {
                window.alert("Invalid piece code");
                return false;
            }
        }
    }
    return true;
}

// ##################################################################################
// GAME SETUP / GAME INFO
// ##################################################################################

// sets up the game scoreboard
function setupGameScoreboard() {
    let container = document.getElementById("game-scoreboard-container");
    container.innerHTML = "<p>";
    container.innerHTML += "<span id=\"white-score\">White: 0</span>";
    container.innerHTML += "<br>"
    container.innerHTML += "<span id=\"black-score\">Black: 0</span>";
    container.innerHTML += "</p>";
    container.innerHTML += "<button onclick='resign();'>Resign</button>";
    container.innerHTML += "<p id=\"display-turn\"></p>";
}

// updates the game scoreboard
function updateGameScoreboard(color, points) {
    if (color == "white") {
        let currentPoints = parseInt(document.getElementById("white-score").innerHTML.substring(document.getElementById("white-score").innerHTML.indexOf(":") + 1));
        document.getElementById("white-score").innerHTML = "White: " + (currentPoints + points);
    }
    else {
        let currentPoints = parseInt(document.getElementById("black-score").innerHTML.substring(document.getElementById("black-score").innerHTML.indexOf(":") + 1));
        document.getElementById("black-score").innerHTML = "Black: " + (currentPoints + points);
    }
}

// clears the game scoreboard
function clearGameScoreboard() {
    document.getElementById("game-scoreboard-container").innerHTML = "";
}

// displays who's turn it is
function displayTurn() {
    if (gameOver) {
        return;
    }
    if (turnBaseOn) {
        if (turnBaseOn && whiteTurn) {
            document.getElementById("display-turn").innerHTML = "<strong>WHITE TURN</strong>"
        }
        else if (turnBaseOn && !whiteTurn) {
            document.getElementById("display-turn").innerHTML = "<strong>BLACK TURN</strong>"
        }
    }
}

// starts the custom game
function startGame() {
    setupGameScoreboard();
    if (!((numOfEachPiece["white-king"] >= 1) && (numOfEachPiece["black-king"] >= 1))) {
        window.alert("Both teams need at least 1 king!");
        return;
    }

    document.getElementById("piece-selector-container").innerHTML = "";
    document.getElementById("piece-selector-container").gridTemplateColumns = "";
    document.getElementById("piece-selector-container").gridTemplateRows = "";

    for (let y = 0; y < numOfRows; y++) {
        for (let x = 0; x < numOfColumns; x++) {
            document.getElementById(y + "-" + x).onclick = function () { hideMoveableSpaces(); }
        }
    }

    isCustomizing = false;
    reAddPieces();
    turnBaseOn = true;
    whiteTurn = true;
    selectedPiece = "";
    settingRow = false;
    settingColumn = false;
    removing = false;
    gameOver = false;

    hideMoveableSpaces();
    checkDangerZones();
    toggleRowsColumnsSection();
}

// ends the game and displays the winner
function endGame(winner, reset) {
    try {
        document.getElementById("display-turn").innerHTML = "";
    }
    catch (err) { }

    let allPieces = document.getElementById("chess-board").getElementsByTagName("img");

    for (let i = 0; i < allPieces.length; i++) {
        try {
            document.getElementById(allPieces[i].id).onclick = "";
        }
        catch (err) { }
    }

    if (winner == "tie") {
        document.getElementById("game-scoreboard-container").innerHTML = "<p id=\"display-winner\"><strong>" + winner.toUpperCase() + "!" + "</strong></p>";
    }
    else if (winner == "stalemate") {
        document.getElementById("game-scoreboard-container").innerHTML = "<p id=\"display-winner\"><strong>" + winner.toUpperCase() + "!" + "</strong></p>";
    }
    else {
        document.getElementById("game-scoreboard-container").innerHTML += "<p id=\"display-winner\"><strong>" + winner.toUpperCase() + " WINS!" + "</strong></p>";
    }

    if (reset) {
        resetVariables();
    }
}

// the team who's turn it is forfeits the game 
function resign() {
    if (gameOver) { return; }
    if (whiteTurn) {
        endGame("black", true);
    }
    else {
        endGame("white", true);
    }
}

// ##################################################################################
// GAMEPLAY
// ##################################################################################

// makes the gray dots where pieces can move or just collects info
function showMoveableSpaces(pieceId, showDots) {
    if (isCustomizing) { return; }
    if (transforming) { return; }
    if ((!isMoveableShowing) || (selectedId != pieceId)) {
        if ((selectedId != pieceId)) {
            hideMoveableSpaces();
        }
        if (document.getElementById(pieceId) == null) {
            return;
        }

        selectedId = pieceId;
        let color = pieceId.substring(0, pieceId.indexOf("-"));
        let typeofPiece = pieceId.substring(pieceId.indexOf("-") + 1, pieceId.indexOf("-", pieceId.indexOf("-") + 1));
        let pos = document.getElementById(pieceId).parentElement.id;

        if (showDots) {
            if (color == "black" && turnBaseOn && whiteTurn) {
                return;
            }
            else if (color == "white" && turnBaseOn && !whiteTurn) {
                return;
            }
        }

        if (defaltPieces.includes(color + "-" + typeofPiece)) {
            if (typeofPiece == "king") {
                for (let i = 0; i < numOfEachPiece[color + "-rook"]; i++) {
                    try {
                        if ((parseInt(document.getElementById(pieceId).getAttribute("alt").substring(document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1)) <= 0) && (parseInt(document.getElementById(color + "-" + "rook" + "-" + i).getAttribute("alt").substring(document.getElementById(color + "-" + "rook" + "-" + i).getAttribute("alt").indexOf(":") + 1)) <= 0) && ((document.getElementById(color + "-" + "rook" + "-" + i).parentElement.id.substring(0, document.getElementById(color + "-" + "rook" + "-" + i).parentElement.id.indexOf("-")) == document.getElementById(pieceId).parentElement.id.substring(0, document.getElementById(pieceId).parentElement.id.indexOf("-"))) || (document.getElementById(color + "-" + "rook" + "-" + i).parentElement.id.substring(document.getElementById(color + "-" + "rook" + "-" + i).parentElement.id.indexOf("-") + 1) == document.getElementById(pieceId).parentElement.id.substring(document.getElementById(pieceId).parentElement.id.indexOf("-") + 1)))) {
                            if ((document.getElementById(color + "-" + "rook" + "-" + i).parentElement.id.substring(0, document.getElementById(color + "-" + "rook" + "-" + i).parentElement.id.indexOf("-")) == document.getElementById(pieceId).parentElement.id.substring(0, document.getElementById(pieceId).parentElement.id.indexOf("-")))) {
                                if (checkInBetween(document.getElementById(pieceId).parentElement.id, document.getElementById(color + "-" + "rook" + "-" + i).parentElement.id)) {
                                    if (showDots) {
                                        if (color == "white" && !whiteDangerZones.includes(simCastle(pieceId, (color + "-" + "rook" + "-" + i)))) {
                                            document.getElementById(document.getElementById(color + "-" + "rook" + "-" + i).parentElement.id).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='castle(\"" + pieceId + "\",\"" + (color + "-" + "rook" + "-" + i) + "\")' >";
                                        }
                                        else if (color == "black" && !blackDangerZones.includes(simCastle(pieceId, (color + "-" + "rook" + "-" + i)))) {
                                            document.getElementById(document.getElementById(color + "-" + "rook" + "-" + i).parentElement.id).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='castle(\"" + pieceId + "\",\"" + (color + "-" + "rook" + "-" + i) + "\")' >";
                                        }
                                    }
                                    if (color == "black") { blackMoveableSpaces.push(simCastle(pieceId, (color + "-" + "rook" + "-" + i))); } else if (color == "white") { whiteMoveableSpaces.push(simCastle(pieceId, (color + "-" + "rook" + "-" + i))); }
                                }
                            }
                            else if ((document.getElementById(color + "-" + "rook" + "-" + i).parentElement.id.substring(document.getElementById(color + "-" + "rook" + "-" + i).parentElement.id.indexOf("-") + 1) == document.getElementById(pieceId).parentElement.id.substring(document.getElementById(pieceId).parentElement.id.indexOf("-") + 1))) {
                                if (checkInBetween(document.getElementById(pieceId).parentElement.id, document.getElementById(color + "-" + "rook" + "-" + i).parentElement.id)) {
                                    if (showDots) {
                                        if (color == "white" && !whiteDangerZones.includes(simCastle(pieceId, (color + "-" + "rook" + "-" + i)))) {
                                            document.getElementById(document.getElementById(color + "-" + "rook" + "-" + i).parentElement.id).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='castle(\"" + pieceId + "\",\"" + (color + "-" + "rook" + "-" + i) + "\")' >";
                                        }
                                        else if (color == "black" && !blackDangerZones.includes(simCastle(pieceId, (color + "-" + "rook" + "-" + i)))) {
                                            document.getElementById(document.getElementById(color + "-" + "rook" + "-" + i).parentElement.id).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='castle(\"" + pieceId + "\",\"" + (color + "-" + "rook" + "-" + i) + "\")' >";
                                        }
                                    }
                                    if (color == "black") { blackMoveableSpaces.push(simCastle(pieceId, (color + "-" + "rook" + "-" + i))); } else if (color == "white") { whiteMoveableSpaces.push(simCastle(pieceId, (color + "-" + "rook" + "-" + i))); }
                                }
                            }
                        }
                    }
                    catch (err) {/* try and catch to prevent TypeError in case of rooks being dead */ }
                }

                try {
                    // 1 right
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-")))) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 1);

                    if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            if (color == "white" && !whiteDangerZones.includes(dotPos)) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            else if (color == "black" && !blackDangerZones.includes(dotPos)) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                        }
                        if (color == "black") {
                            whiteDangerZones.push(dotPos);
                            blackMoveableSpaces.push(dotPos);
                        }
                        else if (color == "white") {
                            blackDangerZones.push(dotPos);
                            whiteMoveableSpaces.push(dotPos);
                        }
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // 1 down, 1 right
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 1);

                    if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            if (color == "white" && !whiteDangerZones.includes(dotPos)) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            else if (color == "black" && !blackDangerZones.includes(dotPos)) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                        }
                        if (color == "black") {
                            whiteDangerZones.push(dotPos);
                            blackMoveableSpaces.push(dotPos);
                        }
                        else if (color == "white") {
                            blackDangerZones.push(dotPos);
                            whiteMoveableSpaces.push(dotPos);
                        }
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // 1 down
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)));

                    if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            if (color == "white" && !whiteDangerZones.includes(dotPos)) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            else if (color == "black" && !blackDangerZones.includes(dotPos)) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                        }
                        if (color == "black") {
                            whiteDangerZones.push(dotPos);
                            blackMoveableSpaces.push(dotPos);
                        }
                        else if (color == "white") {
                            blackDangerZones.push(dotPos);
                            whiteMoveableSpaces.push(dotPos);
                        }
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // 1 down, 1 left
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 1);

                    if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            if (color == "white" && !whiteDangerZones.includes(dotPos)) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            else if (color == "black" && !blackDangerZones.includes(dotPos)) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                        }
                        if (color == "black") {
                            whiteDangerZones.push(dotPos);
                            blackMoveableSpaces.push(dotPos);
                        }
                        else if (color == "white") {
                            blackDangerZones.push(dotPos);
                            whiteMoveableSpaces.push(dotPos);
                        }
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // 1 left
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-")))) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 1);

                    if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            if (color == "white" && !whiteDangerZones.includes(dotPos)) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            else if (color == "black" && !blackDangerZones.includes(dotPos)) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                        }
                        if (color == "black") {
                            whiteDangerZones.push(dotPos);
                            blackMoveableSpaces.push(dotPos);
                        }
                        else if (color == "white") {
                            blackDangerZones.push(dotPos);
                            whiteMoveableSpaces.push(dotPos);
                        }
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // 1 up, 1 left
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 1);

                    if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            if (color == "white" && !whiteDangerZones.includes(dotPos)) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            else if (color == "black" && !blackDangerZones.includes(dotPos)) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                        }
                        if (color == "black") {
                            whiteDangerZones.push(dotPos);
                            blackMoveableSpaces.push(dotPos);
                        }
                        else if (color == "white") {
                            blackDangerZones.push(dotPos);
                            whiteMoveableSpaces.push(dotPos);
                        }
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // 1 up
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)));

                    if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            if (color == "white" && !whiteDangerZones.includes(dotPos)) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            else if (color == "black" && !blackDangerZones.includes(dotPos)) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                        }
                        if (color == "black") {
                            whiteDangerZones.push(dotPos);
                            blackMoveableSpaces.push(dotPos);
                        }
                        else if (color == "white") {
                            blackDangerZones.push(dotPos);
                            whiteMoveableSpaces.push(dotPos);
                        }
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // 1 up, 1 right
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 1);

                    if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            if (color == "white" && !whiteDangerZones.includes(dotPos)) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            else if (color == "black" && !blackDangerZones.includes(dotPos)) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                        }
                        if (color == "black") {
                            whiteDangerZones.push(dotPos);
                            blackMoveableSpaces.push(dotPos);
                        }
                        else if (color == "white") {
                            blackDangerZones.push(dotPos);
                            whiteMoveableSpaces.push(dotPos);
                        }
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }
            }
            else if ((typeofPiece == "pawn") && (color == "black")) {
                try {
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)));
                    let dubDotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 2) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)));

                    try {
                        // 2 down
                        if (((parseInt(document.getElementById(pieceId).getAttribute("alt").substring(document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1)) <= 0) && (document.getElementById(dubDotPos).firstChild == null) && (document.getElementById(dotPos).firstChild == null))) {
                            if (showDots) {
                                document.getElementById(dubDotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='enPassantReset(); movePiece(\"" + (dubDotPos) + "\", \"" + pieceId + "\", true);' >";
                            }
                            blackMoveableSpaces.push(dubDotPos);
                        }
                    } catch (err) { }

                    // 1 down
                    if (((document.getElementById(dotPos).firstChild == null))) {
                        if (showDots) {
                            document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                        }
                        blackMoveableSpaces.push(dotPos);
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // 1 down, 1 left when an enemy is present or even En Passant
                    let leftAttPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 1);
                    let leftPos = (parseInt(pos.substring(0, pos.indexOf("-")))) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 1);
                    whiteDangerZones.push(leftAttPos);

                    if (((document.getElementById(leftAttPos).firstChild != null) && (document.getElementById(leftAttPos).firstChild.id.substring(0, document.getElementById(leftAttPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            document.getElementById(leftAttPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (leftAttPos) + "\", \"" + pieceId + "\", false)' >";
                        }
                        blackMoveableSpaces.push(leftAttPos);
                    }
                    else if ((document.getElementById(leftPos).firstChild.alt.substring(document.getElementById(leftPos).firstChild.alt.indexOf(":", document.getElementById(leftPos).firstChild.alt.indexOf(":") + 1) + 1, document.getElementById(leftPos).firstChild.alt.indexOf(":", document.getElementById(leftPos).firstChild.alt.indexOf(":") + 1) + 2)) == "T") {
                        if (showDots) {
                            document.getElementById(leftAttPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='enPassant(\"" + (leftAttPos) + "\", \"" + pieceId + "\", \"" + leftPos + "\")' >";
                        }
                        blackMoveableSpaces.push(leftAttPos);
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // 1 down, 1 right when an enemy is present or even En Passant
                    let rightAttPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 1);
                    let rightPos = (parseInt(pos.substring(0, pos.indexOf("-")))) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 1);
                    whiteDangerZones.push(rightAttPos);

                    if (((document.getElementById(rightAttPos).firstChild != null) && (document.getElementById(rightAttPos).firstChild.id.substring(0, document.getElementById(rightAttPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            document.getElementById(rightAttPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (rightAttPos) + "\", \"" + pieceId + "\", false)' >";
                        }
                        blackMoveableSpaces.push(rightAttPos);
                    }
                    else if ((document.getElementById(rightPos).firstChild.alt.substring(document.getElementById(rightPos).firstChild.alt.indexOf(":", document.getElementById(rightPos).firstChild.alt.indexOf(":") + 1) + 1, document.getElementById(rightPos).firstChild.alt.indexOf(":", document.getElementById(rightPos).firstChild.alt.indexOf(":") + 1) + 2)) == "T") {
                        if (showDots) {
                            document.getElementById(rightAttPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='enPassant(\"" + (rightAttPos) + "\", \"" + pieceId + "\", \"" + rightPos + "\")' >";
                        }
                        blackMoveableSpaces.push(rightAttPos);
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }
            }
            else if ((typeofPiece == "pawn") && (color == "white")) {
                try {
                    let dubDotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 2) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)));
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)));

                    try {
                        // 2 up
                        if (((parseInt(document.getElementById(pieceId).getAttribute("alt").substring(document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1)) <= 0) && (document.getElementById(dubDotPos).firstChild == null) && (document.getElementById(dotPos).firstChild == null))) {
                            if (showDots) {
                                document.getElementById(dubDotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='enPassantReset(); movePiece(\"" + (dubDotPos) + "\", \"" + pieceId + "\", true);' >";
                            }
                            whiteMoveableSpaces.push(dubDotPos);
                        }

                    } catch (err) { }

                    // 1 up
                    if (((document.getElementById(dotPos).firstChild == null))) {
                        if (showDots) {
                            document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                        }
                        whiteMoveableSpaces.push(dotPos);
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // 1 up, 1 left when an enemy is present or even En Passant
                    let leftAttPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 1);
                    let leftPos = (parseInt(pos.substring(0, pos.indexOf("-")))) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 1);
                    blackDangerZones.push(leftAttPos);

                    if (((document.getElementById(leftAttPos).firstChild != null) && (document.getElementById(leftAttPos).firstChild.id.substring(0, document.getElementById(leftAttPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            document.getElementById(leftAttPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (leftAttPos) + "\", \"" + pieceId + "\", false)' >";
                        }
                        whiteMoveableSpaces.push(leftAttPos);
                    }
                    else if ((document.getElementById(leftPos).firstChild.alt.substring(document.getElementById(leftPos).firstChild.alt.indexOf(":", document.getElementById(leftPos).firstChild.alt.indexOf(":") + 1) + 1, document.getElementById(leftPos).firstChild.alt.indexOf(":", document.getElementById(leftPos).firstChild.alt.indexOf(":") + 1) + 2)) == "T") {
                        if (showDots) {
                            document.getElementById(leftAttPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='enPassant(\"" + (leftAttPos) + "\", \"" + pieceId + "\", \"" + leftPos + "\")' >";
                        }
                        whiteMoveableSpaces.push(leftAttPos);
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // 1 up, 1 right when an enemy is present or even En Passant
                    let rightAttPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 1);
                    let rightPos = (parseInt(pos.substring(0, pos.indexOf("-")))) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 1);
                    blackDangerZones.push(rightAttPos);

                    if (((document.getElementById(rightAttPos).firstChild != null) && (document.getElementById(rightAttPos).firstChild.id.substring(0, document.getElementById(rightAttPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            document.getElementById(rightAttPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (rightAttPos) + "\", \"" + pieceId + "\", false)' >";
                        }
                        whiteMoveableSpaces.push(rightAttPos);
                    }
                    else if ((document.getElementById(rightPos).firstChild.alt.substring(document.getElementById(rightPos).firstChild.alt.indexOf(":", document.getElementById(rightPos).firstChild.alt.indexOf(":") + 1) + 1, document.getElementById(rightPos).firstChild.alt.indexOf(":", document.getElementById(rightPos).firstChild.alt.indexOf(":") + 1) + 2)) == "T") {
                        if (showDots) {
                            document.getElementById(rightAttPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='enPassant(\"" + (rightAttPos) + "\", \"" + pieceId + "\", \"" + rightPos + "\")' >";
                        }
                        whiteMoveableSpaces.push(rightAttPos);
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }
            }
            else if (typeofPiece == "knight") {
                try {
                    // up 2, left 1 
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 2) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 1);

                    if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                        }
                        if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // up 2, right 1 
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 2) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 1);

                    if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                        }
                        if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // down 2, left 1 
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 2) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 1);

                    if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                        }
                        if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // down 2, right 1 
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 2) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 1);

                    if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                        }
                        if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // left 2, up 1 
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 2);

                    if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                        }
                        if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // left 2, down 1 
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 2);

                    if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                        }
                        if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // right 2, up 1 
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 2);

                    if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                        }
                        if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

                try {
                    // right 2, down 1 
                    let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 2);

                    if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                        if (showDots) {
                            document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                        }
                        if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                    }
                }
                catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }
            }
            if (typeofPiece == "rook" || typeofPiece == "queen") {
                let currentPos = document.getElementById(pieceId).parentElement.id;

                // up until it runs into something
                let dirPos = parseInt((currentPos.substring(0, currentPos.indexOf("-"))));
                let showSideMoves = false;
                while (!showSideMoves) {
                    dirPos--;
                    try {
                        let dotPos = dirPos + currentPos.substring(currentPos.indexOf("-"));
                        if ((document.getElementById(dotPos).firstChild == null)) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                        }
                        else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            showSideMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                        }
                        else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            showSideMoves = true;
                        }
                        else {
                            showSideMoves = true;
                        }
                    }
                    catch (err) { showSideMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                }

                // down until it runs into something
                dirPos = parseInt((currentPos.substring(0, currentPos.indexOf("-"))));
                showSideMoves = false;
                while (!showSideMoves) {
                    dirPos++;
                    try {
                        let dotPos = dirPos + currentPos.substring(currentPos.indexOf("-"));
                        if ((document.getElementById(dotPos).firstChild == null)) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                        }
                        else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            showSideMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                        }
                        else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            showSideMoves = true;
                        }
                        else {
                            showSideMoves = true;
                        }
                    }
                    catch (err) { showSideMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                }

                // right until it runs into something
                dirPos = parseInt(currentPos.substring(currentPos.indexOf("-") + 1));
                showSideMoves = false;
                while (!showSideMoves) {
                    dirPos++;
                    try {
                        let dotPos = currentPos.substring(0, currentPos.indexOf("-") + 1) + dirPos;
                        if ((document.getElementById(dotPos).firstChild == null)) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                        }
                        else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            showSideMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                        }
                        else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            showSideMoves = true;
                        }
                        else {
                            showSideMoves = true;
                        }
                    }
                    catch (err) { showSideMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                }

                // left until it runs into something
                dirPos = parseInt(currentPos.substring(currentPos.indexOf("-") + 1));
                showSideMoves = false;
                while (!showSideMoves) {
                    dirPos--;
                    try {
                        let dotPos = currentPos.substring(0, currentPos.indexOf("-") + 1) + dirPos;
                        if ((document.getElementById(dotPos).firstChild == null)) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                        }
                        else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            showSideMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                        }
                        else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            showSideMoves = true;
                        }
                        else {
                            showSideMoves = true;
                        }
                    }
                    catch (err) { showSideMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                }
            }
            if (typeofPiece == "bishop" || typeofPiece == "queen") {
                let currentPos = document.getElementById(pieceId).parentElement.id;

                // up and right until it runs into something
                let dirPosY = parseInt((currentPos.substring(0, currentPos.indexOf("-"))));
                let dirPosX = parseInt(currentPos.substring(currentPos.indexOf("-") + 1));
                let showDiagMoves = false;
                while (!showDiagMoves) {
                    dirPosY--;
                    dirPosX++;
                    try {
                        let dotPos = dirPosY + "-" + dirPosX;
                        if (document.getElementById(dotPos).firstChild == null) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                        }
                        else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            showDiagMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                        }
                        else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            showDiagMoves = true;
                        }
                        else {
                            showDiagMoves = true;
                        }
                    }
                    catch (err) { showDiagMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                }

                // up and left until it runs into something
                dirPosY = parseInt((currentPos.substring(0, currentPos.indexOf("-"))));
                dirPosX = parseInt(currentPos.substring(currentPos.indexOf("-") + 1));
                showDiagMoves = false;
                while (!showDiagMoves) {
                    dirPosY--;
                    dirPosX--;
                    try {
                        let dotPos = dirPosY + "-" + dirPosX;
                        if (document.getElementById(dotPos).firstChild == null) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                        }
                        else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            showDiagMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                        }
                        else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            showDiagMoves = true;
                        }
                        else {
                            showDiagMoves = true;
                        }
                    }
                    catch (err) { showDiagMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                }

                // down and right until it runs into something
                dirPosY = parseInt((currentPos.substring(0, currentPos.indexOf("-"))));
                dirPosX = parseInt(currentPos.substring(currentPos.indexOf("-") + 1));
                showDiagMoves = false;
                while (!showDiagMoves) {
                    dirPosY++;
                    dirPosX++;
                    try {
                        let dotPos = dirPosY + "-" + dirPosX;
                        if (document.getElementById(dotPos).firstChild == null) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                        }
                        else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            showDiagMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                        }
                        else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            showDiagMoves = true;
                        }
                        else {
                            showDiagMoves = true;
                        }
                    }
                    catch (err) { showDiagMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                }

                // down and left until it runs into something
                dirPosY = parseInt((currentPos.substring(0, currentPos.indexOf("-"))));
                dirPosX = parseInt(currentPos.substring(currentPos.indexOf("-") + 1));
                showDiagMoves = false;
                while (!showDiagMoves) {
                    dirPosY++;
                    dirPosX--;
                    try {
                        let dotPos = dirPosY + "-" + dirPosX;
                        if (document.getElementById(dotPos).firstChild == null) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                        }
                        else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            showDiagMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                        }
                        else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            showDiagMoves = true;
                        }
                        else {
                            showDiagMoves = true;
                        }
                    }
                    catch (err) { showDiagMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                }
            }
        }
        else {
            let customPiece = customPieces[typeofPiece];

            if (customPiece.movementType == "s") {
                let mr = customPiece.movementRules;
                // up
                if (mr[0].substring(0, 2) == "@@") {
                    let jumping = (mr[0].substring(2, 3) == "#") ? true : false;
                    let dirPos = parseInt((pos.substring(0, pos.indexOf("-"))));
                    let showSideMoves = false;
                    while (!showSideMoves) {
                        dirPos--;
                        try {
                            let dotPos = dirPos + pos.substring(pos.indexOf("-"));
                            if ((document.getElementById(dotPos).firstChild == null)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showSideMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                                }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showSideMoves = true;
                                }
                            }
                            else {
                                showSideMoves = true;
                            }
                        }
                        catch (err) { showSideMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                    }
                }
                else {
                    let jumping = (mr[0].substring(2, 3) == "#") ? true : false;
                    let dirPos = parseInt((pos.substring(0, pos.indexOf("-"))));
                    let showSideMoves = false;
                    for (let i = 0; i < parseInt(mr[0].substring(0, 2)); i++) {
                        dirPos--;
                        try {
                            let dotPos = dirPos + pos.substring(pos.indexOf("-"));
                            if ((document.getElementById(dotPos).firstChild == null)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showSideMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                                }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showSideMoves = true;
                                }
                            }
                            else {
                                showSideMoves = true;
                            }
                        }
                        catch (err) { showSideMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                        if (showSideMoves) { break; }
                    }
                }
                // up and right
                if (mr[1].substring(0, 2) == "@@") {
                    let jumping = (mr[1].substring(2, 3) == "#") ? true : false;
                    let dirPosY = parseInt((pos.substring(0, pos.indexOf("-"))));
                    let dirPosX = parseInt(pos.substring(pos.indexOf("-") + 1));
                    let showDiagMoves = false;
                    while (!showDiagMoves) {
                        dirPosY--;
                        dirPosX++;
                        try {
                            let dotPos = dirPosY + "-" + dirPosX;
                            if (document.getElementById(dotPos).firstChild == null) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showDiagMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                                }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showDiagMoves = true;
                                }
                            }
                            else {
                                showDiagMoves = true;
                            }
                        }
                        catch (err) { showDiagMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                    }
                }
                else {
                    let jumping = (mr[1].substring(2, 3) == "#") ? true : false;
                    let dirPosY = parseInt((pos.substring(0, pos.indexOf("-"))));
                    let dirPosX = parseInt(pos.substring(pos.indexOf("-") + 1));
                    let showDiagMoves = false;
                    for (let i = 0; i < parseInt(mr[1].substring(0, 2)); i++) {
                        dirPosY--;
                        dirPosX++;
                        try {
                            let dotPos = dirPosY + "-" + dirPosX;
                            if ((document.getElementById(dotPos).firstChild == null)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showDiagMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                                }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showDiagMoves = true;
                                }
                            }
                            else {
                                showDiagMoves = true;
                            }
                        }
                        catch (err) { showDiagMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                        if (showDiagMoves) { break; }
                    }
                }
                // right
                if (mr[2].substring(0, 2) == "@@") {
                    let jumping = (mr[2].substring(2, 3) == "#") ? true : false;
                    let dirPos = parseInt((pos.substring(pos.indexOf("-") + 1)));
                    let showSideMoves = false;
                    while (!showSideMoves) {
                        dirPos++;
                        try {
                            let dotPos = pos.substring(0, pos.indexOf("-") + 1) + dirPos;
                            if ((document.getElementById(dotPos).firstChild == null)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showSideMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                                }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showSideMoves = true;
                                }
                            }
                            else {
                                showSideMoves = true;
                            }
                        }
                        catch (err) { showSideMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                    }
                }
                else {
                    let jumping = (mr[2].substring(2, 3) == "#") ? true : false;
                    let dirPos = parseInt((pos.substring(pos.indexOf("-") + 1)));
                    let showSideMoves = false;
                    for (let i = 0; i < parseInt(mr[2].substring(0, 2)); i++) {
                        dirPos++;
                        try {
                            let dotPos = pos.substring(0, pos.indexOf("-") + 1) + dirPos;
                            if ((document.getElementById(dotPos).firstChild == null)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showSideMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                                }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showSideMoves = true;
                                }
                            }
                            else {
                                showSideMoves = true;
                            }
                        }
                        catch (err) { showSideMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                        if (showSideMoves) { break; }
                    }
                }
                // down and right
                if (mr[3].substring(0, 2) == "@@") {
                    let jumping = (mr[3].substring(2, 3) == "#") ? true : false;
                    let dirPosY = parseInt((pos.substring(0, pos.indexOf("-"))));
                    let dirPosX = parseInt(pos.substring(pos.indexOf("-") + 1));
                    let showDiagMoves = false;
                    while (!showDiagMoves) {
                        dirPosY++;
                        dirPosX++;
                        try {
                            let dotPos = dirPosY + "-" + dirPosX;
                            if (document.getElementById(dotPos).firstChild == null) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showDiagMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                                }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showDiagMoves = true;
                                }
                            }
                            else {
                                showDiagMoves = true;
                            }
                        }
                        catch (err) { showDiagMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                    }
                }
                else {
                    let jumping = (mr[3].substring(2, 3) == "#") ? true : false;
                    let dirPosY = parseInt((pos.substring(0, pos.indexOf("-"))));
                    let dirPosX = parseInt(pos.substring(pos.indexOf("-") + 1));
                    let showDiagMoves = false;
                    for (let i = 0; i < parseInt(mr[3].substring(0, 2)); i++) {
                        dirPosY++;
                        dirPosX++;
                        try {
                            let dotPos = dirPosY + "-" + dirPosX;
                            if ((document.getElementById(dotPos).firstChild == null)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showDiagMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                                }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showDiagMoves = true;
                                }
                            }
                            else {
                                showDiagMoves = true;
                            }
                        }
                        catch (err) { showDiagMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                        if (showDiagMoves) { break; }
                    }
                }
                // down
                if (mr[4].substring(0, 2) == "@@") {
                    let jumping = (mr[4].substring(2, 3) == "#") ? true : false;
                    let dirPos = parseInt((pos.substring(0, pos.indexOf("-"))));
                    let showSideMoves = false;
                    while (!showSideMoves) {
                        dirPos++;
                        try {
                            let dotPos = dirPos + pos.substring(pos.indexOf("-"));
                            if ((document.getElementById(dotPos).firstChild == null)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showSideMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                                }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showSideMoves = true;
                                }
                            }
                            else {
                                showSideMoves = true;
                            }
                        }
                        catch (err) { showSideMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                    }
                }
                else {
                    let jumping = (mr[4].substring(2, 3) == "#") ? true : false;
                    let dirPos = parseInt((pos.substring(0, pos.indexOf("-"))));
                    let showSideMoves = false;
                    for (let i = 0; i < parseInt(mr[4].substring(0, 2)); i++) {
                        dirPos++;
                        try {
                            let dotPos = dirPos + pos.substring(pos.indexOf("-"));
                            if ((document.getElementById(dotPos).firstChild == null)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showSideMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                                }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showSideMoves = true;
                                }
                            }
                            else {
                                showSideMoves = true;
                            }
                        }
                        catch (err) { showSideMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                        if (showSideMoves) { break; }
                    }


                }
                // down and left
                if (mr[5].substring(0, 2) == "@@") {
                    let jumping = (mr[5].substring(2, 3) == "#") ? true : false;
                    let dirPosY = parseInt((pos.substring(0, pos.indexOf("-"))));
                    let dirPosX = parseInt(pos.substring(pos.indexOf("-") + 1));
                    let showDiagMoves = false;
                    while (!showDiagMoves) {
                        dirPosY++;
                        dirPosX--;
                        try {
                            let dotPos = dirPosY + "-" + dirPosX;
                            if (document.getElementById(dotPos).firstChild == null) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showDiagMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                                }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showDiagMoves = true;
                                }
                            }
                            else {
                                showDiagMoves = true;
                            }
                        }
                        catch (err) { showDiagMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                    }
                }
                else {
                    let jumping = (mr[5].substring(2, 3) == "#") ? true : false;
                    let dirPosY = parseInt((pos.substring(0, pos.indexOf("-"))));
                    let dirPosX = parseInt(pos.substring(pos.indexOf("-") + 1));
                    let showDiagMoves = false;
                    for (let i = 0; i < parseInt(mr[5].substring(0, 2)); i++) {
                        dirPosY++;
                        dirPosX--;
                        try {
                            let dotPos = dirPosY + "-" + dirPosX;
                            if ((document.getElementById(dotPos).firstChild == null)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showDiagMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                                }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showDiagMoves = true;
                                }
                            }
                            else {
                                showDiagMoves = true;
                            }
                        }
                        catch (err) { showDiagMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                        if (showDiagMoves) { break; }
                    }
                }
                // left
                if (mr[6].substring(0, 2) == "@@") {
                    let jumping = (mr[6].substring(2, 3) == "#") ? true : false;
                    let dirPos = parseInt((pos.substring(pos.indexOf("-") + 1)));
                    let showSideMoves = false;
                    while (!showSideMoves) {
                        dirPos--;
                        try {
                            let dotPos = pos.substring(0, pos.indexOf("-") + 1) + dirPos;
                            if ((document.getElementById(dotPos).firstChild == null)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showSideMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                                }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showSideMoves = true;
                                }
                            }
                            else {
                                showSideMoves = true;
                            }
                        }
                        catch (err) { showSideMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                    }
                }
                else {
                    let jumping = (mr[6].substring(2, 3) == "#") ? true : false;
                    let dirPos = parseInt((pos.substring(pos.indexOf("-") + 1)));
                    let showSideMoves = false;
                    for (let i = 0; i < parseInt(mr[6].substring(0, 2)); i++) {
                        dirPos--;
                        try {
                            let dotPos = pos.substring(0, pos.indexOf("-") + 1) + dirPos;
                            if ((document.getElementById(dotPos).firstChild == null)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showSideMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                                }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showSideMoves = true;
                                }
                            }
                            else {
                                showSideMoves = true;
                            }
                        }
                        catch (err) { showSideMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                        if (showSideMoves) { break; }
                    }


                }
                // up and left
                if (mr[7].substring(0, 2) == "@@") {
                    let jumping = (mr[7].substring(2, 3) == "#") ? true : false;
                    let dirPosY = parseInt((pos.substring(0, pos.indexOf("-"))));
                    let dirPosX = parseInt(pos.substring(pos.indexOf("-") + 1));
                    let showDiagMoves = false;
                    while (!showDiagMoves) {
                        dirPosY--;
                        dirPosX--;
                        try {
                            let dotPos = dirPosY + "-" + dirPosX;
                            if (document.getElementById(dotPos).firstChild == null) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showDiagMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                                }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showDiagMoves = true;
                                }
                            }
                            else {
                                showDiagMoves = true;
                            }
                        }
                        catch (err) { showDiagMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                    }
                }
                else {
                    let jumping = (mr[7].substring(2, 3) == "#") ? true : false;
                    let dirPosY = parseInt((pos.substring(0, pos.indexOf("-"))));
                    let dirPosX = parseInt(pos.substring(pos.indexOf("-") + 1));
                    let showDiagMoves = false;
                    for (let i = 0; i < parseInt(mr[7].substring(0, 2)); i++) {
                        dirPosY--;
                        dirPosX--;
                        try {
                            let dotPos = dirPosY + "-" + dirPosX;
                            if ((document.getElementById(dotPos).firstChild == null)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                                if (showDots) {
                                    document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                                }
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showDiagMoves = !(document.getElementById(dotPos).firstChild.id.substring(document.getElementById(dotPos).firstChild.id.indexOf("-") + 1, document.getElementById(dotPos).firstChild.id.indexOf("-", document.getElementById(dotPos).firstChild.id.indexOf("-") + 1)) == "king");
                                }
                            }
                            else if ((document.getElementById(dotPos).firstChild != null) && ((document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) == color)) {
                                if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                                if (!jumping) {
                                    showDiagMoves = true;
                                }
                            }
                            else {
                                showDiagMoves = true;
                            }
                        }
                        catch (err) { showDiagMoves = true; /* if loop tries to iterate into a wall, then stop */ }
                        if (showDiagMoves) { break; }
                    }
                }
            }
            else {
                let mr = customPiece.movementRules;
                for (let i = 0; i < mr.length; i++) {
                    try {
                        let yDiff = parseInt(mr[i].substring(0, mr[i].indexOf("_")));
                        let xDiff = parseInt(mr[i].substring(mr[i].indexOf("_") + 1));

                        let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + yDiff) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + xDiff);
                        if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                            if (showDots) {
                                document.getElementById(dotPos).innerHTML += "<img src=\"images/moveable-dot.png\" class='dot' onclick='movePiece(\"" + (dotPos) + "\", \"" + pieceId + "\", false)' >";
                            }
                            if (color == "black") { whiteDangerZones.push(dotPos); blackMoveableSpaces.push(dotPos); } else if (color == "white") { blackDangerZones.push(dotPos); whiteMoveableSpaces.push(dotPos); }
                        }
                    } catch (err) { }
                }
            }
        }
        if (showDots) {
            isMoveableShowing = true;
        }
    }
    else {
        hideMoveableSpaces();
    }

    whiteDangerZones = getRidOfDuplicates(whiteDangerZones);
    blackDangerZones = getRidOfDuplicates(blackDangerZones);
    blackMoveableSpaces = getRidOfDuplicates(blackMoveableSpaces);
    whiteMoveableSpaces = getRidOfDuplicates(whiteMoveableSpaces);
}

// hides all of the moveable dots and un-selects a piece
function hideMoveableSpaces() {
    let dot = document.querySelectorAll("img.dot");
    for (let i = 0; i < dot.length; i++) {
        dot[i].remove();
    }
    isMoveableShowing = false;
    selectedId = "";
}

// move a specific piece to a specified position
function movePiece(pos, pieceId, initEnPassantable) {
    if (turnBaseOn && !whiteTurn) {
        whiteTurn = true;
    }
    else if (turnBaseOn && whiteTurn) {
        whiteTurn = false;
    }

    let enPassantable = "";

    if (initEnPassantable) {
        enPassantable = "T";
        availibleEnPassant = document.getElementById(pieceId);
    }
    else {
        enPassantable = "F";
        enPassantReset();
    }

    try {
        let capturedPieceId = document.getElementById(pos).firstChild.id;
        if (capturedPieceId != "") {
            if (defaltPieces.includes(capturedPieceId.substring(0, capturedPieceId.indexOf("-", capturedPieceId.indexOf("-") + 1)))) {
                updateGameScoreboard(pieceId.substring(0, pieceId.indexOf("-")), pointsOfEachPiece[capturedPieceId.substring(capturedPieceId.indexOf("-") + 1, capturedPieceId.indexOf("-", capturedPieceId.indexOf("-") + 1))])
            }
            else {
                let type = capturedPieceId.substring(capturedPieceId.indexOf("-") + 1, capturedPieceId.indexOf("-", capturedPieceId.indexOf("-") + 1));
                updateGameScoreboard(pieceId.substring(0, pieceId.indexOf("-")), customPieces[type].points);

            }
        }
    } catch (err) { }

    document.getElementById(pieceId).parentElement.onclick = function () { hideMoveableSpaces(); };
    document.getElementById(pos).innerHTML = "";
    document.getElementById(pos).onclick = "";
    document.getElementById(pos).append(document.getElementById(pieceId));
    document.getElementById(pieceId).alt = (document.getElementById(pieceId).getAttribute("alt").substring(0, document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(pieceId).getAttribute("alt").substring(document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1, document.getElementById(pieceId).getAttribute("alt").indexOf(";", document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1))) + 1) + "; enPassantable:" + enPassantable + ";";


    if (pieceId.substring(0, pieceId.indexOf("-")) == "white" && pieceId.substring(pieceId.indexOf("-") + 1, pieceId.indexOf("-", pieceId.indexOf("-") + 1)) == "pawn") {
        if (pos.substring(0, pos.indexOf("-")) == "0") {
            pawnTransformationSelector(pieceId.substring(0, pieceId.indexOf("-")), pieceId, pos);
        }
    }
    else if (pieceId.substring(0, pieceId.indexOf("-")) == "black" && pieceId.substring(pieceId.indexOf("-") + 1, pieceId.indexOf("-", pieceId.indexOf("-") + 1)) == "pawn") {
        if (pos.substring(0, pos.indexOf("-")) == ((numOfRows - 1) + "")) {
            pawnTransformationSelector(pieceId.substring(0, pieceId.indexOf("-")), pieceId, pos);
        }
    }

    hideMoveableSpaces();

    checkDangerZones();

    displayTurn();
}

// sets up the menu for a pawn's promotion
function pawnTransformationSelector(color, pieceId, pos) {
    transforming = true;
    let pawnSelectorStr = "";
    for (let i = 0; i < 4; i++) {
        pawnSelectorStr += " 70px ";
    }

    if (color == "white") {
        document.getElementById("black-side-container").style.gridTemplateColumns = pawnSelectorStr;
        document.getElementById("black-side-container").style.gridTemplateRows = "70px";

        let container = document.getElementById("black-side-container");
        container.innerHTML += "<img src='images/white-queen.png' onclick='pawnTransform(\"" + pieceId + "\", \"" + pos + "\", \"queen\");' class='pawn-selector-piece'>";
        container.innerHTML += "<img src='images/white-knight.png' onclick='pawnTransform(\"" + pieceId + "\", \"" + pos + "\", \"knight\");'class='pawn-selector-piece'>";
        container.innerHTML += "<img src='images/white-rook.png' onclick='pawnTransform(\"" + pieceId + "\", \"" + pos + "\", \"rook\");'class='pawn-selector-piece'>";
        container.innerHTML += "<img src='images/white-bishop.png' onclick='pawnTransform(\"" + pieceId + "\", \"" + pos + "\", \"bishop\");'class='pawn-selector-piece'>";
    }
    else if (color == "black") {
        document.getElementById("white-side-container").style.gridTemplateColumns = pawnSelectorStr;
        document.getElementById("white-side-container").style.gridTemplateRows = "70px";

        let container = document.getElementById("white-side-container");
        container.innerHTML += "<img src='images/black-queen.png' onclick='pawnTransform(\"" + pieceId + "\", \"" + pos + "\", \"queen\");'class='pawn-selector-piece'>";
        container.innerHTML += "<img src='images/black-knight.png' onclick='pawnTransform(\"" + pieceId + "\", \"" + pos + "\", \"knight\");'class='pawn-selector-piece'>";
        container.innerHTML += "<img src='images/black-rook.png' onclick='pawnTransform(\"" + pieceId + "\", \"" + pos + "\", \"rook\");'class='pawn-selector-piece'>";
        container.innerHTML += "<img src='images/black-bishop.png' onclick='pawnTransform(\"" + pieceId + "\", \"" + pos + "\", \"bishop\");'class='pawn-selector-piece'>";
    }
}

// promotes a pawn to a specified piece
function pawnTransform(pieceId, pos, pieceType) {
    document.getElementById(pos).innerHTML = "";
    addPiece(pieceId.substring(0, pieceId.indexOf("-")), pieceType, pos);

    document.getElementById("white-side-container").innerHTML = "";
    document.getElementById("white-side-container").style.gridTemplateRows = "";
    document.getElementById("white-side-container").style.gridTemplateColumns = "";
    document.getElementById("black-side-container").innerHTML = "";
    document.getElementById("black-side-container").style.gridTemplateRows = "";
    document.getElementById("black-side-container").style.gridTemplateColumns = "";
    transforming = false;

    checkDangerZones();
    displayTurn();
}

// executes an en passont
function enPassant(pos, pieceId, posEP) {
    let enPassantable = "F";
    document.getElementById(posEP).innerHTML = "";

    hideMoveableSpaces();

    document.getElementById(pieceId).parentElement.onclick = function () { hideMoveableSpaces(); };
    document.getElementById(pos).innerHTML = "";
    document.getElementById(pos).onclick = "";
    document.getElementById(pos).append(document.getElementById(pieceId));
    document.getElementById(pieceId).alt = (document.getElementById(pieceId).getAttribute("alt").substring(0, document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(pieceId).getAttribute("alt").substring(document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1, document.getElementById(pieceId).getAttribute("alt").indexOf(";", document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1))) + 1) + "; enPassantable:" + enPassantable + ";";

    if (turnBaseOn && !whiteTurn) {
        whiteTurn = true;
    }
    else if (turnBaseOn && whiteTurn) {
        whiteTurn = false;
    }

    checkDangerZones();
    displayTurn();
}

// the pawn that could have been en passant-ed, can no longer be en passant-ed
function enPassantReset() {
    try {
        document.getElementById(availibleEnPassant.id).alt = (document.getElementById(availibleEnPassant.id).getAttribute("alt").substring(0, document.getElementById(availibleEnPassant.id).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(availibleEnPassant.id).getAttribute("alt").substring(document.getElementById(availibleEnPassant.id).getAttribute("alt").indexOf(":") + 1, document.getElementById(availibleEnPassant.id).getAttribute("alt").indexOf(";", document.getElementById(availibleEnPassant.id).getAttribute("alt").indexOf(":") + 1))) + 1) + "; enPassantable:" + "F" + ";";
        availibleEnPassant = null;
    }
    catch (err) { }
}

// castles a king an rook
function castle(pieceId, rookId) {
    let kingPos = document.getElementById(pieceId).parentElement.id;
    let rookPos = document.getElementById(rookId).parentElement.id;

    if (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) < parseInt(rookPos.substring(rookPos.indexOf("-") + 1))) { // check right
        if (document.getElementById(kingPos.substring(0, kingPos.indexOf("-") + 1) + (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) + 2)) != null) {
            document.getElementById(pieceId).parentElement.onclick = function () { hideMoveableSpaces(); };
            document.getElementById(rookId).parentElement.onclick = function () { hideMoveableSpaces(); };

            document.getElementById(kingPos.substring(0, kingPos.indexOf("-") + 1) + (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) + 2)).onclick = "";
            document.getElementById(kingPos.substring(0, kingPos.indexOf("-") + 1) + (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) + 1)).onclick = "";

            document.getElementById(kingPos.substring(0, kingPos.indexOf("-") + 1) + (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) + 2)).append(document.getElementById(pieceId));
            document.getElementById(kingPos.substring(0, kingPos.indexOf("-") + 1) + (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) + 1)).append(document.getElementById(rookId));

            document.getElementById(pieceId).alt = (document.getElementById(pieceId).getAttribute("alt").substring(0, document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(pieceId).getAttribute("alt").substring(document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1, document.getElementById(pieceId).getAttribute("alt").indexOf(";", document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1))) + 1) + ";";
            document.getElementById(rookId).alt = (document.getElementById(rookId).getAttribute("alt").substring(0, document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(rookId).getAttribute("alt").substring(document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1, document.getElementById(rookId).getAttribute("alt").indexOf(";", document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1))) + 1) + ";";
        }
        else {
            document.getElementById(rookPos).append(document.getElementById(pieceId));
            document.getElementById(kingPos).append(document.getElementById(rookId));

            document.getElementById(pieceId).alt = (document.getElementById(pieceId).getAttribute("alt").substring(0, document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(pieceId).getAttribute("alt").substring(document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1, document.getElementById(pieceId).getAttribute("alt").indexOf(";", document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1))) + 1) + ";";
            document.getElementById(rookId).alt = (document.getElementById(rookId).getAttribute("alt").substring(0, document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(rookId).getAttribute("alt").substring(document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1, document.getElementById(rookId).getAttribute("alt").indexOf(";", document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1))) + 1) + ";";
        }
    }
    else if (parseInt(kingPos.substring(0, kingPos.indexOf("-"))) < parseInt(rookPos.substring(0, rookPos.indexOf("-")))) { // check down
        if (document.getElementById((parseInt(kingPos.substring(0, kingPos.indexOf("-"))) + 2) + kingPos.substring(kingPos.indexOf("-"))) != null) {
            document.getElementById(pieceId).parentElement.onclick = function () { hideMoveableSpaces(); };
            document.getElementById(rookId).parentElement.onclick = function () { hideMoveableSpaces(); };

            document.getElementById((parseInt(kingPos.substring(0, kingPos.indexOf("-"))) + 2) + kingPos.substring(kingPos.indexOf("-"))).onclick = "";
            document.getElementById((parseInt(kingPos.substring(0, kingPos.indexOf("-"))) + 1) + kingPos.substring(kingPos.indexOf("-"))).onclick = "";

            document.getElementById((parseInt(kingPos.substring(0, kingPos.indexOf("-"))) + 2) + kingPos.substring(kingPos.indexOf("-"))).append(document.getElementById(pieceId));
            document.getElementById((parseInt(kingPos.substring(0, kingPos.indexOf("-"))) + 1) + kingPos.substring(kingPos.indexOf("-"))).append(document.getElementById(rookId));

            document.getElementById(pieceId).alt = (document.getElementById(pieceId).getAttribute("alt").substring(0, document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(pieceId).getAttribute("alt").substring(document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1, document.getElementById(pieceId).getAttribute("alt").indexOf(";", document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1))) + 1) + ";";
            document.getElementById(rookId).alt = (document.getElementById(rookId).getAttribute("alt").substring(0, document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(rookId).getAttribute("alt").substring(document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1, document.getElementById(rookId).getAttribute("alt").indexOf(";", document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1))) + 1) + ";";
        }
        else {
            document.getElementById(rookPos).append(document.getElementById(pieceId));
            document.getElementById(kingPos).append(document.getElementById(rookId));

            document.getElementById(pieceId).alt = (document.getElementById(pieceId).getAttribute("alt").substring(0, document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(pieceId).getAttribute("alt").substring(document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1, document.getElementById(pieceId).getAttribute("alt").indexOf(";", document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1))) + 1) + ";";
            document.getElementById(rookId).alt = (document.getElementById(rookId).getAttribute("alt").substring(0, document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(rookId).getAttribute("alt").substring(document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1, document.getElementById(rookId).getAttribute("alt").indexOf(";", document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1))) + 1) + ";";
        }
    }
    else if (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) > parseInt(rookPos.substring(rookPos.indexOf("-") + 1))) { // check left
        if (document.getElementById(kingPos.substring(0, kingPos.indexOf("-") + 1) + (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) - 2)) != null) {
            document.getElementById(pieceId).parentElement.onclick = function () { hideMoveableSpaces(); };
            document.getElementById(rookId).parentElement.onclick = function () { hideMoveableSpaces(); };

            document.getElementById(kingPos.substring(0, kingPos.indexOf("-") + 1) + (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) - 2)).onclick = "";
            document.getElementById(kingPos.substring(0, kingPos.indexOf("-") + 1) + (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) - 1)).onclick = "";

            document.getElementById(kingPos.substring(0, kingPos.indexOf("-") + 1) + (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) - 2)).append(document.getElementById(pieceId));
            document.getElementById(kingPos.substring(0, kingPos.indexOf("-") + 1) + (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) - 1)).append(document.getElementById(rookId));

            document.getElementById(pieceId).alt = (document.getElementById(pieceId).getAttribute("alt").substring(0, document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(pieceId).getAttribute("alt").substring(document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1, document.getElementById(pieceId).getAttribute("alt").indexOf(";", document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1))) + 1) + ";";
            document.getElementById(rookId).alt = (document.getElementById(rookId).getAttribute("alt").substring(0, document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(rookId).getAttribute("alt").substring(document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1, document.getElementById(rookId).getAttribute("alt").indexOf(";", document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1))) + 1) + ";";
        }
        else {
            document.getElementById(rookPos).append(document.getElementById(pieceId));
            document.getElementById(kingPos).append(document.getElementById(rookId));

            document.getElementById(pieceId).alt = (document.getElementById(pieceId).getAttribute("alt").substring(0, document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(pieceId).getAttribute("alt").substring(document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1, document.getElementById(pieceId).getAttribute("alt").indexOf(";", document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1))) + 1) + ";";
            document.getElementById(rookId).alt = (document.getElementById(rookId).getAttribute("alt").substring(0, document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(rookId).getAttribute("alt").substring(document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1, document.getElementById(rookId).getAttribute("alt").indexOf(";", document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1))) + 1) + ";";
        }
    }
    else if (parseInt(kingPos.substring(0, kingPos.indexOf("-"))) > parseInt(rookPos.substring(0, rookPos.indexOf("-")))) { // check up
        if (document.getElementById((parseInt(kingPos.substring(0, kingPos.indexOf("-"))) - 2) + kingPos.substring(kingPos.indexOf("-"))) != null) {
            document.getElementById(pieceId).parentElement.onclick = function () { hideMoveableSpaces(); };
            document.getElementById(rookId).parentElement.onclick = function () { hideMoveableSpaces(); };

            document.getElementById((parseInt(kingPos.substring(0, kingPos.indexOf("-"))) - 2) + kingPos.substring(kingPos.indexOf("-"))).onclick = "";
            document.getElementById((parseInt(kingPos.substring(0, kingPos.indexOf("-"))) - 1) + kingPos.substring(kingPos.indexOf("-"))).onclick = "";

            document.getElementById((parseInt(kingPos.substring(0, kingPos.indexOf("-"))) - 2) + kingPos.substring(kingPos.indexOf("-"))).append(document.getElementById(pieceId));
            document.getElementById((parseInt(kingPos.substring(0, kingPos.indexOf("-"))) - 1) + kingPos.substring(kingPos.indexOf("-"))).append(document.getElementById(rookId));

            document.getElementById(pieceId).alt = (document.getElementById(pieceId).getAttribute("alt").substring(0, document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(pieceId).getAttribute("alt").substring(document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1, document.getElementById(pieceId).getAttribute("alt").indexOf(";", document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1))) + 1) + ";";
            document.getElementById(rookId).alt = (document.getElementById(rookId).getAttribute("alt").substring(0, document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(rookId).getAttribute("alt").substring(document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1, document.getElementById(rookId).getAttribute("alt").indexOf(";", document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1))) + 1) + ";";
        }
        else {
            document.getElementById(rookPos).append(document.getElementById(pieceId));
            document.getElementById(kingPos).append(document.getElementById(rookId));

            document.getElementById(pieceId).alt = (document.getElementById(pieceId).getAttribute("alt").substring(0, document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(pieceId).getAttribute("alt").substring(document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1, document.getElementById(pieceId).getAttribute("alt").indexOf(";", document.getElementById(pieceId).getAttribute("alt").indexOf(":") + 1))) + 1) + ";";
            document.getElementById(rookId).alt = (document.getElementById(rookId).getAttribute("alt").substring(0, document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1)) + (parseInt(document.getElementById(rookId).getAttribute("alt").substring(document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1, document.getElementById(rookId).getAttribute("alt").indexOf(";", document.getElementById(rookId).getAttribute("alt").indexOf(":") + 1))) + 1) + ";";
        }
    }

    if (turnBaseOn && !whiteTurn) {
        whiteTurn = true;
    }
    else if (turnBaseOn && whiteTurn) {
        whiteTurn = false;
    }

    hideMoveableSpaces();

    checkDangerZones();

    displayTurn();
}

// ##################################################################################
// MISCELLANEOUS
// ##################################################################################

// resets all of the variables to their defalt values
function resetVariables() {
    numOfRows = 5;
    numOfColumns = 5;
    isMoveableShowing = false;
    selectedId = "";
    numOfEachPiece = { "black-king": 0, "white-king": 0, "black-pawn": 0, "white-pawn": 0, "black-knight": 0, "white-knight": 0, "black-rook": 0, "white-rook": 0, "black-bishop": 0, "white-bishop": 0, "black-queen": 0, "white-queen": 0 };
    availibleEnPassant = null;
    turnBaseOn = true;
    whiteTurn = true;
    transforming = false;
    whiteDangerZones = [];
    blackDangerZones = [];
    blackMoveableSpaces = [];
    whiteMoveableSpaces = [];
    whiteScore = 0;
    blackScore = 0;
    whiteKingDots = 0;
    blackKingDots = 0;
    selectedPiece = "";
    isCustomizing = false;
    settingRow = false;
    settingColumn = false;
    removing = false;
    gameOver = true;
    customPieces = {};


    document.getElementById("piece-selector-container").innerHTML = "";
    document.getElementById("piece-selector-container").style = "";

    document.getElementById("black-side-container").innerHTML = "";
    document.getElementById("black-side-container").style = "";

    document.getElementById("white-side-container").innerHTML = "";
    document.getElementById("white-side-container").style = "";
}

// gets rid of duplicates and negatives, used to reduce clutter in the colorDangerZones and colorMoveableSpaces arrays
function getRidOfDuplicates(arr) {
    let newArr = []
    for (let i = 0; i < arr.length; i++) {
        if (!newArr.includes(arr[i]) && parseInt(arr[i].substring(arr[i].indexOf("-") + 1)) >= 0) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

// checks how many valid moves all of the kings on a team have
function checkKingDots() {
    for (let i = 0; i < numOfEachPiece["black-king"]; i++) {
        if (document.getElementById('black-king-' + i) != null) {
            let pos = document.getElementById('black-king-' + i).parentElement.id;
            let color = "black";
            try {
                // 1 right
                let dotPos = (parseInt(pos.substring(0, pos.indexOf("-")))) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 1);

                if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                    if (color == "black") {
                        if (!blackDangerZones.includes(dotPos)) {
                            blackKingDots++;
                        }
                    }
                }
            }
            catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

            try {
                // 1 down, 1 right
                let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 1);

                if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                    if (color == "black") {
                        if (!blackDangerZones.includes(dotPos)) {
                            blackKingDots++;
                        }
                    }
                }
            }
            catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

            try {
                // 1 down
                let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)));

                if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                    if (color == "black") {
                        if (!blackDangerZones.includes(dotPos)) {
                            blackKingDots++;
                        }
                    }
                }
            }
            catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

            try {
                // 1 down, 1 left
                let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 1);

                if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                    if (color == "black") {
                        if (!blackDangerZones.includes(dotPos)) {
                            blackKingDots++;
                        }
                    }
                }
            }
            catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

            try {
                // 1 left
                let dotPos = (parseInt(pos.substring(0, pos.indexOf("-")))) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 1);

                if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                    if (color == "black") {
                        if (!blackDangerZones.includes(dotPos)) {
                            blackKingDots++;
                        }
                    }
                }
            }
            catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

            try {
                // 1 up, 1 left
                let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 1);

                if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                    if (color == "black") {
                        if (!blackDangerZones.includes(dotPos)) {
                            blackKingDots++;
                        }
                    }
                }
            }
            catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

            try {
                // 1 up
                let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)));

                if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                    if (color == "black") {
                        if (!blackDangerZones.includes(dotPos)) {
                            blackKingDots++;
                        }
                    }
                }
            }
            catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

            try {
                // 1 up, 1 right
                let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 1);

                if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                    if (color == "black") {
                        if (!blackDangerZones.includes(dotPos)) {
                            blackKingDots++;
                        }
                    }
                }
            }
            catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

        }
    }
    for (let i = 0; i < numOfEachPiece["white-king"]; i++) {
        if (document.getElementById('white-king-' + i) != null) {
            let pos = document.getElementById('white-king-' + i).parentElement.id;
            let color = "white";
            try {
                // 1 right
                let dotPos = (parseInt(pos.substring(0, pos.indexOf("-")))) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 1);

                if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                    if (color == "white") {
                        if (!whiteDangerZones.includes(dotPos)) {
                            whiteKingDots++;
                        }
                    }
                }
            }
            catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

            try {
                // 1 down, 1 right
                let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 1);

                if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                    if (color == "white") {
                        if (!whiteDangerZones.includes(dotPos)) {
                            whiteKingDots++;
                        }
                    }
                }
            }
            catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

            try {
                // 1 down
                let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)));

                if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                    if (color == "white") {
                        if (!whiteDangerZones.includes(dotPos)) {
                            whiteKingDots++;
                        }
                    }
                }
            }
            catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

            try {
                // 1 down, 1 left
                let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) + 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 1);

                if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                    if (color == "white") {
                        if (!whiteDangerZones.includes(dotPos)) {
                            whiteKingDots++;
                        }
                    }
                }
            }
            catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

            try {
                // 1 left
                let dotPos = (parseInt(pos.substring(0, pos.indexOf("-")))) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 1);

                if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                    if (color == "white") {
                        if (!whiteDangerZones.includes(dotPos)) {
                            whiteKingDots++;
                        }
                    }
                }
            }
            catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

            try {
                // 1 up, 1 left
                let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) - 1);

                if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                    if (color == "white") {
                        if (!whiteDangerZones.includes(dotPos)) {
                            whiteKingDots++;
                        }
                    }
                }
            }
            catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

            try {
                // 1 up
                let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)));

                if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                    if (color == "white") {
                        if (!whiteDangerZones.includes(dotPos)) {
                            whiteKingDots++;
                        }
                    }
                }
            }
            catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }

            try {
                // 1 up, 1 right
                let dotPos = (parseInt(pos.substring(0, pos.indexOf("-"))) - 1) + "-" + (parseInt(pos.substring(pos.indexOf("-") + 1)) + 1);

                if (((document.getElementById(dotPos).firstChild == null)) || ((document.getElementById(dotPos).firstChild != null) && (document.getElementById(dotPos).firstChild.id.substring(0, document.getElementById(dotPos).firstChild.id.indexOf("-"))) != color)) {
                    if (color == "white") {
                        if (!whiteDangerZones.includes(dotPos)) {
                            whiteKingDots++;
                        }
                    }
                }
            }
            catch (err) {/* try and catch to prevent TypeError in case of being next to a wall or ally */ }
        }
    }
}

// checks the danger zones of both teams and checks if the game should be ended
function checkDangerZones() {
    whiteDangerZones = [];
    blackDangerZones = [];

    whiteMoveableSpaces = [];
    blackMoveableSpaces = [];

    let totalWhite = 0;
    let totalBlack = 0;
    for (let p in numOfEachPiece) {
        for (let k = 0; k < numOfEachPiece[p]; k++) {
            let piece = p + "-" + k;
            if (document.getElementById(piece) != null) {
                showMoveableSpaces(piece, false);
                let color = p.substring(0, piece.indexOf("-"));
                if (color == "white") { totalWhite++; }
                if (color == "black") { totalBlack++; }
            }
        }
    }

    whiteDangerZones = getRidOfDuplicates(whiteDangerZones);
    blackDangerZones = getRidOfDuplicates(blackDangerZones);

    whiteMoveableSpaces = getRidOfDuplicates(whiteMoveableSpaces);
    blackMoveableSpaces = getRidOfDuplicates(blackMoveableSpaces);

    for (let i = 0; i < numOfEachPiece["black-king"]; i++) {
        try {
            let pos = document.getElementById("black-king-" + i).parentElement.id;

            if (blackDangerZones.includes(pos)) {
                document.getElementById("black-king-" + i).style.backgroundColor = "red";
            }
            else {
                document.getElementById("black-king-" + i).style.backgroundColor = "transparent";
            }
        }
        catch {/* Here to account for a king being dead */ }
    }

    for (let i = 0; i < numOfEachPiece["white-king"]; i++) {
        try {
            let pos = document.getElementById("white-king-" + i).parentElement.id;

            if (whiteDangerZones.includes(pos)) {
                document.getElementById("white-king-" + i).style.backgroundColor = "red";
            }
            else {
                document.getElementById("white-king-" + i).style.backgroundColor = "transparent";
            }
        }
        catch {/* Here to account for a king being dead */ }
    }

    whiteKingDots = 0;
    blackKingDots = 0;
    checkKingDots();

    let whiteWon = false;
    let blackWon = false;

    let stalemate = false;
    let blackOneInCheck = false;
    let whiteOneInCheck = false;

    let kingAlive = true;
    let aliveKings = 0;
    for (let i = 0; i < numOfEachPiece["black-king"]; i++) {
        aliveKings += (document.getElementById("black-king-" + i) == null) ? 0 : 1;
        if (document.getElementById("black-king-" + i) != null && document.getElementById("black-king-" + i).style.backgroundColor == "red") {
            blackOneInCheck = true;
        }
    }
    kingAlive = (aliveKings > 0) ? true : false;
    if (!kingAlive || ((totalBlack == aliveKings) && blackKingDots == 0 && blackOneInCheck) || ((totalBlack != aliveKings) && blackKingDots == 0 && blackOneInCheck && blackMoveableSpaces.length <= 8)) {
        whiteWon = true;
    }
    else if (((totalBlack == aliveKings) && blackKingDots == 0 && !blackOneInCheck) || blackMoveableSpaces.length == 0) {
        stalemate = true;
    }

    kingAlive = true;
    aliveKings = 0;
    for (let i = 0; i < numOfEachPiece["white-king"]; i++) {
        aliveKings += (document.getElementById("white-king-" + i) == null) ? 0 : 1;
        if (document.getElementById("white-king-" + i) != null && document.getElementById("white-king-" + i).style.backgroundColor == "red") {
            whiteOneInCheck = true;
        }
    }
    kingAlive = (aliveKings > 0);
    if (!kingAlive || ((totalWhite == aliveKings) && whiteKingDots == 0 && whiteOneInCheck) || ((totalWhite != aliveKings) && whiteKingDots == 0 && whiteOneInCheck && whiteMoveableSpaces.length <= 8)) {
        blackWon = true;
    }
    else if (((totalWhite == aliveKings) && whiteKingDots == 0 && !whiteOneInCheck) || whiteMoveableSpaces.length == 0) {
        stalemate = true;
    }




    if (whiteWon && blackWon) {
        endGame("tie", true);
    }
    else if (whiteWon && !blackWon) {
        endGame("white", true);
    }
    else if (!whiteWon && blackWon) {
        endGame("black", true);
    }
    else if (stalemate) {
        endGame("stalemate", true);
    }
}

// checks if there is anything in between a king and a rook
function checkInBetween(kingPos, rookPos) {
    let lane = [];

    if (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) < parseInt(rookPos.substring(rookPos.indexOf("-") + 1))) { // check right
        if (kingPos.substring(0, kingPos.indexOf("-")) == rookPos.substring(0, rookPos.indexOf("-"))) {
            for (let i = parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) + 1; i <= parseInt(rookPos.substring(rookPos.indexOf("-") + 1)); i++) {
                if ((document.getElementById(kingPos.substring(0, kingPos.indexOf("-")) + "-" + i).firstChild == null) || (document.getElementById(kingPos.substring(0, kingPos.indexOf("-")) + "-" + i).firstChild != null && kingPos.substring(0, kingPos.indexOf("-")) + "-" + i == rookPos)) {
                    lane.push(true);
                }
                else {
                    lane.push(false);
                }
            }
        }
    }
    else if (parseInt(kingPos.substring(0, kingPos.indexOf("-"))) < parseInt(rookPos.substring(0, rookPos.indexOf("-")))) { // check down
        if (kingPos.substring(kingPos.indexOf("-") + 1) == rookPos.substring(rookPos.indexOf("-") + 1)) {
            for (let i = parseInt(kingPos.substring(0, kingPos.indexOf("-"))) + 1; i <= parseInt(rookPos.substring(0, rookPos.indexOf("-"))); i++) {
                if ((document.getElementById(i + "-" + kingPos.substring(kingPos.indexOf("-") + 1)).firstChild == null) || (document.getElementById(i + "-" + kingPos.substring(kingPos.indexOf("-") + 1)).firstChild != null && i + "-" + kingPos.substring(kingPos.indexOf("-") + 1) == rookPos)) {
                    lane.push(true);
                }
                else {
                    lane.push(false);
                }
            }
        }
    }
    else if (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) > parseInt(rookPos.substring(rookPos.indexOf("-") + 1))) { // check left
        if (kingPos.substring(0, kingPos.indexOf("-")) == rookPos.substring(0, rookPos.indexOf("-"))) {
            for (let i = parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) - 1; i >= parseInt(rookPos.substring(rookPos.indexOf("-") + 1)); i--) {
                if ((document.getElementById(kingPos.substring(0, kingPos.indexOf("-")) + "-" + i).firstChild == null) || (document.getElementById(kingPos.substring(0, kingPos.indexOf("-")) + "-" + i).firstChild != null && kingPos.substring(0, kingPos.indexOf("-")) + "-" + i == rookPos)) {
                    lane.push(true);
                }
                else {
                    lane.push(false);
                }
            }
        }
    }
    else if (parseInt(kingPos.substring(0, kingPos.indexOf("-"))) > parseInt(rookPos.substring(0, rookPos.indexOf("-")))) { // check up
        if (kingPos.substring(kingPos.indexOf("-") + 1) == rookPos.substring(rookPos.indexOf("-") + 1)) {
            for (let i = parseInt(kingPos.substring(0, kingPos.indexOf("-"))) - 1; i >= parseInt(rookPos.substring(0, rookPos.indexOf("-"))); i--) {
                if ((document.getElementById(i + "-" + kingPos.substring(kingPos.indexOf("-") + 1)).firstChild == null) || (document.getElementById(i + "-" + kingPos.substring(kingPos.indexOf("-") + 1)).firstChild != null && i + "-" + kingPos.substring(kingPos.indexOf("-") + 1) == rookPos)) {
                    lane.push(true);
                }
                else {
                    lane.push(false);
                }
            }
        }
    }

    let avi = false;
    for (let i = 0; i < lane.length; i++) {
        if (lane[i] == true) {
            avi = true;
        }
        else {
            avi = false;
            break;
        }
    }
    return avi;
}

// simulates a castle and returns where the king would end up
function simCastle(pieceId, rookId) {
    let kingPos = document.getElementById(pieceId).parentElement.id;
    let rookPos = document.getElementById(rookId).parentElement.id;

    if (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) < parseInt(rookPos.substring(rookPos.indexOf("-") + 1))) { // check right
        if (document.getElementById(kingPos.substring(0, kingPos.indexOf("-") + 1) + (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) + 2)) != null) {
            return (kingPos.substring(0, kingPos.indexOf("-") + 1) + (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) + 2));
        }
        else {
            return (rookPos);
        }
    }
    else if (parseInt(kingPos.substring(0, kingPos.indexOf("-"))) < parseInt(rookPos.substring(0, rookPos.indexOf("-")))) { // check down
        if (document.getElementById((parseInt(kingPos.substring(0, kingPos.indexOf("-"))) + 2) + kingPos.substring(kingPos.indexOf("-")))) {
            return ((parseInt(kingPos.substring(0, kingPos.indexOf("-"))) + 2) + kingPos.substring(kingPos.indexOf("-")));
        }
        else {
            return (rookPos);
        }
    }
    else if (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) > parseInt(rookPos.substring(rookPos.indexOf("-") + 1))) { // check left
        if (document.getElementById(kingPos.substring(0, kingPos.indexOf("-") + 1) + (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) - 2)) != null) {
            return (kingPos.substring(0, kingPos.indexOf("-") + 1) + (parseInt(kingPos.substring(kingPos.indexOf("-") + 1)) - 2));
        }
        else {
            return (rookPos);
        }
    }
    else if (parseInt(kingPos.substring(0, kingPos.indexOf("-"))) > parseInt(rookPos.substring(0, rookPos.indexOf("-")))) { // check up
        if (document.getElementById((parseInt(kingPos.substring(0, kingPos.indexOf("-"))) - 2) + kingPos.substring(kingPos.indexOf("-"))) != null) {
            return ((parseInt(kingPos.substring(0, kingPos.indexOf("-"))) - 2) + kingPos.substring(kingPos.indexOf("-")));
        }
        else {
            return (rookPos);
        }
    }
}

// toggle for whether to show to the rows and columns section
function toggleRowsColumnsSection(){
    if(isCustomizing){
        document.getElementById("rows-columns-section").style.display = "block";
    }
    else{
        document.getElementById("rows-columns-section").style.display = "none";
    }
}
