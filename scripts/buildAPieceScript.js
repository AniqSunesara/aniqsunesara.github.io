
// ##################################################################################
// VARIABLES
// ##################################################################################

const defaltPieces = ["king", "pawn", "knight", "rook", "bishop", "queen", "black-king", "white-king", "black-pawn", "white-pawn", "black-knight", "white-knight", "black-rook", "white-rook", "black-bishop", "white-bishop", "black-queen", "white-queen"];

let codeGenerated = false;
let currentCode = "";
let isStandard = true;
let uniqueDots = [];

// ##################################################################################
// BUILD A PIECE
// ##################################################################################

// sets up the Build A Piece page
function setupBuildAPiece() {
    makeCustomBoard(9, 9);
    document.getElementById("4-4").innerHTML += "<img class=\"piece\" src=\"images/black-custom.png\">";
}

// makes the chess board with given size
function makeCustomBoard(r, c) {
    let rowStr = "";
    let columnStr = "";
    let boxWidth = " 70px "
    document.getElementById("container-b").innerHTML = "";
    for (let i = 0; i < r; i++) {
        rowStr += boxWidth;
        for (let k = 0; k < c; k++) {
            document.getElementById("container-b").innerHTML += "<div id=" + i + "-" + k + " onclick=\"placeSpot('" + i + "-" + k + "');\"></div>";
        }
    }
    for (let o = 0; o < c; o++) {
        columnStr += boxWidth;
    }


    if (c % 2 != 0) {
        let bool = true;
        for (let x = 0; x < document.getElementById("container-b").getElementsByTagName("*").length; x++) {
            if (bool) {
                document.getElementById("container-b").getElementsByTagName("*")[x].classList.add("light-space")
                bool = false;
            }
            else {
                document.getElementById("container-b").getElementsByTagName("*")[x].classList.add("dark-space")
                bool = true;
            }
        }
    }
    else {
        let bool = true;
        for (let x = 0; x < document.getElementById("container-b").getElementsByTagName("*").length; x++) {
            if (bool) {
                document.getElementById("container-b").getElementsByTagName("*")[x].classList.add("light-space")
                bool = false;
            }
            else {
                document.getElementById("container-b").getElementsByTagName("*")[x].classList.add("dark-space")
                bool = true;
            }

            if ((x + 1) % numOfColumns == 0) {
                bool = !bool;
            }
        }
    }

    document.getElementById("container-b").style.gridTemplateRows = rowStr;
    document.getElementById("container-b").style.gridTemplateColumns = columnStr;

    document.getElementById("4-4").onclick = function () { return; }
}

// toggle for the movement type
function toggleMovement(m) {
    if (m == "s") {
        document.getElementById("standard-input").style.color = "red";
        document.getElementById("unique-input").style.color = "black";
        isStandard = true;
        document.getElementById("standard-movement-input").style.display = "flex"
        document.getElementById("unique-movement-input").style.display = "none"
    }
    else {
        document.getElementById("standard-input").style.color = "black";
        document.getElementById("unique-input").style.color = "red";
        isStandard = false;
        document.getElementById("standard-movement-input").style.display = "none"
        document.getElementById("unique-movement-input").style.display = "block"
    }
}

// toggle for the color field
function toggleColor(c) {
    if (c == "b") {
        document.getElementById("black-color-input").style.color = "red";
        document.getElementById("white-color-input").style.color = "black";
        document.getElementById("4-4").innerHTML = "<img class=\"piece\" src=\"images/black-custom.png\">";
    }
    else {
        document.getElementById("black-color-input").style.color = "black";
        document.getElementById("white-color-input").style.color = "red";
        document.getElementById("4-4").innerHTML = "<img class=\"piece\" src=\"images/white-custom.png\">";
    }
}

