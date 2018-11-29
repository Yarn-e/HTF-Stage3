let player = {};
function fetchMap(){
    fetch("http://involved-htf-js-2018-prod.azurewebsites.net/api/challenge/3",{
        method: "GET",
        headers:{
            "Content-Type":  "application/json",
            "Accept": "application/json",
            "x-team" : "lawyer"
        }
    }).then(function(response){
        return response;
    }).then(data => {
        return data.json();
    }).then(jsondata => {
        drawGrid(jsondata.tiles);
    })
}

$(document).ready(() => {
    fetchMap();
    
})

function drawGrid(field){
    var canvas = document.getElementById("map");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    
    for(let tile of field){
        switch(tile.type){
            case 1: ctx.fillStyle = "brown";
                break;
            case 2: ctx.fillStyle = "blue";
                    player.x = tile.x;
                    player.y = tile.y;
                break;
            case 3: ctx.fillStyle = "orange";
                break;
        }
        ctx.fillRect(tile.x*10,tile.y*10,10,10);
    }
    console.log("klaar me tekenen");
}


function postSentence(sentence){
    console.log(sentence);
    fetch("http://involved-htf-js-2018-prod.azurewebsites.net/api/challenge/2",{
        method: "POST",
        headers:{
            "Content-Type":  "application/json",
            "Accept": "application/json",
            "x-team" : "lawyer"
        },
        body: JSON.stringify({"sentence" : sentence})
        
    }).then(function(response){
        return response;
    }).then(data => {
        console.log(data);
    })
}
