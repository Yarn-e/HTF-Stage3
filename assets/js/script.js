// Global variables
let player = {};
let pyramids = {};
let secretDoor = false;
let step = 1;


$(document).ready(() => {
    renderData();

    $(document).keydown(function (e) {
        switch (e.which) {
            case 37:
                player.x -= step; // left
                break;

            case 38:
                player.y -= step;// up
                break;

            case 39:
                player.x += step;// right
                break;

            case 40:
                player.y += step;// down
                break;

            default:
                return;
        }
        postPlayerLocation(player);
        sleep(50).then(() => {
            renderData();
        });
        e.preventDefault();
    });

    $('#steps').on('change', changeSteps);
});

/**
 * Adjust the amount of steps u want to take.
 * @param elem
 *   The input field.
 */
function changeSteps(elem) {
    step = parseInt(elem.target.value);
}

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
    }).then((jsonData) => {
        return jsonData.tiles;
    });
}

async function renderData() {
    let tilesMap = await fetchMap();
    drawGrid(tilesMap);
}

/**
 * Draws the grid of the game via the API data.
 *
 * @param field
 *   The given field data.
 */
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

    if (pyramids.length === 3 && !secretDoor) {
        postPyramids();
    }

    if (secretDoor) {
        drawDoor(secretDoor);
    }
}

/**
 * Sends a POST request to the API endpoint to send the new player location.
 *
 * @param moveTo
 *   The new location of the player.
 */
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

/**
 * Sends a POST request to the API endpoint to send the 3 pyramid locations.
 */
function postPyramids() {
    let body = JSON.stringify({"positions": pyramids});
    console.log(body);
    fetch("http://involved-htf-js-2018-prod.azurewebsites.net/api/challenge/3", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "x-team": "lawyer"
        },
        body: body

    }).then(function (response) {
        return response;
    }).then(data => {
        return data.json();
    }).then(jsondata => {
        console.log(jsondata);
        secretDoor = jsondata;
        drawDoor(jsondata);
    })
}

/**
 * Draws the door on the canvas.
 *
 * @param data
 *   The location of the door.
 */
function drawDoor(data) {
    let canvas = document.getElementById("map");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(data.x * 10, data.y * 10, 10, 10);
}

/**
 * Creates a sleep thread
 * @param time
 *   The time you want to sleep
 *
 * @returns {Promise<any>}
 */
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