// generate piece code according to the users input
function generateCode() {
    if (document.getElementById("name-input").value == "") {
        window.alert("The name field is incomplete");
        return;
    }
    else if (defaltPieces.includes(document.getElementById("name-input").value.toLowerCase())) {
        window.alert("You cannot name your piece the name of defalt chess piece");
        return;
    }

    if (document.getElementById("black-color-input").style.color != "red" && document.getElementById("white-color-input").style.color != "red") {
        window.alert("You have not chosen a color");
        return;
    }

    let name = document.getElementById("name-input").value.toLowerCase().replace(" ", "_");

    let color = (document.getElementById("black-color-input").style.color == "red") ? "b" : "w";

    if ((parseInt(document.getElementById("points-input").value) < parseInt(document.getElementById("points-input").min)) || (document.getElementById("points-input").value == "")) {
        document.getElementById("points-input").value = document.getElementById("points-input").min;
    }
    else if (parseInt(document.getElementById("points-input").value) > parseInt(document.getElementById("points-input").max)) {
        document.getElementById("points-input").value = document.getElementById("points-input").max;
    }
    let points = parseInt(document.getElementById("points-input").value);

    let movement = (isStandard) ? "s" : "u";

    let code = "";

    if (isStandard) {
        let up = "";
        if (document.getElementById("up-infinite-input").checked) {
            up = "@@";
        }
        else {
            if ((parseInt(document.getElementById("up-input").value) < parseInt(document.getElementById("up-input").min)) || (document.getElementById("up-input").value == "")) {
                document.getElementById("up-input").value = document.getElementById("up-input").min;
            }
            else if (parseInt(document.getElementById("up-input").value) > parseInt(document.getElementById("up-input").max)) {
                document.getElementById("up-input").value = document.getElementById("up-input").max;
            }
            up = (parseInt(document.getElementById("up-input").value) >= 10) ? parseInt(document.getElementById("up-input").value) : "0" + parseInt(document.getElementById("up-input").value);
        }
        if (document.getElementById("up-jumping-input").checked) {
            up += "#";
        }
        else {
            up += "?";
        }

        let upright = "";
        if (document.getElementById("upright-infinite-input").checked) {
            upright = "@@";
        }
        else {
            if ((parseInt(document.getElementById("upright-input").value) < parseInt(document.getElementById("upright-input").min)) || (document.getElementById("upright-input").value == "")) {
                document.getElementById("upright-input").value = document.getElementById("upright-input").min;
            }
            else if (parseInt(document.getElementById("upright-input").value) > parseInt(document.getElementById("upright-input").max)) {
                document.getElementById("upright-input").value = document.getElementById("upright-input").max;
            }
            upright = (parseInt(document.getElementById("upright-input").value) >= 10) ? parseInt(document.getElementById("upright-input").value) : "0" + parseInt(document.getElementById("upright-input").value);
        }
        if (document.getElementById("upright-jumping-input").checked) {
            upright += "#";
        }
        else {
            upright += "?";
        }

        let right = "";
        if (document.getElementById("right-infinite-input").checked) {
            right = "@@";
        }
        else {
            if ((parseInt(document.getElementById("right-input").value) < parseInt(document.getElementById("right-input").min)) || (document.getElementById("right-input").value == "")) {
                document.getElementById("right-input").value = document.getElementById("right-input").min;
            }
            else if (parseInt(document.getElementById("right-input").value) > parseInt(document.getElementById("right-input").max)) {
                document.getElementById("right-input").value = document.getElementById("right-input").max;
            }
            right = (parseInt(document.getElementById("right-input").value) >= 10) ? parseInt(document.getElementById("right-input").value) : "0" + parseInt(document.getElementById("right-input").value);
        }
        if (document.getElementById("right-jumping-input").checked) {
            right += "#";
        }
        else {
            right += "?";
        }

        let downright = "";
        if (document.getElementById("downright-infinite-input").checked) {
            downright = "@@";
        }
        else {
            if ((parseInt(document.getElementById("downright-input").value) < parseInt(document.getElementById("downright-input").min)) || (document.getElementById("downright-input").value == "")) {
                document.getElementById("downright-input").value = document.getElementById("downright-input").min;
            }
            else if (parseInt(document.getElementById("downright-input").value) > parseInt(document.getElementById("downright-input").max)) {
                document.getElementById("downright-input").value = document.getElementById("downright-input").max;
            }
            downright = (parseInt(document.getElementById("downright-input").value) >= 10) ? parseInt(document.getElementById("downright-input").value) : "0" + parseInt(document.getElementById("downright-input").value);
        }
        if (document.getElementById("downright-jumping-input").checked) {
            downright += "#";
        }
        else {
            downright += "?";
        }

        let down = "";
        if (document.getElementById("down-infinite-input").checked) {
            down = "@@";
        }
        else {
            if ((parseInt(document.getElementById("down-input").value) < parseInt(document.getElementById("down-input").min)) || (document.getElementById("down-input").value == "")) {
                document.getElementById("down-input").value = document.getElementById("down-input").min;
            }
            else if (parseInt(document.getElementById("down-input").value) > parseInt(document.getElementById("down-input").max)) {
                document.getElementById("down-input").value = document.getElementById("down-input").max;
            }
            down = (parseInt(document.getElementById("down-input").value) >= 10) ? parseInt(document.getElementById("down-input").value) : "0" + parseInt(document.getElementById("down-input").value);
        }
        if (document.getElementById("down-jumping-input").checked) {
            down += "#";
        }
        else {
            down += "?";
        }

        let downleft = "";
        if (document.getElementById("downleft-infinite-input").checked) {
            downleft = "@@";
        }
        else {
            if ((parseInt(document.getElementById("downleft-input").value) < parseInt(document.getElementById("downleft-input").min)) || (document.getElementById("downleft-input").value == "")) {
                document.getElementById("downleft-input").value = document.getElementById("downleft-input").min;
            }
            else if (parseInt(document.getElementById("downleft-input").value) > parseInt(document.getElementById("downleft-input").max)) {
                document.getElementById("downleft-input").value = document.getElementById("downleft-input").max;
            }
            downleft = (parseInt(document.getElementById("downleft-input").value) >= 10) ? parseInt(document.getElementById("downleft-input").value) : "0" + parseInt(document.getElementById("downleft-input").value);
        }
        if (document.getElementById("downleft-jumping-input").checked) {
            downleft += "#";
        }
        else {
            downleft += "?";
        }

        let left = "";
        if (document.getElementById("left-infinite-input").checked) {
            left = "@@";
        }
        else {
            if ((parseInt(document.getElementById("left-input").value) < parseInt(document.getElementById("left-input").min)) || (document.getElementById("left-input").value == "")) {
                document.getElementById("left-input").value = document.getElementById("left-input").min;
            }
            else if (parseInt(document.getElementById("left-input").value) > parseInt(document.getElementById("left-input").max)) {
                document.getElementById("left-input").value = document.getElementById("left-input").max;
            }
            left = (parseInt(document.getElementById("left-input").value) >= 10) ? parseInt(document.getElementById("left-input").value) : "0" + parseInt(document.getElementById("left-input").value);
        }
        if (document.getElementById("left-jumping-input").checked) {
            left += "#";
        }
        else {
            left += "?";
        }

        let upleft = "";
        if (document.getElementById("upleft-infinite-input").checked) {
            upleft = "@@";
        }
        else {
            if ((parseInt(document.getElementById("upleft-input").value) < parseInt(document.getElementById("upleft-input").min)) || (document.getElementById("upleft-input").value == "")) {
                document.getElementById("upleft-input").value = document.getElementById("upleft-input").min;
            }
            else if (parseInt(document.getElementById("upleft-input").value) > parseInt(document.getElementById("upleft-input").max)) {
                document.getElementById("upleft-input").value = document.getElementById("upleft-input").max;
            }
            upleft = (parseInt(document.getElementById("upleft-input").value) >= 10) ? parseInt(document.getElementById("upleft-input").value) : "0" + parseInt(document.getElementById("upleft-input").value);
        }
        if (document.getElementById("upleft-jumping-input").checked) {
            upleft += "#";
        }
        else {
            upleft += "?";
        }

        code = name + "|" + color + "|" + points + "|" + movement + "|" + up + "|" + upright + "|" + right + "|" + downright + "|" + down + "|" + downleft + "|" + left + "|" + upleft;
    }
    else {
        code = name + "|" + color + "|" + points + "|" + movement;
        for (let i = 0; i < uniqueDots.length; i++) {
            let pos = uniqueDots[i];

            // 4 is subtracted by the index to get the distance from the center piece (at 4-4)
            // multiplied by -1 to get the inverse so that positive numbers represent going down and/or out, away from the top left(0-0)
            let y = (4 - parseInt(pos.substring(0, pos.indexOf("-")))) * -1;
            let x = (4 - parseInt(pos.substring(pos.indexOf("-") + 1))) * -1;
            code += "|" + (y + "_" + x);
        }
    }

    document.getElementById("generated-code").innerHTML = code;
    currentCode = code;
    if (!codeGenerated) {
        document.getElementById("code").innerHTML += "<button onclick='copyCode();'>Copy</button>";
        codeGenerated = true;
    }
}

