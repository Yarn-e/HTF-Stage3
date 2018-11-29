let player = {};
let pyramids = [];

$(document).ready(() => {
    window.setInterval(() => {
        renderData();
    }, 500);

    $(document).keydown(function (e) {
        switch (e.which) {
            case 37:
                player.x -= 3;
                break;

            case 38:
                player.y -= 3;// up
                break;

            case 39:
                player.x += 3;// right
                break;

            case 40:
                player.y += 3;// down
                break;

            default:
                return; // exit this handler for other keys
        }
        postPlayerLocation(player);
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
});




function fetchMap() {
    return fetch("http://involved-htf-js-2018-prod.azurewebsites.net/api/challenge/3", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "x-team": "lawyer"
        }
    }).then(function (response) {
        return response;
    }).then((data) => {
        return data.json();
    }).then((jsondata) => {
        return jsondata.tiles;
    });
}

async function renderData() {
    console.log("rendering");
    let tilesmap = await fetchMap();
    drawGrid(tilesmap);
}

function drawGrid(field) {
    let canvas = document.getElementById("map");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    pyramids = [];
    for (let tile of field) {
        switch (tile.type) {
            case 1:
                ctx.fillStyle = "brown";
                break;
            case 2:
                ctx.fillStyle = "blue";
                player.x = tile.x;
                player.y = tile.y;
                break;
            case 3:
                ctx.fillStyle = "orange";
                pyramids.push({"x": tile.x, "y": tile.y});
                break;
        }
        ctx.fillRect(tile.x * 10, tile.y * 10, 10, 10);
    }
    drawBoard();
}


function drawBoard() {
    let bw = 800;
    let bh = 450;
    let p = 0;
    let canvas = document.getElementById("map");
    let context = canvas.getContext("2d");
    for (let x = 0; x <= bw; x += 10) {
        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, bh + p);
    }


    for (let x = 0; x <= bh; x += 10) {
        context.moveTo(p, 0.5 + x + p);
        context.lineTo(bw + p, 0.5 + x + p);
    }

    context.strokeStyle = "darkgray";
    context.stroke();
}


function postPlayerLocation(moveTo) {
    fetch("http://involved-htf-js-2018-prod.azurewebsites.net/api/challenge/3/move", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "x-team": "lawyer"
        },
        body: JSON.stringify(moveTo)

    }).then(function (response) {
        return response;
    })
}

function postPyramids() {
    fetch("http://involved-htf-js-2018-prod.azurewebsites.net/api/challenge/3", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "x-team": "lawyer"
        },
        body: JSON.stringify(pyramids)

    }).then(function (response) {
        return response;
    })
}