// copies the code to the clipboard
function copyCode() {
    let x = document.getElementById("generated-code");
    navigator.clipboard.writeText(x.innerHTML);
}

// displays dots where the piece would be able to move
function showSpots() {
    if (!isStandard) {
        return;
    }

    hideSpots();

    let sections = currentCode.split("|");
    sections.splice(0, 4);

    // show up
    if (sections[0].substring(0, 2) == "@@") {
        for (let i = 1; i <= 4; i++) {
            document.getElementById((4 - i) + "-4").innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        }
    }
    else {
        let x = (parseInt(sections[0].substring(0, 2)) > 4) ? 4 : parseInt(sections[0].substring(0, 2));
        for (let i = 1; i <= x; i++) {
            document.getElementById((4 - i) + "-4").innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        }
    }

    // show up and right
    if (sections[1].substring(0, 2) == "@@") {
        for (let i = 1; i <= 4; i++) {
            document.getElementById((4 - i) + "-" + (4 + i)).innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        }
    }
    else {
        let x = (parseInt(sections[1].substring(0, 2)) > 4) ? 4 : parseInt(sections[1].substring(0, 2));
        for (let i = 1; i <= x; i++) {
            document.getElementById((4 - i) + "-" + (4 + i)).innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        }
    }

    // show right
    if (sections[2].substring(0, 2) == "@@") {
        for (let i = 1; i <= 4; i++) {
            document.getElementById("4-" + (4 + i)).innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        }
    }
    else {
        let x = (parseInt(sections[2].substring(0, 2)) > 4) ? 4 : parseInt(sections[2].substring(0, 2));
        for (let i = 1; i <= x; i++) {
            document.getElementById("4-" + (4 + i)).innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        }
    }

    // show down and right
    if (sections[3].substring(0, 2) == "@@") {
        for (let i = 1; i <= 4; i++) {
            document.getElementById((4 + i) + "-" + (4 + i)).innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        }
    }
    else {
        let x = (parseInt(sections[3].substring(0, 2)) > 4) ? 4 : parseInt(sections[3].substring(0, 2));
        for (let i = 1; i <= x; i++) {
            document.getElementById((4 + i) + "-" + (4 + i)).innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        }
    }

    // show down
    if (sections[4].substring(0, 2) == "@@") {
        for (let i = 1; i <= 4; i++) {
            document.getElementById((4 + i) + "-4").innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        }
    }
    else {
        let x = (parseInt(sections[4].substring(0, 2)) > 4) ? 4 : parseInt(sections[4].substring(0, 2));
        for (let i = 1; i <= x; i++) {
            document.getElementById((4 + i) + "-4").innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        }
    }

    // show down and left
    if (sections[5].substring(0, 2) == "@@") {
        for (let i = 1; i <= 4; i++) {
            document.getElementById((4 + i) + "-" + (4 - i)).innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        }
    }
    else {
        let x = (parseInt(sections[5].substring(0, 2)) > 4) ? 4 : parseInt(sections[5].substring(0, 2));
        for (let i = 1; i <= x; i++) {
            document.getElementById((4 + i) + "-" + (4 - i)).innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        }
    }


    // show left
    if (sections[6].substring(0, 2) == "@@") {
        for (let i = 1; i <= 4; i++) {
            document.getElementById("4-" + (4 - i)).innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        }
    }
    else {
        let x = (parseInt(sections[6].substring(0, 2)) > 4) ? 4 : parseInt(sections[6].substring(0, 2));
        for (let i = 1; i <= x; i++) {
            document.getElementById("4-" + (4 - i)).innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        }
    }

    // show up and left
    if (sections[7].substring(0, 2) == "@@") {
        for (let i = 1; i <= 4; i++) {
            document.getElementById((4 - i) + "-" + (4 - i)).innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        }
    }
    else {
        let x = (parseInt(sections[7].substring(0, 2)) > 4) ? 4 : parseInt(sections[7].substring(0, 2));
        for (let i = 1; i <= x; i++) {
            document.getElementById((4 - i) + "-" + (4 - i)).innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        }
    }

}

// hides the dots
function hideSpots() {
    let dot = document.querySelectorAll("img.dot");
    for (let i = 0; i < dot.length; i++) {
        dot[i].remove();
    }
}

function placeSpot(pos) {
    if (isStandard) {
        return;
    }

    if (document.getElementById(pos).firstChild != null) {
        document.getElementById(pos).removeChild(document.getElementById(pos).firstChild);
        uniqueDots.splice(uniqueDots.indexOf(pos), 1);
    }
    else {
        document.getElementById(pos).innerHTML += "<img class='dot' src=images/moveable-dot.png>";
        uniqueDots.push(pos);
    }

    console.log(uniqueDots)
}
